'use client';

import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';

export default function AddToCartSection({ product }) {
  const { state, dispatch } = useStore();
  const router = useRouter();

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });

    router.push('/e-commerce/cart');
  };

  return (
    <button
      onClick={addToCartHandler}
      className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
    >
      Add to Cart
    </button>
  );
}