"use client";

import { useStore } from "@/app/context/StoreContext";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }) {
  const { dispatch } = useStore();
  const router = useRouter();

  const addToCart = () => {
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: 1 },
    });

    router.push("/e-commerce/cart");
  };

  return (
    <button
      onClick={addToCart}
      className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 transition shadow-md"
    >
      Add to Cart
    </button>
  );
}
