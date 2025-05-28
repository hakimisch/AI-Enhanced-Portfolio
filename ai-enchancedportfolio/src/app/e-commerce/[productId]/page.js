// src/app/e-commerce/[productId]/page.js

import Product from '@/app/models/Product';
import dbConnect from '@/app/libs/mongoose'; // ✅ your custom Mongoose connection
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ProductDetail({ params }) {
  await dbConnect(); // ✅ uses your reusable connection logic

  const product = await Product.findById(params.productId).lean();

  if (!product) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <Image src={product.image} alt={product.name} className="w-80 my-4" />
      <p>{product.description}</p>
      <p className="my-2">Brand: {product.brand}</p>
      <p className="my-2">Price: RM{product.price}</p>
      <p className="my-2">
        Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
      </p>
    </div>
  );
}