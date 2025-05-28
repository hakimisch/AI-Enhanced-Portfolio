import dbConnect from '../libs/mongoose';
import Product from '../models/Product';
import ProductList from './ProductList';
import Navbar from 'components/Navbar';
import { convertDoc } from '../libs/convertDocs';

export default async function ProductsPage() {
  await dbConnect();
  const productsFromDb = await Product.find().lean();
  const products = productsFromDb.map(convertDoc); // <- convert for client use

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h2 className="text-3xl font-semibold mb-4">Products</h2>

        <div className="hidden md:block">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}