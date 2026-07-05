import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { User, ShoppingBag, MapPin, Key, Plus, ChevronDown, ChevronUp, Bell, AlertTriangle } from "lucide-react";

export const DashboardView: React.FC = () => {
  const { user, orders, addAddress, setActiveTab } = useStore();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Add address states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");

  const toggleOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !zipCode) return;

    const success = await addAddress({
      street,
      city,
      zipCode,
      country,
      phone,
      isDefault: user?.addresses?.length === 0
    });

    if (success) {
      setStreet("");
      setCity("");
      setZipCode("");
      setPhone("");
      setShowAddAddress(false);
      
      const event = new CustomEvent("aura_toast", { 
        detail: { message: "Address saved securely.", type: "success" } 
      });
      window.dispatchEvent(event);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4 animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-none border border-[#E5E5E1] bg-white text-neutral-400 dark:bg-neutral-800">
          <User className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest dark:text-white">Profile Access Interrupted</h2>
          <p className="text-xs text-neutral-500 font-light">Sign in to check your order histories, addresses and active memberships.</p>
        </div>
        <button onClick={() => setActiveTab("login")} className="rounded-none bg-[#1A1A1A] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white dark:bg-white dark:text-neutral-950">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* HEADER HERO */}
      <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-[#E5E5E1] pb-8 dark:border-neutral-800">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-20 w-20 rounded-none border border-[#E5E5E1] object-cover grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="text-center sm:text-left space-y-1">
          <span className="inline-block text-[9px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-none uppercase tracking-widest dark:bg-amber-950/20 dark:text-amber-400">
            {user.role === "admin" ? "Systems Administrator" : "Aura Member"}
          </span>
          <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">{user.name}</h1>
          <p className="text-xs text-neutral-400 font-light">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: ORDER HISTORIES */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-neutral-500 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Order History ({orders.length} orders)</span>
          </h2>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="border border-dashed border-[#E5E5E1] rounded-none p-8 text-center text-neutral-400 dark:border-neutral-800">
                <p className="text-xs font-light">You haven't ordered any boutique pieces yet.</p>
                <button onClick={() => setActiveTab("shop")} className="mt-4 rounded-none bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 dark:bg-white dark:text-neutral-900">Explore Collection</button>
              </div>
            ) : (
              orders.map((o) => {
                const isOpen = expandedOrderId === o.id;
                return (
                  <div key={o.id} className="border border-[#E5E5E1] rounded-none overflow-hidden bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    
                    {/* ACCORDION TRIGGER HEADER */}
                    <div 
                      onClick={() => toggleOrder(o.id)}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors gap-3"
                    >
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-neutral-800 dark:text-white uppercase tracking-wider">Order: {o.id}</p>
                        <p className="text-[10px] text-neutral-400 font-light">Date: {new Date(o.date).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right text-xs">
                          <p className="font-serif italic text-sm text-[#1A1A1A] dark:text-white">${o.totalAmount.toFixed(2)}</p>
                          <span className={`inline-block mt-1 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 border rounded-none ${
                            o.status === "Delivered" ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-950/20" : 
                            o.status === "Shipped" ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20" :
                            o.status === "Cancelled" ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20" :
                            "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20"
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                      </div>
                    </div>

                    {/* EXPANDED BREAKDOWN */}
                    {isOpen && (
                      <div className="border-t border-[#E5E5E1] p-4 bg-gray-50/30 dark:border-neutral-800 dark:bg-neutral-950/20 space-y-4">
                        
                        {/* ITEM PORTRAITS */}
                        <div className="space-y-3">
                          {o.orderItems.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-xs">
                              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-none object-cover grayscale hover:grayscale-0 transition-all" />
                              <div className="flex-grow min-w-0">
                                <h4 className="font-semibold text-[11px] uppercase text-neutral-800 dark:text-white truncate">{item.name}</h4>
                                <p className="text-[10px] text-neutral-400 mt-0.5">Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}</p>
                              </div>
                              <span className="font-serif italic text-neutral-700 dark:text-neutral-300">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* ROUTING ADDRS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E5E5E1] pt-3 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                          <div>
                            <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[10px] dark:text-neutral-200">Delivery Point:</h4>
                            <p className="mt-1 text-neutral-900 font-semibold dark:text-white">{o.shippingAddress.fullName}</p>
                            <p className="mt-0.5">{o.shippingAddress.street}</p>
                            <p>{o.shippingAddress.city}, {o.shippingAddress.zipCode}</p>
                            <p>{o.shippingAddress.country}</p>
                          </div>
                          <div className="sm:text-right">
                            <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[10px] dark:text-neutral-200">Tracking Code:</h4>
                            <p className="mt-1 font-mono font-bold text-neutral-900 dark:text-white">{o.trackingNumber}</p>
                            <p className="mt-0.5">Carrier: Aura Express Post</p>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: SECURE ADDRS MANAGER */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-neutral-500 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Shipping Book</span>
          </h2>

          <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            
            {user.addresses && user.addresses.length === 0 ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 italic text-center py-4">No addresses saved. Add an address to speed up checkout.</p>
            ) : (
              user.addresses?.map((addr) => (
                <div key={addr.id} className="text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0 dark:border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800 dark:text-white">{addr.street}</span>
                    {addr.isDefault && <span className="text-[8px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded-none uppercase tracking-widest dark:bg-amber-950/20">Default</span>}
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400">{addr.city}, {addr.zipCode}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">{addr.country}</p>
                  {addr.phone && <p className="text-neutral-400 mt-1 text-[10px]">Ph: {addr.phone}</p>}
                </div>
              ))
            )}

            {/* TOGGLE ADD ADDRESS FORM */}
            {!showAddAddress ? (
              <button
                onClick={() => setShowAddAddress(true)}
                className="w-full flex items-center justify-center space-x-1.5 rounded-none border border-dashed border-[#E5E5E1] py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Register New Address</span>
              </button>
            ) : (
              <form onSubmit={handleAddAddress} className="border-t border-[#E5E5E1] pt-4 dark:border-neutral-800 space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Street</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="500 Broadway"
                    className="w-full rounded-none border border-[#E5E5E1] py-1.5 px-2.5 text-xs outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full rounded-none border border-[#E5E5E1] py-1.5 px-2.5 text-xs outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="10012"
                      className="w-full rounded-none border border-[#E5E5E1] py-1.5 px-2.5 text-xs outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full rounded-none border border-[#E5E5E1] py-1.5 px-2.5 text-xs outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddAddress(false)} className="flex-1 py-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-600 bg-neutral-50 dark:bg-neutral-800 rounded-none">Cancel</button>
                  <button type="submit" className="flex-1 py-2 text-xs font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 rounded-none">Save</button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
