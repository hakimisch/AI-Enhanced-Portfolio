import db from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(req, res) {
  const { id } = req.query;
  await db.connect();
  const product = await Product.findById(id).lean();
  await db.disconnect();
  res.status(200).json(product);
}