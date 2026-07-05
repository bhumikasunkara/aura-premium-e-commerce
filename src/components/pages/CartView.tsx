import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";

export const CartView: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    validateCoupon,
    setActiveTab,
    user
  } = useStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const cartDetails = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod
    };
  }).filter(item => item.product !== undefined);

  const subtotal = cartDetails.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  // Apply Coupon Discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = subtotal * (appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const shippingCost = subtotal > 150 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) return;

    const coupon = await validateCoupon(couponCode.trim());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode("");
      
      const event = new CustomEvent("aura_toast", { 
        detail: { message: `Coupon code '${coupon.code}' applied.`, type: "success" } 
      });
      window.dispatchEvent(event);
    } else {
      setCouponError("Invalid or expired coupon code.");
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      // Direct them to login, but save destination or alert
      const event = new CustomEvent("aura_toast", { 
        detail: { message: "Please log in to complete your checkout.", type: "info" } 
      });
      window.dispatchEvent(event);
      setActiveTab("login");
      return;
    }

    // Set checkout details to local storage so checkout can fetch them
    localStorage.setItem("aura_checkout_discount", String(discount));
    localStorage.setItem("aura_checkout_coupon", JSON.stringify(appliedCoupon));
    setActiveTab("checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 dark:bg-neutral-800">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest dark:text-white">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">Explore our portfolio collection of acoustical, wearable, and desktop designs to begin your journey.</p>
        </div>
        <button onClick={() => setActiveTab("shop")} className="rounded-full bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">
          Explore Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Order Manifest</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Shopping Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: LIST ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartDetails.map((item) => {
            if (!item.product) return null;
            return (
              <div 
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                className="flex items-center gap-6 border border-[#E5E5E1] rounded-none p-4 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <img src={item.product.images[0]} alt={item.product.name} className="h-20 w-20 rounded-none object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-800 dark:text-white truncate">{item.product.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-1">
                    Size: {item.selectedSize} • Color: {item.selectedColor}
                  </p>

                  <div className="flex items-center justify-between mt-3.5">
                    {/* QUANTITY PICKER */}
                    <div className="flex items-center border border-[#E5E5E1] rounded-none py-0.5 px-2 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                      <button 
                        onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="text-neutral-400 hover:text-neutral-700 px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono text-[11px] font-bold text-neutral-800 dark:text-white px-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="text-neutral-400 hover:text-neutral-700 px-1 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif text-sm italic font-normal text-[#1A1A1A] dark:text-white">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="space-y-6">
          
          <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white border-b border-[#E5E5E1] pb-3 dark:border-neutral-800">Order Summary</h2>
            
            <div className="space-y-2.5 text-xs text-neutral-500 font-medium dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-serif italic text-sm">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">
                  {shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes (8%)</span>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#E5E5E1] pt-3 dark:border-neutral-800 flex justify-between text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">
                <span>Total Amount</span>
                <span className="font-serif italic text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* COUPON INPUT */}
            <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-[#E5E5E1] dark:border-neutral-800 space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Promotion Code</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="rounded-none border border-[#E5E5E1] py-2 px-3 text-xs font-bold uppercase tracking-wider outline-none flex-grow dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                />
                <button type="submit" className="rounded-none bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 dark:bg-white dark:text-neutral-900">
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] font-bold text-red-500">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-none dark:bg-green-950/20">
                  <span>Code: {appliedCoupon.code} ({appliedCoupon.value}% off)</span>
                  <button type="button" onClick={() => setAppliedCoupon(null)} className="text-green-800 hover:underline dark:text-green-400">Remove</button>
                </div>
              )}
            </form>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center space-x-1.5 rounded-none bg-[#1A1A1A] py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 transition-all active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* SECURE PROPS */}
          <div className="border border-[#E5E5E1] rounded-none p-4 bg-white dark:border-neutral-800/40 dark:bg-neutral-900 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Aura Security Protocol</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed font-light">Transactions are processed with TLS-256 encryption. We never warehouse credit card details. Immediate shipping on all boutique stocks.</p>
          </div>

        </div>

      </div>

    </div>
  );
};
