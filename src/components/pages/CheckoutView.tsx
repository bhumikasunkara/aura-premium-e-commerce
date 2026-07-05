import React, { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { CreditCard, Truck, ShieldCheck, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

export const CheckoutView: React.FC = () => {
  const {
    cart,
    products,
    placeOrder,
    setActiveTab,
    user,
    addAddress
  } = useStore();

  const [shippingOption, setShippingOption] = useState<"Standard" | "Express">("Standard");
  
  // Shipping Address Form
  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");

  // Credit Card Form
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Processing Animation
  const [isProcessing, setIsProcessing] = useState(false);

  // Load user saved addresses if available
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setStreetAddress(addr.street);
        setCity(addr.city);
        setPostalCode(addr.zipCode);
        setCountry(addr.country);
        setPhone(addr.phone);
      }
    }
  }, [user]);

  const cartDetails = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return { ...item, product: prod };
  }).filter(item => item.product !== undefined);

  const subtotal = cartDetails.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  // Discount
  const discount = parseFloat(localStorage.getItem("aura_checkout_discount") || "0");

  const shippingCost = shippingOption === "Express" ? 25 : subtotal > 150 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !streetAddress || !city || !postalCode || !cardNumber || !cardCvv) {
      alert("Please complete all required shipping and payment fields.");
      return;
    }

    setIsProcessing(true);

    // Save Address back to user addresses list if not already present
    if (user && user.addresses && user.addresses.length === 0) {
      await addAddress({
        street: streetAddress,
        city,
        zipCode: postalCode,
        country,
        phone,
        isDefault: true
      });
    }

    // Mock a beautiful payment authorization latency
    setTimeout(async () => {
      const shippingAddress = {
        fullName,
        street: streetAddress,
        city,
        zipCode: postalCode,
        country,
        phone
      };

      const completedOrder = await placeOrder(
        shippingAddress,
        shippingOption,
        shippingCost,
        discount,
        total,
        "Credit Card"
      );

      setIsProcessing(false);

      if (completedOrder) {
        localStorage.removeItem("aura_checkout_discount");
        localStorage.removeItem("aura_checkout_coupon");
        setActiveTab("order-success");
      } else {
        alert("Transaction authorization failed. Please check card limits.");
      }
    }, 2500);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-900 dark:text-white" />
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Authorizing Vault</h2>
          <p className="text-xs text-neutral-500">Connecting securely to Stripe clearing networks. Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setActiveTab("cart")}
          className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT: SHIPPING & PAYMENT FORM */}
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          
          {/* SHIPPING FORM */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white border-b border-[#E5E5E1] pb-2 dark:border-neutral-800">
              1. Delivery Address
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Johnathan Doe"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Street Address</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="100 Orchard St, Penthouse B"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10002"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Phone Contact</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* SHIPPING SPEED */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white border-b border-[#E5E5E1] pb-2 dark:border-neutral-800">
              2. Shipping Protocol
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setShippingOption("Standard")}
                className={`rounded-none border p-4 cursor-pointer flex justify-between items-start transition-all bg-white dark:bg-neutral-900 ${shippingOption === "Standard" ? "border-[#1A1A1A] dark:border-white" : "border-[#E5E5E1]"}`}
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">Standard Delivery</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">Arrives in 3 to 5 business days.</p>
                </div>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">Complimentary</span>
              </div>

              <div 
                onClick={() => setShippingOption("Express")}
                className={`rounded-none border p-4 cursor-pointer flex justify-between items-start transition-all bg-white dark:bg-neutral-900 ${shippingOption === "Express" ? "border-[#1A1A1A] dark:border-white" : "border-[#E5E5E1]"}`}
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">Express Delivery</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">Guaranteed priority in 1 to 2 days.</p>
                </div>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">$25.00</span>
              </div>
            </div>
          </div>

          {/* PAYMENT FORM */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-2 dark:border-neutral-800">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">
                3. Secure Payment
              </h2>
              <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-none dark:bg-green-950/20">Stripe Demo mode</span>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-none p-4 sm:p-6 border border-[#E5E5E1] dark:border-neutral-800 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Johnathan Doe"
                  className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Credit Card Number</label>
                  <span className="text-[9px] font-bold text-neutral-400">Demo: Use 4242 4242...</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 pl-10 pr-3.5 text-xs font-mono font-bold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    maxLength={7}
                    className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Security Code (CVV)</label>
                  <input
                    type="password"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-none border border-[#E5E5E1] bg-white py-2.5 px-3.5 text-xs font-mono font-bold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>
              </div>

            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-1.5 rounded-none bg-[#1A1A1A] py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-neutral-100 transition-all active:scale-95"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>Authorize Payment & Place Order</span>
          </button>

        </form>

        {/* RIGHT: BILLING BREAKDOWN */}
        <div className="space-y-6">
          <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white border-b border-[#E5E5E1] pb-3 dark:border-neutral-800">
              Shopping Cart Review
            </h2>
            
            {/* ITEMS LIST */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartDetails.map((item) => {
                if (!item.product) return null;
                return (
                  <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-3 text-xs">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 rounded-none object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold uppercase text-[11px] text-neutral-800 dark:text-white truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Qty: {item.quantity} • {item.selectedColor} • {item.selectedSize}</p>
                    </div>
                    <span className="font-serif italic text-xs text-neutral-800 dark:text-white">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* NUMERICS */}
            <div className="border-t border-[#E5E5E1] pt-4 dark:border-neutral-800 space-y-2 text-xs text-neutral-500 font-medium dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Promotion Discount</span>
                  <span className="font-serif italic text-sm">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({shippingOption})</span>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">
                  {shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes</span>
                <span className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#E5E5E1] pt-3 dark:border-neutral-800 flex justify-between text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
                <span>Total Amount Due</span>
                <span className="font-serif italic text-base text-[#1A1A1A] dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
