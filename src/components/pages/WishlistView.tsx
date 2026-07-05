import React from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../ProductCard";
import { Heart, ArrowRight } from "lucide-react";

export const WishlistView: React.FC = () => {
  const { wishlist, products, setActiveTab } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-none border border-[#E5E5E1] bg-white text-neutral-400 dark:bg-neutral-800">
          <Heart className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest dark:text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">Flag your beloved acoustical, wearable, and sartorial items as you browse our collections.</p>
        </div>
        <button onClick={() => setActiveTab("shop")} className="rounded-none bg-[#1A1A1A] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white dark:bg-white dark:text-neutral-950">
          Browse Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Your Selections</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">My Wishlist</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#E5E5E1] pt-8 dark:border-neutral-800">
        {wishlistedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
};
