'use client';

// src/app/artist/merchandise/products/page.js

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminMerchandise() {
  const pathname = usePathname();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    _id: '',
    name: '',
    category: '',
    image: '',
    price: '',
    countInStock: '',
    description: '',
  });

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch all products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products/artist');
    const data = await res.json();
    setProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/products/${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    console.log(form);

    setForm({ _id: '', name: '', category: '', image: '', price: '', countInStock: '', description: '' });
    setEditing(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Merch Management</h1>

      {/* ✅ Tab navigation */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/artist/merchandise/products"
          className={`px-4 py-2 rounded ${
            pathname.includes("/products")
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Products
        </Link>
        <Link
          href="/artist/merchandise/orders"
          className={`px-4 py-2 rounded ${
            pathname.includes("/orders")
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Orders
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded bg-white">
        <h2 className="text-xl font-semibold">{editing ? 'Edit Product' : 'Add New Product'}</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="w-full p-2 border" />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            setUploading(true);
            const res = await fetch('/api/products/upload', {
              method: 'POST',
              body: formData,
            });

            const data = await res.json();
            setForm((prev) => ({ ...prev, image: data.url }));
            setUploading(false);
          }}
          className="w-full mb-2"
        />
        {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
        {form.image && (
          
          <Image
            src={form.image}
            alt="Preview"
            width={200}
            height={96}
            className="h-24 object-cover mt-2"
          />
        )}

        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 border" />
        <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} placeholder="Stock Count" required className="w-full p-2 border" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Create'} Product</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({ _id: '', name: '', category: '', image: '', price: '', countInStock: '', description: '' });
            }}
            className="ml-4 text-gray-600 underline"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.category}</td>
              <td className="border px-4 py-2">RM{product.price}</td>
              <td className="border px-4 py-2">{product.countInStock}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}