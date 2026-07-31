const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const notification = req.body;
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = notification;

    // Verifikasi signature: SHA512(order_id + status_code + gross_amount + server_key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.warn('Signature tidak valid untuk order:', order_id);
      return res.status(403).json({ error: 'Signature tidak valid.' });
    }

    // Tentukan status
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

    // Update status transaksi
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

    // Jika sukses, increment vote
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
    console.error('notification error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
