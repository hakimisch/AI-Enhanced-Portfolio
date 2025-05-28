import db from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  res.status(200).json(products);
}