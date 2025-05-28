/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/e-commerce/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/e-commerce/${product._id}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>RM{product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}