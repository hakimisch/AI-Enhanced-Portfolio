'use client';

import { useStore } from '@/app/context/StoreContext';
import Link from 'next/link';

export default function CartPage() {
  const { state, dispatch } = useStore();
  const { cartItems } = state.cart;

  const removeFromCartHandler = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between my-2">
              <span>{item.name} (x{item.quantity})</span>
              <button
                onClick={() => removeFromCartHandler(item._id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <Link href="/e-commerce/checkout">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}