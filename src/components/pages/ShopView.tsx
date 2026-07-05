import React, { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../ProductCard";
import { Grid, List, SlidersHorizontal, Star, Search, RotateCcw, Sparkles } from "lucide-react";
import { Product } from "../../types";

export const ShopView: React.FC = () => {
  const { products, categories, brands } = useStore();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");

  // Handle live search events from navbar
  useEffect(() => {
    const handleNavbarSearch = (e: Event) => {
      const q = (e as CustomEvent).detail;
      setSearchQuery(q);
    };

    window.addEventListener("aura_search", handleNavbarSearch);
    return () => window.removeEventListener("aura_search", handleNavbarSearch);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (priceRange) {
      result = result.filter(p => p.price <= priceRange);
    }

    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    if (onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, minRating, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange(500);
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy("default");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E5E5E1] pb-6 mb-8 dark:border-neutral-800">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Aura Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Sartorial Galleries</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
          
          {/* SEARCH INPUT */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter current gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-none border border-[#E5E5E1] bg-white py-2 pl-4 pr-10 text-xs font-semibold outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-600"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          </div>

          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center space-x-1 border border-[#E5E5E1] rounded-none p-1 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-none p-1.5 transition-colors ${viewMode === "grid" ? "bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-none p-1.5 transition-colors ${viewMode === "list" ? "bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* SORT SELECTOR */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-none border border-[#E5E5E1] bg-white px-4 py-2 text-xs font-bold outline-none cursor-pointer text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Alphabetical</option>
          </select>

        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-neutral-800">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </h2>
            <button 
              onClick={resetFilters} 
              className="text-[10px] font-bold tracking-wide uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* CATEGORIES */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Collections</h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => setSelectedCategory("")}
                className={`text-left text-xs py-1 px-2 rounded-lg font-medium transition-all ${selectedCategory === "" ? "bg-neutral-50 font-bold text-neutral-950 dark:bg-neutral-800/40 dark:text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs py-1 px-2 rounded-lg font-medium transition-all ${selectedCategory === cat ? "bg-neutral-50 font-bold text-neutral-950 dark:bg-neutral-800/40 dark:text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* BRANDS */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Brands</h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => setSelectedBrand("")}
                className={`text-left text-xs py-1 px-2 rounded-lg font-medium transition-all ${selectedBrand === "" ? "bg-neutral-50 font-bold text-neutral-950 dark:bg-neutral-800/40 dark:text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"}`}
              >
                All Brands
              </button>
              {brands.map((br) => (
                <button
                  key={br}
                  onClick={() => setSelectedBrand(br)}
                  className={`text-left text-xs py-1 px-2 rounded-lg font-medium transition-all ${selectedBrand === br ? "bg-neutral-50 font-bold text-neutral-950 dark:bg-neutral-800/40 dark:text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"}`}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Max Price</h3>
              <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">${priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-800 accent-neutral-950 dark:accent-white"
            />
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400">
              <span>$20</span>
              <span>$500</span>
            </div>
          </div>

          {/* RATING */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Minimum Rating</h3>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setMinRating(val === minRating ? 0 : val)}
                  className={`flex items-center justify-center h-8 w-8 rounded-full border transition-all text-xs font-bold ${minRating === val ? "bg-neutral-950 border-neutral-950 text-white dark:bg-white dark:border-white dark:text-neutral-950" : "border-gray-200 text-neutral-500 hover:border-gray-400 dark:border-neutral-800 dark:text-neutral-400"}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* AVAILABILITY */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Exclude Out of Stock</span>
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-gray-300 text-neutral-900 focus:ring-neutral-900 outline-none cursor-pointer"
            />
          </div>

        </aside>

        {/* PRODUCTS AREA */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <span className="text-sm font-bold text-neutral-400">No matching products found.</span>
              <p className="text-xs text-neutral-500 max-w-sm">Try widening your search terms or resetting the price sliders to display all designer collection pieces.</p>
              <button onClick={resetFilters} className="rounded-full bg-neutral-950 text-white text-xs font-bold px-6 py-2.5 dark:bg-white dark:text-neutral-950">
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            // LIST VIEW
            <div className="space-y-4">
              {filteredProducts.map((p) => {
                return (
                  <div 
                    key={p.id}
                    onClick={() => {
                      const event = new CustomEvent("aura_select", { detail: p.id });
                      window.dispatchEvent(event);
                    }}
                    className="flex flex-col sm:flex-row items-center gap-6 border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-gray-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.02)] bg-white dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700"
                  >
                    <img src={p.images[0]} alt={p.name} className="h-28 w-28 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-between">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{p.brand} • {p.category}</span>
                        <div className="flex items-center space-x-1 hidden sm:flex">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">{p.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-neutral-800 dark:text-white truncate">{p.name}</h3>
                      <p className="text-xs text-neutral-400 max-w-lg line-clamp-2">{p.description}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-between gap-2 pt-2">
                        <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">${p.price.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold ${p.stock === 0 ? "text-red-500" : "text-neutral-400"}`}>{p.stock === 0 ? "Out of stock" : `In stock: ${p.stock}`}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
