const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MidtransSnap = require('midtrans-client').Snap;
const MidtransCoreApi = require('midtrans-client').CoreApi;
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Midtrans ─────────────────────────────────────────────────────────────────
const serverKey = process.env.MIDTRANS_SERVER_KEY;
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

if (!serverKey) {
  console.warn('MIDTRANS_SERVER_KEY tidak ditemukan di .env.');
}

const snap = new MidtransSnap({ isProduction, serverKey });
const coreApi = new MidtransCoreApi({ isProduction, serverKey });

// ── Supabase (service_role — hanya untuk backend) ─────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Midtrans + Supabase backend is running' });
});

// ── Buat transaksi Midtrans ───────────────────────────────────────────────────
app.post('/create-transaction', async (req, res) => {
  try {
    const { orderId, grossAmount, itemDetails, customerDetails } = req.body;

    if (!orderId || !grossAmount || !itemDetails || !customerDetails) {
      return res.status(400).json({
        error: 'Payload tidak lengkap. orderId, grossAmount, itemDetails, customerDetails diperlukan.',
      });
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(grossAmount),
      },
      item_details: itemDetails.map((item) => ({
        id: String(item.id).substring(0, 50),
        price: Number(item.price),
        quantity: Number(item.quantity),
        // Midtrans limit: 50 karakter
        name: String(item.name).substring(0, 50),
      })),
      customer_details: customerDetails,
      credit_card: { secure: true },
      enabled_payments: [
        'gopay', 'shopeepay', 'permata',
        'bca_va', 'bni_va', 'mandiri_va', 'bri_va', 'cimb_va',
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan transaksi ke Supabase dengan status 'pending'
    const schoolId = itemDetails[0]?.id ?? null;
    const schoolName = itemDetails[0]?.name?.replace('Voting ', '') ?? '';
    const voteQuantity = itemDetails[0]?.quantity ?? 1;

    const { error: dbError } = await supabase.from('transactions').insert({
      order_id: orderId,
      school_id: schoolId,
      school_name: schoolName,
      vote_quantity: voteQuantity,
      gross_amount: grossAmount,
      status: 'pending',
    });

    if (dbError) {
      console.error('Gagal menyimpan transaksi ke Supabase:', dbError.message);
      // Tetap lanjutkan — pembayaran tidak boleh diblok karena error DB
    }

    return res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error?.message || 'Gagal membuat transaksi.' });
  }
});

// ── Webhook notifikasi Midtrans ───────────────────────────────────────────────
app.post('/notification', async (req, res) => {
  try {
    const notification = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = notification;

    // Verifikasi signature Midtrans: SHA512(order_id + status_code + gross_amount + server_key)
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.warn('Signature tidak valid untuk order:', order_id);
      return res.status(403).json({ error: 'Signature tidak valid.' });
    }

    // Tentukan status transaksi
    let status = 'pending';
    const isSuccess =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement';
    const isFailed =
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire';

    if (isSuccess) status = 'success';
    else if (isFailed) status = 'failed';

    // Update status transaksi di Supabase
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('order_id', order_id)
      .select('school_id, vote_quantity')
      .single();

    if (txError) {
      console.error('Gagal update transaksi:', txError.message);
      return res.status(500).json({ error: 'Gagal update transaksi.' });
    }

    // Jika pembayaran berhasil, tambahkan vote_count ke tabel votes
    if (isSuccess && txData?.school_id) {
      const { error: voteError } = await supabase.rpc('increment_vote', {
        p_school_id: txData.school_id,
        p_amount: txData.vote_quantity,
      });

      if (voteError) {
        console.error('Gagal increment vote:', voteError.message);
      }
    }

    return res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('Error di /notification:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
