import React, { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { Star, Heart, ShoppingBag, Truck, RotateCcw, ShieldAlert, ChevronLeft, Send } from "lucide-react";
import { Product, Review } from "../../types";

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    addToCart,
    toggleWishlist,
    wishlist,
    user,
    addReview,
    setActiveTab
  } = useStore();

  const product = products.find(p => p.id === selectedProductId);

  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // New Review Form States
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Hover Zoom States
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ backgroundPosition: "0% 0%" });

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      setSelectedSize(product.variants.sizes?.[0] || "One Size");
      setSelectedColor(product.variants.colors?.[0] || "Standard");
      setQuantity(1);
      setReviewSuccess(false);
      setNewComment("");
      setNewRating(5);

      // Fetch reviews from server
      fetch(`/api/reviews/${product.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setReviews(data));
    }
  }, [product, selectedProductId]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-sm font-bold text-neutral-400">No product selected or found.</p>
        <button onClick={() => setActiveTab("shop")} className="mt-4 rounded-full bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white">
          Back to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedSize, selectedColor);
    
    const event = new CustomEvent("aura_toast", { 
      detail: { 
        message: `${quantity}x ${product.name} (${selectedColor}/${selectedSize}) added to cart.`, 
        type: "success" 
      } 
    });
    window.dispatchEvent(event);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    const event = new CustomEvent("aura_toast", { 
      detail: { 
        message: isWishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist.`, 
        type: "info" 
      } 
    });
    window.dispatchEvent(event);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%"
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      const event = new CustomEvent("aura_toast", { 
        detail: { message: "Please log in to submit reviews.", type: "error" } 
      });
      window.dispatchEvent(event);
      return;
    }

    if (!newComment.trim()) return;

    setSubmittingReview(true);
    const success = await addReview(product.id, newRating, newComment);
    setSubmittingReview(false);

    if (success) {
      setReviewSuccess(true);
      setNewComment("");
      
      // Refresh local reviews
      const freshRes = await fetch(`/api/reviews/${product.id}`);
      if (freshRes.ok) setReviews(await freshRes.json());

      const event = new CustomEvent("aura_toast", { 
        detail: { message: "Review posted successfully.", type: "success" } 
      });
      window.dispatchEvent(event);
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* BACK BUTTON */}
      <button 
        onClick={() => setActiveTab("shop")}
        className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:opacity-70 dark:text-white transition-opacity"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Collection</span>
      </button>

      {/* CORE INFO SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT: GALLERY */}
        <div className="space-y-4">
          
          {/* principal IMAGE ZOOM CONTAINER */}
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomStyle({})}
            className="group relative aspect-square overflow-hidden rounded-none border border-[#E5E5E1] bg-gray-50/50 cursor-zoom-in dark:border-neutral-800 dark:bg-neutral-950"
            style={{
              backgroundImage: zoomStyle.backgroundImage ? zoomStyle.backgroundImage : "none",
              backgroundPosition: zoomStyle.backgroundPosition || "center",
              backgroundSize: zoomStyle.backgroundSize || "cover"
            }}
          >
            <img
              src={activeImage}
              alt={product.name}
              className={`h-full w-full object-cover object-center transition-opacity duration-300 ${zoomStyle.backgroundImage ? "opacity-0" : "opacity-100"}`}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`h-20 w-20 rounded-none overflow-hidden border bg-white transition-all dark:bg-neutral-900 ${activeImage === img ? "border-neutral-950 dark:border-white" : "border-[#E5E5E1] dark:border-neutral-800"}`}
              >
                <img src={img} alt={`Thumbnail ${i}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT: DETAILS CONTROLS */}
        <div className="space-y-6">
          
          <div className="border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {product.brand} • {product.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1 leading-tight">
              {product.name}
            </h1>
            
            {/* RATINGS HEADER */}
            <div className="flex items-center space-x-2 mt-3">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`h-4.5 w-4.5 ${s <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-neutral-800"}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {product.rating} ({reviews.length} reviews)
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="flex items-center space-x-4">
            <span className="font-serif text-3xl italic font-normal text-[#1A1A1A] dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className={`rounded-none border border-[#E5E5E1] px-3 py-1 text-[10px] font-bold uppercase tracking-wider dark:border-neutral-800 ${product.stock === 0 ? "bg-red-50 text-red-600 dark:bg-red-950/40" : "bg-neutral-50 text-neutral-600 dark:bg-neutral-800"}`}>
              {product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Limited Stock (${product.stock} left)` : "Immediate Dispatch"}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 font-light">
            {product.description}
          </p>

          {/* VARIANTS CONFIGURATOR */}
          <div className="space-y-4 border-t border-b border-[#E5E5E1] py-6 dark:border-neutral-800">
            
            {/* COLORS */}
            {product.variants.colors && product.variants.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Color Selection</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`rounded-none border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all ${selectedColor === c ? "bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-white dark:border-white dark:text-[#1A1A1A]" : "border-[#E5E5E1] bg-white text-neutral-600 hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZES */}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Variant Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`rounded-none border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all ${selectedSize === s ? "bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-white dark:border-white dark:text-[#1A1A1A]" : "border-[#E5E5E1] bg-white text-neutral-600 hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY PICKER */}
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Quantity</span>
              <div className="flex items-center border border-[#E5E5E1] rounded-none py-1 px-3 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-neutral-400 hover:text-neutral-700 px-2 font-bold"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold text-neutral-800 dark:text-white px-3">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-neutral-400 hover:text-neutral-700 px-2 font-bold"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center space-x-2 rounded-none py-3.5 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${product.stock === 0 ? "bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-800" : "bg-[#1A1A1A] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-neutral-100"}`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{product.stock === 0 ? "Out of Stock" : "Add to Shopping Bag"}</span>
            </button>

            <button
              onClick={handleWishlistToggle}
              className="flex h-12 w-12 items-center justify-center rounded-none border border-[#E5E5E1] text-neutral-500 hover:bg-neutral-50 hover:text-red-500 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-colors bg-white dark:bg-neutral-900"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          {/* DELIVERY PROPS */}
          <div className="space-y-3.5 bg-white border border-[#E5E5E1] dark:bg-neutral-900 dark:border-neutral-800 p-4 rounded-none text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center space-x-2.5">
              <Truck className="h-4 w-4 text-neutral-800 dark:text-white" />
              <span>Complimentary express carrier dispatch on order items</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <RotateCcw className="h-4 w-4 text-neutral-800 dark:text-white" />
              <span>30-day elegant return loop with pre-paid labels</span>
            </div>
          </div>

        </div>
      </div>

      {/* REVIEWS SEGMENT */}
      <section className="border-t border-[#E5E5E1] pt-12 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* SUMMARY STATS & WRITE FORM */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-normal text-[#1A1A1A] dark:text-white">Customer Reviews</h2>
            <div className="flex items-center space-x-2 mt-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold text-neutral-800 dark:text-white">{product.rating}</span>
              <span className="text-xs text-neutral-400 font-medium">Out of 5 stars ({reviews.length} responses)</span>
            </div>
          </div>

          {/* WRITE REVIEW FORM */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 border border-[#E5E5E1] dark:border-neutral-800 p-4 rounded-none bg-white dark:bg-neutral-900">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest dark:text-neutral-200">Express Your Reflection</h3>
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Rating Score</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="text-yellow-400 hover:scale-110 active:scale-95"
                    >
                      <Star className={`h-6 w-6 ${s <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-neutral-800"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Commentary</span>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your personal product assessment..."
                  required
                  className="w-full rounded-none border border-[#E5E5E1] p-3 text-xs font-medium outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full flex items-center justify-center space-x-1.5 rounded-none bg-[#1A1A1A] py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Assessment</span>
              </button>
            </form>
          ) : (
            <div className="border border-[#E5E5E1] dark:border-neutral-800 p-5 rounded-none text-center bg-white">
              <p className="text-xs text-neutral-500 font-medium">Please login to leave an authentic review assessment of this design item.</p>
              <button onClick={() => setActiveTab("login")} className="mt-3 rounded-none bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 dark:bg-white dark:text-neutral-950">
                Log In
              </button>
            </div>
          )}
        </div>

        {/* FEEDBACK LIST */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Member Reflections</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-6">This item has not yet received its member reflections. Be the first to express yours.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-b-0 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-white">{r.userName}</h4>
                      <span className="text-[9px] text-neutral-400">{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100 dark:text-neutral-800"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed dark:text-neutral-400 font-medium">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E5E5E1] pt-12 dark:border-neutral-800">
          <div className="mb-8 border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Cohesive Pairings</span>
            <h2 className="text-3xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Related Essentials</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => {
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    setActiveTab("shop"); // Clear or reset back state
                    setSelectedProductId(p.id);
                    setActiveTab("product");
                  }}
                  className="group cursor-pointer border border-[#E5E5E1] bg-white p-4 rounded-none dark:border-neutral-800 dark:bg-neutral-900 hover:shadow-sm transition-all"
                >
                  <img src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover rounded-none group-hover:scale-[1.02] transition-transform grayscale hover:grayscale-0" referrerPolicy="no-referrer" />
                  <h4 className="text-xs font-semibold text-neutral-800 dark:text-white truncate mt-3 uppercase tracking-wide">{p.name}</h4>
                  <span className="font-serif text-sm italic text-neutral-900 dark:text-neutral-300 mt-1 block">${p.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};
