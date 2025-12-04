/* src/app/e-commerce/page.js */

import dbConnect from '../libs/mongoose';
import Product from '../models/Product';
import Navbar from 'components/Navbar';
import { convertDoc } from '../libs/convertDocs';
import ProductBrowser from 'components/ProductBrowser';

export default async function ProductsPage() {
  await dbConnect();
  const productsFromDb = await Product.find().lean();
  const products = productsFromDb.map(convertDoc);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">Shop Products</h1>
        <p className="text-gray-600 mb-8">
          Explore art prints, merch, illustrations and original creations.
        </p>

        <ProductBrowser initialProducts={products} />
      </div>
    </div>
  );
}