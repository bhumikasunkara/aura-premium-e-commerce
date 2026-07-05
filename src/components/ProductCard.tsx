import React from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { Heart, ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist, addToCart, setActiveTab, setSelectedProductId } = useStore();

  const isWishlisted = wishlist.includes(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActiveTab("product");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use first color and size if available, otherwise default
    const color = product.variants.colors?.[0] || "Standard";
    const size = product.variants.sizes?.[0] || "Standard";
    addToCart(product.id, 1, size, color);
    
    // Dispatch instant animation/toast notification event
    const event = new CustomEvent("aura_toast", { 
      detail: { 
        message: `${product.name} added to cart.`, 
        type: "success" 
      } 
    });
    window.dispatchEvent(event);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    
    const event = new CustomEvent("aura_toast", { 
      detail: { 
        message: isWishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist.`, 
        type: "info" 
      } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-none border border-[#E5E5E1] bg-white p-4 transition-all duration-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* BADGES / WISHLIST */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-1.5">
        {product.isFeatured && (
          <span className="rounded-none bg-[#1A1A1A] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white border border-[#E5E5E1]/20">
            Featured
          </span>
        )}
        {product.isBestSeller && (
          <span className="rounded-none bg-[#D4AF37] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="rounded-none bg-neutral-900 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white border border-[#E5E5E1]/20">
            New
          </span>
        )}
      </div>

      <button
        onClick={handleWishlistToggle}
        className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-none border border-[#E5E5E1] bg-white text-neutral-500 shadow-sm transition-all hover:bg-neutral-100 hover:text-red-500 active:scale-90 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
      >
        <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* PRODUCT IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden rounded-none bg-gray-50/50 dark:bg-neutral-950">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 grayscale hover:grayscale-0"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* QUICK ADD OVERLAY */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center px-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`flex w-full items-center justify-center space-x-2 rounded-none py-2.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${product.stock === 0 ? "bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-800" : "bg-[#1A1A1A] text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{product.stock === 0 ? "Out of Stock" : "Quick Add"}</span>
          </button>
        </div>
      </div>

      {/* METADATA */}
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {product.brand} • {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200">{product.rating}</span>
          </div>
        </div>

        <h3 className="mt-1 font-sans text-xs font-semibold leading-tight text-neutral-800 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white transition-colors uppercase tracking-wide">
          {product.name}
        </h3>

        <div className="mt-3 pt-3 border-t border-[#E5E5E1]/40 dark:border-neutral-800/40 flex items-center justify-between">
          <span className="font-serif text-base italic font-normal text-[#1A1A1A] dark:text-neutral-50">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-neutral-400"}`}>
            {product.stock === 0 ? "Out of stock" : product.stock <= 5 ? `${product.stock} left` : "In stock"}
          </span>
        </div>
      </div>
    </div>
  );
};
