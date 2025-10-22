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
    <div className="card">
      <Link href={`/e-commerce/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5 text-center">
        <Link href={`/e-commerce/${product._id}`}>
          <h2 className="text-lg font-semibold">{product.name}</h2>
        </Link>
        <p className="text-gray-600 text-sm italic mb-1">
          by {product.artistName || "Unknown Artist"}
        </p>
        <p className="text-gray-700 mb-2">{product.category}</p>
        <p className="font-medium">RM{product.price}</p>
        <button
          className="primary-button mt-2"
          type="button"
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}