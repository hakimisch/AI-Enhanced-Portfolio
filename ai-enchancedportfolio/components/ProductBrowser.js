/*components/ProductBrowser*/

"use client";
import { useEffect, useState } from "react";
import ProductList from "@/app/e-commerce/ProductList";
import { Range } from "react-range";

export default function ProductBrowser({ initialProducts }) {
  // --- Sort helper (Newest → Oldest) ---
  const sortNewestFirst = (products) =>
    [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

  const [products, setProducts] = useState(
    sortNewestFirst(initialProducts || [])
  );
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

  // --- Debounce filters ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ search, category, priceRange });
    }, 200);

    return () => clearTimeout(handler);
  }, [search, category, priceRange]);

  // --- Fetch filtered products (sorted newest first) ---
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

        setProducts(sortNewestFirst(data));
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedFilters, maxPrice]);

  // --- Load categories + max price ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/products");
        const all = sortNewestFirst(await res.json());

        setCategories([...new Set(all.map((p) => p.category))]);

        const max =
          all.length > 0
            ? Math.ceil(Math.max(...all.map((p) => p.price)))
            : 500;

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
      <div
        className="
          mb-10 p-6 rounded-2xl relative overflow-hidden 
          border border-gray-200 
          shadow-[0_4px_30px_rgba(0,0,0,0.05)]
          bg-white/70 backdrop-blur-xl
        "
      >
        {/* Glow accents */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl" />

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          {/* Search */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              className="
                border border-gray-300 p-3 rounded-xl 
                shadow-sm 
                bg-white/60 backdrop-blur 
                focus:ring-2 focus:ring-purple-400 
                transition
              "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              className="
                border border-gray-300 p-3 rounded-xl 
                shadow-sm 
                bg-white/60 backdrop-blur 
                focus:ring-2 focus:ring-purple-400 
                transition
              "
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

          {/* Price Slider */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-gray-700 font-medium mb-1">
              Price (RM{priceRange[0]} - RM{priceRange[1]})
            </label>

            <div className="px-2 py-1">
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
                      className="h-2 w-full bg-gray-200 rounded-full cursor-pointer relative"
                    >
                      <div
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{
                          marginLeft: `${
                            (priceRange[0] / maxPrice) * 100
                          }%`,
                          width: `${
                            ((priceRange[1] - priceRange[0]) / maxPrice) *
                            100
                          }%`,
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
                        className="
                          h-5 w-5 bg-white border border-purple-500 
                          rounded-full shadow
                        "
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
              className="
                h-11 px-6 rounded-xl 
                bg-gradient-to-r from-gray-100 to-gray-200 
                text-gray-700 shadow-sm 
                hover:shadow-md hover:-translate-y-0.5 
                transition font-medium
              "
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
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
