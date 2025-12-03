//src/app/e-commerce/cart/page.js

"use client";

import { useStore } from "@/app/context/StoreContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state, dispatch } = useStore();
  const { cart } = state;
  const router = useRouter();

  const increaseQty = (item) => {
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity: item.quantity + 1 },
    });
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) {
      dispatch({ type: "CART_REMOVE_ITEM", payload: item });
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity: item.quantity - 1 },
    });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const totalItems = cart.cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {/* Empty Cart */}
      {cart.cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white shadow-sm rounded-xl border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>

          <Link
            href="/e-commerce"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Continue Shopping →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Cart Items */}
          {cart.cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-xl shadow-sm p-4 border border-gray-200"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {item.category}
                  </p>

                  <p className="text-blue-600 font-semibold mt-1">
                    RM{item.price}
                  </p>

                  {/* Subtotal */}
                  <p className="text-gray-800 font-medium mt-1">
                    Subtotal: RM{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Controller */}
              <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                
                {/* +/- Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-bold"
                  >
                    –
                  </button>

                  <span className="px-4 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItemHandler(item)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Section */}
          <div className="mt-4 p-6 rounded-xl shadow-md bg-white border border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Total ({totalItems} items)
                </p>

                <p className="text-3xl font-bold text-blue-700 mt-1">
                  RM{totalPrice.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-4 mt-6 md:mt-0">
                <Link
                  href="/e-commerce"
                  className="px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200 transition font-medium"
                >
                  ← Continue Shopping
                </Link>

                <button
                  onClick={() => router.push("/e-commerce/checkout")}
                  className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
