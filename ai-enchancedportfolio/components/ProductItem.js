// components/ProductItem.js

"use client";
import Link from "next/link";
import { useStore } from "@/app/context/StoreContext";

export default function ProductItem({ product }) {
  const { state, dispatch } = useStore();

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
      <Link href={`/e-commerce/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      </Link>

      <div className="p-5 text-center">
        <Link href={`/e-commerce/${product._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
            {product.name}
          </h2>
        </Link>

        <p className="text-gray-500 text-sm mb-1">
          by {product.artistName || "Unknown Artist"}
        </p>

        <p className="text-gray-600 text-xs uppercase tracking-wide mb-2">
          {product.category}
        </p>

        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
          RM{product.price}
        </p>

        <button
          type="button"
          onClick={addToCartHandler}
          className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
