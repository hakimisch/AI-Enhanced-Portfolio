//src/app/e-commerce/ProductList.jsx

'use client';

import { useStore } from '../context/StoreContext';
import ProductItem from 'components/ProductItem';

export default function ProductList({ products }) {
  const { state, dispatch } = useStore();

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const res = await fetch(`/api/products/${product._id}`);
    const data = await res.json();

    if (data.countInStock < quantity) {
      alert('Product is out of stock');
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-8 pl-6">
      {products.map((product) => (
        <ProductItem
          key={product._id}
          product={product}
          addToCartHandler={addToCartHandler}
        />
      ))}
    </div>
  );
}