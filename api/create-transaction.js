const MidtransSnap = require('midtrans-client').Snap;
const { createClient } = require('@supabase/supabase-js');

const snap = new MidtransSnap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: customerDetails,
      credit_card: { secure: true },
      enabled_payments: [
        'gopay', 'shopeepay', 'permata',
        'bca_va', 'bni_va', 'mandiri_va', 'bri_va', 'cimb_va',
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan transaksi ke Supabase dengan status pending
    const schoolId = itemDetails[0]?.id ?? null;
    const schoolName = itemDetails[0]?.name?.replace('Voting ', '') ?? '';
    const voteQuantity = Number(itemDetails[0]?.quantity ?? 1);

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
    }

    return res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error('create-transaction error:', error);
    return res.status(500).json({ error: error?.message || 'Gagal membuat transaksi.' });
  }
};
