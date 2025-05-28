'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/context/StoreContext';

export default function CheckoutPage() {
  const { state } = useStore();
  const router = useRouter();
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Shipping:', shippingInfo);
    console.log('Order:', state.cart.cartItems);

    // Next: Save order to DB, redirect to payment, etc.
    router.push('/e-commerce/thank-you');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <input
        placeholder="Full Name"
        value={shippingInfo.name}
        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
        className="block mb-4 p-2 border"
      />
      <input
        placeholder="Address"
        value={shippingInfo.address}
        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
        className="block mb-4 p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Place Order
      </button>
    </form>
  );
}