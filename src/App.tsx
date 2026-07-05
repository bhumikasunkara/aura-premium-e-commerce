import React, { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AIChatAssistant } from "./components/AIChatAssistant";
import { HomeView } from "./components/pages/HomeView";
import { ShopView } from "./components/pages/ShopView";
import { ProductDetailsView } from "./components/pages/ProductDetailsView";
import { CartView } from "./components/pages/CartView";
import { WishlistView } from "./components/pages/WishlistView";
import { CheckoutView } from "./components/pages/CheckoutView";
import { OrderSuccessView } from "./components/pages/OrderSuccessView";
import { DashboardView } from "./components/pages/DashboardView";
import { AdminView } from "./components/pages/AdminView";
import { AuthView } from "./components/pages/AuthView";
import { AboutView, ContactView, FAQView, PrivacyView, TermsView } from "./components/pages/StaticViews";
import { Sparkles, X, CheckCircle, Info, AlertCircle } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

const ToastNotification: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleAddToast = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3500);
    };

    window.addEventListener("aura_toast", handleAddToast);
    return () => window.removeEventListener("aura_toast", handleAddToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3.5 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 transition-all animate-slide-in"
        >
          <div className="flex items-center space-x-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-100">
            {t.type === "success" && <CheckCircle className="h-4.5 w-4.5 text-green-500" />}
            {t.type === "info" && <Info className="h-4.5 w-4.5 text-blue-500" />}
            {t.type === "error" && <AlertCircle className="h-4.5 w-4.5 text-red-500" />}
            <span>{t.message}</span>
          </div>
          <button onClick={() => removeToast(t.id)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedProductId } = useStore();

  // Handle click selects from related shelves
  useEffect(() => {
    const handleProductSelect = (e: Event) => {
      const id = (e as CustomEvent).detail;
      setSelectedProductId(id);
      setActiveTab("product");
    };

    window.addEventListener("aura_select", handleProductSelect);
    return () => window.removeEventListener("aura_select", handleProductSelect);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/20 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 transition-colors duration-300">
      
      {/* GLOBAL NOTIFICATIONS */}
      <ToastNotification />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-grow">
        {activeTab === "home" && <HomeView />}
        {activeTab === "shop" && <ShopView />}
        {activeTab === "product" && <ProductDetailsView />}
        {activeTab === "cart" && <CartView />}
        {activeTab === "wishlist" && <WishlistView />}
        {activeTab === "checkout" && <CheckoutView />}
        {activeTab === "order-success" && <OrderSuccessView />}
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "admin" && <AdminView />}
        {activeTab === "login" && <AuthView />}
        
        {/* STATIC PAGES */}
        {activeTab === "about" && <AboutView />}
        {activeTab === "contact" && <ContactView />}
        {activeTab === "faq" && <FAQView />}
        {activeTab === "privacy" && <PrivacyView />}
        {activeTab === "terms" && <TermsView />}
      </main>

      {/* AI CONCIERGE ASSISTANT DRAWER */}
      <AIChatAssistant />

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
