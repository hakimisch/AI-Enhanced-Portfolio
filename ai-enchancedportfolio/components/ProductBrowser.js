/*components/ProductBrowser*/

"use client";
import { useEffect, useState } from "react";
import ProductList from "@/app/e-commerce/ProductList";
import { Range } from "react-range";

export default function ProductBrowser({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  const [debouncedFilters, setDebouncedFilters] = useState({
    search,
    category,
    priceRange,
  });

  // --- Debounce ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ search, category, priceRange });
    }, 200);

    return () => clearTimeout(handler);
  }, [search, category, priceRange]);

  // --- Fetch filtered products ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { search, category, priceRange } = debouncedFilters;
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (priceRange[0] > 0) params.append("min", priceRange[0]);
        if (priceRange[1] > 0 && priceRange[1] !== maxPrice)
          params.append("max", priceRange[1]);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedFilters]);

  // --- Load categories + max price ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/products");
        const all = await res.json();

        setCategories([...new Set(all.map((p) => p.category))]);

        const max = all.length > 0 ? Math.ceil(Math.max(...all.map((p) => p.price))) : 500;
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (err) {
        console.error("Error loading categories or prices", err);
      }
    };

    loadInitialData();
  }, []);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="w-full">
      {/* FILTER BAR */}
      <div className="p-4 mb-8 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Search */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Category</label>
            <select
              className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price slider */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-gray-600 mb-1">
              Price (RM{priceRange[0]} - RM{priceRange[1]})
            </label>

            <div className="px-1 py-1">
              {maxPrice > 0 ? (
                <Range
                  step={1}
                  min={0}
                  max={maxPrice}
                  values={priceRange}
                  onChange={setPriceRange}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-1.5 w-full bg-gray-200 rounded-full cursor-pointer"
                    >
                      <div
                        className="h-1.5 bg-blue-500 rounded-full"
                        style={{
                          marginLeft: `${(priceRange[0] / maxPrice) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => {
                    const { key, ...thumbProps } = props;
                    return (
                      <div
                        key={key}
                        {...thumbProps}
                        className="h-4 w-4 bg-white border border-blue-500 rounded-full shadow-md"
                      />
                    );
                  }}
                />
              ) : (
                <p className="text-gray-400 text-sm">Loading...</p>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="h-11 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No products found. Try adjusting your filters.
        </p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
