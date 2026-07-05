import React, { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { Product, Order } from "../../types";
import { Plus, Edit2, Trash2, Check, RefreshCw, BarChart2, Package, ShoppingBag, Users, Sparkles, Loader2, Save } from "lucide-react";

export const AdminView: React.FC = () => {
  const {
    products,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminFetchAnalytics,
    user,
    setActiveTab
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "products" | "orders">("overview");

  // Analytics states
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Product CRUD states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("Audio");
  const [pBrand, setPBrand] = useState("Aura");
  const [pDescription, setPDescription] = useState("");
  const [pStock, setPStock] = useState("");
  const [pImages, setPImages] = useState<string[]>([]);
  const [pImgInput, setPImgInput] = useState("");
  const [pSizes, setPSizes] = useState<string[]>([]);
  const [pColors, setPColors] = useState<string[]>([]);
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsNewArrival, setPIsNewArrival] = useState(false);
  const [pIsBestSeller, setPIsBestSeller] = useState(false);

  // AI Description Generator State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Orders Admin list state
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setActiveTab("home");
      return;
    }

    loadAnalytics();
    loadOrders();
  }, [user, products]);

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    const data = await adminFetchAnalytics();
    if (data) setAnalytics(data);
    setLoadingAnalytics(false);
  };

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setAdminOrders(await res.json());
    } catch (err) {
      console.error("Error loading admin orders:", err);
    }
  };

  // Trigger Gemini AI Description generation
  const handleGenerateAIDescription = async () => {
    if (!pName || !pBrand) {
      alert("Please specify the product Name and Brand first so Aura AI has structural details.");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pName, brand: pBrand, category: pCategory })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      if (data.description) {
        setPDescription(data.description);
        const event = new CustomEvent("aura_toast", { 
          detail: { message: "AI Description generated successfully.", type: "success" } 
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error("AI desc generation failed:", err);
      alert("AI describing service busy. Please type details manually.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddImage = () => {
    if (pImgInput.trim() && !pImages.includes(pImgInput.trim())) {
      setPImages([...pImages, pImgInput.trim()]);
      setPImgInput("");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setPImages(pImages.filter((_, i) => i !== idx));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice || !pDescription || pImages.length === 0) {
      alert("Please complete the Name, Price, Description, and provide at least one product Image.");
      return;
    }

    const payload = {
      name: pName,
      price: parseFloat(pPrice),
      category: pCategory,
      brand: pBrand,
      description: pDescription,
      images: pImages,
      variants: {
        sizes: pSizes.length > 0 ? pSizes : ["One Size"],
        colors: pColors.length > 0 ? pColors : ["Standard"]
      },
      stock: parseInt(pStock) || 0,
      isFeatured: pIsFeatured,
      isNewArrival: pIsNewArrival,
      isBestSeller: pIsBestSeller
    };

    let result;
    if (editingProductId) {
      result = await adminUpdateProduct(editingProductId, payload);
    } else {
      result = await adminAddProduct(payload);
    }

    if (result) {
      resetProductForm();
      setShowProductForm(false);
      loadAnalytics(); // Refresh analytics metrics
      
      const event = new CustomEvent("aura_toast", { 
        detail: { message: editingProductId ? "Product updated." : "Product added.", type: "success" } 
      });
      window.dispatchEvent(event);
    } else {
      alert("Error saving product item.");
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPPrice(String(p.price));
    setPCategory(p.category);
    setPBrand(p.brand);
    setPDescription(p.description);
    setPStock(String(p.stock));
    setPImages(p.images);
    setPSizes(p.variants.sizes || []);
    setPColors(p.variants.colors || []);
    setPIsFeatured(p.isFeatured);
    setPIsNewArrival(p.isNewArrival);
    setPIsBestSeller(p.isBestSeller);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to retire this catalog piece from the database?")) {
      const success = await adminDeleteProduct(id);
      if (success) {
        loadAnalytics();
        const event = new CustomEvent("aura_toast", { 
          detail: { message: "Product retired from database.", type: "info" } 
        });
        window.dispatchEvent(event);
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await adminUpdateOrderStatus(orderId, newStatus);
    if (success) {
      loadOrders();
      loadAnalytics();
      const event = new CustomEvent("aura_toast", { 
        detail: { message: `Order status upgraded to ${newStatus}.`, type: "success" } 
      });
      window.dispatchEvent(event);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setPName("");
    setPPrice("");
    setPCategory("Audio");
    setPBrand("Aura");
    setPDescription("");
    setPStock("");
    setPImages([]);
    setPImgInput("");
    setPSizes([]);
    setPColors([]);
    setPIsFeatured(false);
    setPIsNewArrival(false);
    setPIsBestSeller(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E5E1] pb-6 dark:border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-red-600 uppercase">Management Node</span>
          <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Aura Staff Terminal</h1>
        </div>

        <div className="flex items-center gap-1 border border-[#E5E5E1] rounded-none p-1 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`rounded-none px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeSubTab === "overview" ? "bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]" : "text-neutral-500"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab("products")}
            className={`rounded-none px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeSubTab === "products" ? "bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]" : "text-neutral-500"}`}
          >
            Catalog CRUD
          </button>
          <button
            onClick={() => setActiveSubTab("orders")}
            className={`rounded-none px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeSubTab === "orders" ? "bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]" : "text-neutral-500"}`}
          >
            Orders Monitor
          </button>
        </div>
      </div>

      {/* SUB-VIEWS */}

      {/* 1. OVERVIEW SUB TAB */}
      {activeSubTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* ANALYTICS CARDS */}
          {loadingAnalytics ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              
              <div className="border border-[#E5E5E1] rounded-none p-5 bg-white dark:border-neutral-800 dark:bg-neutral-900 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-neutral-50 border border-[#E5E5E1] text-[#1A1A1A] dark:bg-neutral-800 dark:text-white">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Income</span>
                  <p className="font-serif italic text-xl font-normal text-[#1A1A1A] dark:text-white mt-0.5">${analytics.revenue.toFixed(2)}</p>
                </div>
              </div>

              <div className="border border-[#E5E5E1] rounded-none p-5 bg-white dark:border-neutral-800 dark:bg-neutral-900 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-neutral-50 border border-[#E5E5E1] text-[#1A1A1A] dark:bg-neutral-800 dark:text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Orders Handled</span>
                  <p className="font-serif italic text-xl font-normal text-[#1A1A1A] dark:text-white mt-0.5">{analytics.ordersCount}</p>
                </div>
              </div>

              <div className="border border-[#E5E5E1] rounded-none p-5 bg-white dark:border-neutral-800 dark:bg-neutral-900 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-neutral-50 border border-[#E5E5E1] text-[#1A1A1A] dark:bg-neutral-800 dark:text-white">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Unique Skus</span>
                  <p className="font-serif italic text-xl font-normal text-[#1A1A1A] dark:text-white mt-0.5">{analytics.productsCount}</p>
                </div>
              </div>

              <div className="border border-[#E5E5E1] rounded-none p-5 bg-white dark:border-neutral-800 dark:bg-neutral-900 flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-neutral-50 border border-[#E5E5E1] text-[#1A1A1A] dark:bg-neutral-800 dark:text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Registered Clients</span>
                  <p className="font-serif italic text-xl font-normal text-[#1A1A1A] dark:text-white mt-0.5">{analytics.usersCount}</p>
                </div>
              </div>

            </div>
          ) : (
            <p className="text-xs text-neutral-400">Database statistics currently resting.</p>
          )}

          {/* D3 VISUAL MOCKUP SHEET */}
          {analytics && (
            <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Income Flow Analysis</h3>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">LTM Scale</span>
              </div>

              <div className="flex h-48 items-end gap-3 pt-6 border-b border-[#E5E5E1] dark:border-neutral-800">
                {analytics.monthlyRevenue?.map((m: any, i: number) => {
                  const maxAmt = Math.max(...analytics.monthlyRevenue.map((x: any) => x.amount));
                  const percentage = (m.amount / maxAmt) * 100;
                  return (
                    <div key={i} className="flex-grow flex flex-col items-center group h-full justify-end">
                      <div className="relative w-full flex justify-center">
                        <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-none shadow">
                          ${m.amount}
                        </span>
                      </div>
                      <div 
                        style={{ height: `${percentage}%` }}
                        className="w-full max-w-[28px] bg-neutral-900 hover:bg-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded-none transition-all duration-500"
                      />
                      <span className="text-[9px] font-bold text-neutral-400 uppercase mt-2 tracking-widest">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. CATALOG CRUD TAB */}
      {activeSubTab === "products" && (
        <div className="space-y-6">
          
          {/* HEADER BUTTON */}
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Database Registry ({products.length} products)</h2>
            {!showProductForm && (
              <button
                onClick={() => { resetProductForm(); setShowProductForm(true); }}
                className="rounded-none bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest px-5 py-3 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Create Product SKU</span>
              </button>
            )}
          </div>

          {/* ADD / EDIT PRODUCT FORM */}
          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-6 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white border-b border-[#E5E5E1] pb-2 dark:border-neutral-800">
                {editingProductId ? "Modify Product Details" : "Register New Product SKU"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NAME */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Product Name</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Aura Precision Desk Mat"
                    className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>

                {/* PRICE */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="e.g. 79.00"
                    className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>

                {/* CATEGORIES */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 bg-white"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Workspace">Workspace</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>

                {/* BRANDS */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Brand</label>
                  <input
                    type="text"
                    required
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    placeholder="e.g. Aura"
                    className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>

                {/* DESCRIPTION + AI DESCRIPTOR TRIGGER */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Description Text</label>
                    <button
                      type="button"
                      onClick={handleGenerateAIDescription}
                      disabled={isGeneratingAI || !pName}
                      className="rounded-none border border-[#E5E5E1] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold px-3 py-1.5 flex items-center gap-1 dark:bg-neutral-800 dark:text-neutral-200 uppercase tracking-widest"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                          <span>Generating description...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          <span>Generate AI Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="Provide bespoke styling details, features and acoustic elements..."
                    className="w-full rounded-none border border-[#E5E5E1] p-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 font-light"
                  />
                </div>

                {/* IMAGES CONSOLE */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Product Image Catalog Links</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pImgInput}
                      onChange={(e) => setPImgInput(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                    />
                    <button type="button" onClick={handleAddImage} className="rounded-none bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest px-5 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900">Add Link</button>
                  </div>
                  
                  {/* IMAGES LIST */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {pImages.map((img, i) => (
                      <div key={i} className="relative group rounded-none overflow-hidden border border-[#E5E5E1] dark:border-neutral-800">
                        <img src={img} alt="Form preview" className="h-16 w-16 object-cover grayscale" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STOCK */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Stock Quantities</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>

                {/* BADGES */}
                <div className="flex flex-wrap items-center gap-6 md:col-span-2 pt-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={pIsFeatured} onChange={(e) => setPIsFeatured(e.target.checked)} className="h-4 w-4 rounded-none border-[#E5E5E1]" id="isFeatured" />
                    <label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Featured</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={pIsNewArrival} onChange={(e) => setPIsNewArrival(e.target.checked)} className="h-4 w-4 rounded-none border-[#E5E5E1]" id="isNew" />
                    <label htmlFor="isNew" className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">New Arrival</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={pIsBestSeller} onChange={(e) => setPIsBestSeller(e.target.checked)} className="h-4 w-4 rounded-none border-[#E5E5E1]" id="isBest" />
                    <label htmlFor="isBest" className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Best Seller</label>
                  </div>
                </div>

              </div>

              {/* SAVE / CANCEL */}
              <div className="flex gap-3 border-t border-[#E5E5E1] pt-5 dark:border-neutral-800">
                <button type="button" onClick={() => { resetProductForm(); setShowProductForm(false); }} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-600 bg-neutral-50 dark:bg-neutral-800 rounded-none">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 rounded-none flex items-center justify-center gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>{editingProductId ? "Update SKU Registry" : "Commit SKU Registry"}</span>
                </button>
              </div>

            </form>
          )}

          {/* REGISTERED SKUS LIST */}
          <div className="border border-[#E5E5E1] rounded-none overflow-hidden bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-500 dark:text-neutral-400">
                <thead>
                  <tr className="border-b border-[#E5E5E1] bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950 font-bold uppercase text-[9px] tracking-widest text-neutral-400">
                    <th className="p-4">Registry SKU</th>
                    <th className="p-4">Brand / Category</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#E5E5E1] dark:border-neutral-800/40">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-none object-cover grayscale hover:grayscale-0 transition-all" />
                          <div className="font-bold text-neutral-900 dark:text-white uppercase tracking-wide text-[11px] truncate max-w-xs">{p.name}</div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold uppercase text-[10px] tracking-wide">{p.brand} • {p.category}</td>
                      <td className="p-4 text-right font-serif italic text-sm text-neutral-900 dark:text-white">${p.price.toFixed(2)}</td>
                      <td className="p-4 text-center font-semibold">
                        <span className={`px-2.5 py-1 border text-[9px] uppercase tracking-widest rounded-none ${p.stock === 0 ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20" : "bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => startEditProduct(p)} className="p-1 rounded text-neutral-400 hover:text-[#1A1A1A] dark:hover:text-white">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1 rounded text-neutral-400 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. ORDERS MONITOR TAB */}
      {activeSubTab === "orders" && (
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Global Customer Orders ({adminOrders.length} records)</h2>

          <div className="border border-[#E5E5E1] rounded-none overflow-hidden bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-500 dark:text-neutral-400">
                <thead>
                  <tr className="border-b border-[#E5E5E1] bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950 font-bold uppercase text-[9px] tracking-widest text-neutral-400">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Paid</th>
                    <th className="p-4 text-center">State Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((o) => {
                    const totalQty = o.orderItems.reduce((s, x) => s + x.quantity, 0);
                    return (
                      <tr key={o.id} className="border-b border-[#E5E5E1] dark:border-neutral-800/40">
                        <td className="p-4 font-bold uppercase text-neutral-900 dark:text-white text-[11px]">{o.id}</td>
                        <td className="p-4 font-semibold">{o.shippingAddress.fullName}</td>
                        <td className="p-4 text-center font-mono font-semibold">{totalQty} items</td>
                        <td className="p-4 text-right font-serif italic text-sm text-neutral-900 dark:text-white">${o.totalAmount.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="rounded-none border border-[#E5E5E1] bg-white px-3 py-1.5 font-bold uppercase tracking-widest text-[10px] outline-none cursor-pointer text-neutral-700 hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
