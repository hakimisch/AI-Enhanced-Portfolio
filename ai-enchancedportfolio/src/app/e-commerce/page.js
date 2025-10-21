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
    <div>
      
      <div className="p-8">
        <h2 className="text-3xl font-semibold mb-4">Products</h2>
        <ProductBrowser initialProducts={products} />
      </div>
    </div>
  );
}