import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-3xl font-semibold mb-4 text-green-600">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase. You’ll receive an email confirmation soon.
      </p>
      <Link
        href="/e-commerce"
        className="text-blue-600 hover:underline text-lg"
      >
        Continue Shopping →
      </Link>
    </div>
  );
}