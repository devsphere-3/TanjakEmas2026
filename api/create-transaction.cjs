const MidtransSnap = require('midtrans-client').Snap;
const { createClient } = require('@supabase/supabase-js');

const snap = new MidtransSnap({
  isProduction: false, // Sandbox — ganti true saat go-live
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel kadang tidak otomatis parse body — handle manual jika perlu
  let body = req.body;
  if (!body) {
    return res.status(400).json({ error: 'Request body kosong.' });
  }
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Request body bukan JSON valid.' });
    }
  }

  const { orderId, grossAmount, itemDetails, customerDetails } = body;

  if (!orderId || !grossAmount || !itemDetails || !customerDetails) {
    return res.status(400).json({
      error: 'Payload tidak lengkap. orderId, grossAmount, itemDetails, customerDetails diperlukan.',
    });
  }

  // Validasi server key tersedia
  if (!process.env.MIDTRANS_SERVER_KEY) {
    console.error('MIDTRANS_SERVER_KEY tidak ditemukan.');
    return res.status(500).json({ error: 'Konfigurasi server tidak lengkap.' });
  }

  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(grossAmount),
      },
      item_details: itemDetails.map((item) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      customer_details: customerDetails,
      credit_card: { secure: true },
      enabled_payments: [
        'gopay', 'shopeepay', 'permata',
        'bca_va', 'bni_va', 'mandiri_va', 'bri_va', 'cimb_va',
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan ke Supabase — non-blocking, tidak menghentikan response jika gagal
    const schoolId = itemDetails[0]?.id ?? null;
    const schoolName = String(itemDetails[0]?.name ?? '').replace('Voting ', '');
    const voteQuantity = Number(itemDetails[0]?.quantity ?? 1);

    supabase.from('transactions').insert({
      order_id: orderId,
      school_id: schoolId,
      school_name: schoolName,
      vote_quantity: voteQuantity,
      gross_amount: Number(grossAmount),
      status: 'pending',
    }).then(({ error }) => {
      if (error) console.error('Supabase insert error:', error.message);
    });

    return res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error('create-transaction error:', error?.message ?? error);
    return res.status(500).json({
      error: error?.message || 'Gagal membuat transaksi Midtrans.',
    });
  }
};
