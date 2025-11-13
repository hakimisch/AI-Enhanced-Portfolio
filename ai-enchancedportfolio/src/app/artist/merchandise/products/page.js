//artist/merchandise/products/page.js

"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardLayout from "components/DashboardLayout";

export default function ArtistProductsPage() {
  const pathname = usePathname();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    category: "",
    image: "",
    price: "",
    countInStock: "",
    description: "",
  });

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products/artist");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editing
      ? `/api/products/${form._id}`
      : "/api/products";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      _id: "",
      name: "",
      category: "",
      image: "",
      price: "",
      countInStock: "",
      description: "",
    });
    setEditing(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/products/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.url }));
    setUploading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Merchandise Management
        </h1>

        {/* 🧭 Tabs */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/artist/merchandise/products"
            className={`px-4 py-2 rounded-lg ${
              pathname.includes("/products")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Products
          </Link>
          <Link
            href="/artist/merchandise/orders"
            className={`px-4 py-2 rounded-lg ${
              pathname.includes("/orders")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Orders
          </Link>
        </div>

        {/* ✏️ Add / Edit Product */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm mb-10 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            {editing ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Upload Image */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-600">
              Product Image
            </label>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {form.image ? "Change Image" : "Upload Image"}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploading && (
                <p className="text-sm text-gray-500">Uploading...</p>
              )}
            </div>

            {form.image && (
              <div className="mt-2">
                <Image
                  src={form.image}
                  alt="Preview"
                  width={200}
                  height={120}
                  className="object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (RM)"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={handleChange}
              placeholder="Stock Count"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editing ? "Update Product" : "Create Product"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setForm({
                    _id: "",
                    name: "",
                    category: "",
                    image: "",
                    price: "",
                    countInStock: "",
                    description: "",
                  });
                }}
                className="text-gray-600 underline"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* 🧾 Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price (RM)</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-3">{product.name}</td>
                  <td className="px-6 py-3">{product.category}</td>
                  <td className="px-6 py-3">RM{product.price}</td>
                  <td className="px-6 py-3">{product.countInStock}</td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}