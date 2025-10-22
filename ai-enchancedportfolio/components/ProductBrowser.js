/*components/ProductBrowser*/

'use client';
import { useEffect, useState } from 'react';
import ProductList from '@/app/e-commerce/ProductList';
import { Range } from 'react-range';

export default function ProductBrowser({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  // --- Debounced state (to reduce excessive fetches) ---
  const [debouncedFilters, setDebouncedFilters] = useState({
    search,
    category,
    priceRange,
  });

  // Debounce effect: wait before updating filters
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ search, category, priceRange });
    }, 200); 
    return () => clearTimeout(handler);
  }, [search, category, priceRange]);

  // --- Fetch products when filters change (debounced) ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { search, category, priceRange } = debouncedFilters;
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (priceRange[0] > 0) params.append('min', priceRange[0]);
        if (priceRange[1] > 0 && priceRange[1] !== maxPrice) {
          params.append('max', priceRange[1]);
        }  
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching filtered products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedFilters]);

  // --- Fetch categories and dynamic price max once ---
  useEffect(() => {
    const fetchCategoriesAndMax = async () => {
      try {
        const res = await fetch('/api/products');
        const all = await res.json();
        const distinct = [...new Set(all.map((p) => p.category))];
        setCategories(distinct);

        const max = all.length > 0 ? Math.ceil(Math.max(...all.map((p) => p.price))) : 500;
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (err) {
        console.error('Error fetching categories or max price', err);
      }
    };
    fetchCategoriesAndMax();
  }, []);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setPriceRange([0, maxPrice]);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8 items-end">
        {/* Search */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm text-gray-600 mb-1">Category</label>
          <select
            className="border p-2 rounded"
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

        {/* Price Range */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm text-gray-600 mb-2">
            Price Range (RM{priceRange[0]} - RM{priceRange[1]})
          </label>

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
                  className="h-2 w-full bg-gray-200 rounded-full cursor-pointer"
                >
                  <div
                    className="h-2 bg-gray-500 rounded-full"
                    style={{
                      marginLeft: `${(priceRange[0] / maxPrice) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`,
                    }}
                  />
                  {children}
                </div>
              )}
              renderThumb={({ props }) => {
                const { key, ...thumbProps } = props; // ✅ remove key from spread
                return (
                  <div
                    key={key}
                    {...thumbProps}
                    className="h-4 w-4 bg-gray-700 rounded-full shadow focus:outline-none"
                  />
                );
              }}
            />
          ) : (
            <p className="text-gray-400 text-sm">Loading price range...</p>
          )}
        </div>

        {/* Reset */}
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading + No Results + Product List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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