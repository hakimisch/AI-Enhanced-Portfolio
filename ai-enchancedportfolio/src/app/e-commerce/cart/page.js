"use client";
import { useStore } from "@/app/context/StoreContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state, dispatch } = useStore();
  const { cart } = state;
  const router = useRouter();

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const totalItems = cart.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Shopping Cart</h1>

      {cart.cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/e-commerce" className="text-blue-500 hover:underline">
            Go shopping →
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {cart.cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-center border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-500">RM{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <span>Qty: {item.quantity}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItemHandler(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t pt-4">
            <p className="text-xl font-semibold">
              Total ({totalItems} items): RM{totalPrice.toFixed(2)}
            </p>

            <button
              onClick={() => router.push("/e-commerce/checkout")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4 md:mt-0 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}