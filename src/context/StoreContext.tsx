import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Product, CartItem, Order, Review, Coupon, Notification, Address } from "../types";

interface StoreContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  notifications: Notification[];
  coupons: Coupon[];
  categories: string[];
  brands: string[];
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  activeTab: string; // "home" | "shop" | "product" | "cart" | "wishlist" | "checkout" | "order-success" | "dashboard" | "admin" | "about" | "contact" | "faq" | "terms" | "privacy"
  selectedProductId: string | null;
  lastPlacedOrder: Order | null;
  // Actions
  setDarkMode: (dark: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSelectedProductId: (id: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => Promise<boolean>;
  addToCart: (productId: string, quantity: number, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (shippingAddress: any, shippingOption: "Standard" | "Express", shippingCost: number, discountAmount: number, totalAmount: number, paymentMethod: string) => Promise<Order | null>;
  addReview: (productId: string, rating: number, comment: string) => Promise<boolean>;
  validateCoupon: (code: string) => Promise<Coupon | null>;
  markNotificationsAsRead: () => void;
  refreshProducts: () => Promise<void>;
  // Admin Operations
  adminAddProduct: (product: Omit<Product, "id" | "rating" | "reviewCount">) => Promise<Product | null>;
  adminUpdateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>;
  adminDeleteProduct: (id: string) => Promise<boolean>;
  adminUpdateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  adminFetchAnalytics: () => Promise<any>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Initialize store and check local sessions
  useEffect(() => {
    const isDark = localStorage.getItem("aura_dark_mode") === "true";
    setDarkModeState(isDark);
    if (isDark) document.documentElement.classList.add("dark");

    const savedUser = localStorage.getItem("aura_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedCart = localStorage.getItem("aura_guest_cart");
    if (savedCart && !savedUser) {
      setCart(JSON.parse(savedCart));
    }

    const savedWish = localStorage.getItem("aura_guest_wishlist");
    if (savedWish && !savedUser) {
      setWishlist(JSON.parse(savedWish));
    }

    // Initial API fetches
    fetchInitialData();
  }, []);

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem("aura_dark_mode", String(dark));
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/brands")
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (brandRes.ok) setBrands(await brandRes.json());
    } catch (err) {
      console.error("Error loading initial store data:", err);
      setError("Unable to connect to Aura Store backend.");
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (err) {
      console.error("Error refreshing products:", err);
    }
  };

  // Sync cart and wishlist when user logs in or items change
  useEffect(() => {
    if (user) {
      // Fetch user's cart from server
      fetch(`/api/cart/${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setCart(data));

      // Fetch user's wishlist from server
      fetch(`/api/wishlist/${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setWishlist(data));

      // Fetch orders
      fetch(`/api/orders?userId=${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setOrders(data));

      // Fetch notifications
      fetch(`/api/notifications/${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setNotifications(data));
    }
  }, [user]);

  // Sync local changes to server or local storage
  const syncCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    if (user) {
      await fetch(`/api/cart/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: newCart })
      });
    } else {
      localStorage.setItem("aura_guest_cart", JSON.stringify(newCart));
    }
  };

  const syncWishlist = async (newWishlist: string[]) => {
    setWishlist(newWishlist);
    if (user) {
      await fetch(`/api/wishlist/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: newWishlist })
      });
    } else {
      localStorage.setItem("aura_guest_wishlist", JSON.stringify(newWishlist));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const { user: loggedInUser } = await res.json();
      setUser(loggedInUser);
      localStorage.setItem("aura_user", JSON.stringify(loggedInUser));
      localStorage.removeItem("aura_guest_cart");
      localStorage.removeItem("aura_guest_wishlist");
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      const { user: registeredUser } = await res.json();
      setUser(registeredUser);
      localStorage.setItem("aura_user", JSON.stringify(registeredUser));
      localStorage.removeItem("aura_guest_cart");
      localStorage.removeItem("aura_guest_wishlist");
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Unable to register");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setNotifications([]);
    localStorage.removeItem("aura_user");
    setActiveTab("home");
  };

  const addAddress = async (address: Omit<Address, "id">): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch("/api/auth/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, address })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("aura_user", JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.error("Error adding address:", err);
    }
    return false;
  };

  const addToCart = (productId: string, quantity: number, size: string, color: string) => {
    const existingIdx = cart.findIndex(
      item => item.productId === productId && item.selectedSize === size && item.selectedColor === color
    );

    let newCart = [...cart];
    if (existingIdx > -1) {
      newCart[existingIdx].quantity += quantity;
    } else {
      newCart.push({ productId, quantity, selectedSize: size, selectedColor: color });
    }
    syncCart(newCart);
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    const idx = cart.findIndex(
      item => item.productId === productId && item.selectedSize === size && item.selectedColor === color
    );
    if (idx > -1) {
      let newCart = [...cart];
      if (quantity <= 0) {
        newCart.splice(idx, 1);
      } else {
        newCart[idx].quantity = quantity;
      }
      syncCart(newCart);
    }
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    const newCart = cart.filter(
      item => !(item.productId === productId && item.selectedSize === size && item.selectedColor === color)
    );
    syncCart(newCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const isWish = wishlist.includes(productId);
    const newWish = isWish ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    syncWishlist(newWish);
  };

  const placeOrder = async (
    shippingAddress: any,
    shippingOption: "Standard" | "Express",
    shippingCost: number,
    discountAmount: number,
    totalAmount: number,
    paymentMethod: string
  ): Promise<Order | null> => {
    if (!user) return null;

    try {
      const orderItems = cart.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          name: prod?.name || "Premium Item",
          price: prod?.price || 0,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: prod?.images[0] || ""
        };
      });

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          orderItems,
          shippingAddress,
          shippingOption,
          shippingCost,
          discountAmount,
          totalAmount,
          paymentMethod
        })
      });

      if (!res.ok) throw new Error("Order creation failed");

      const createdOrder = await res.json();
      setOrders(prev => [createdOrder, ...prev]);
      setLastPlacedOrder(createdOrder);
      setCart([]);
      
      // Refresh products for updated stock
      refreshProducts();

      return createdOrder;
    } catch (err) {
      console.error("Order error:", err);
      return null;
    }
  };

  const addReview = async (productId: string, rating: number, comment: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: user.id,
          userName: user.name,
          rating,
          comment
        })
      });

      if (res.ok) {
        refreshProducts();
        return true;
      }
    } catch (err) {
      console.error("Error adding review:", err);
    }
    return false;
  };

  const validateCoupon = async (code: string): Promise<Coupon | null> => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("Coupon verification failed:", err);
    }
    return null;
  };

  const markNotificationsAsRead = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications/${user.id}/read-all`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error reading notifications:", err);
    }
  };

  // ------------------- ADMIN OPERATIONS -------------------

  const adminAddProduct = async (product: Omit<Product, "id" | "rating" | "reviewCount">): Promise<Product | null> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
        
        // Add new category or brand to list if unique
        if (!categories.includes(product.category)) {
          setCategories(prev => [...prev, product.category]);
        }
        if (!brands.includes(product.brand)) {
          setBrands(prev => [...prev, product.brand]);
        }

        return created;
      }
    } catch (err) {
      console.error("Admin add product error:", err);
    }
    return null;
  };

  const adminUpdateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        return updated;
      }
    } catch (err) {
      console.error("Admin update product error:", err);
    }
    return null;
  };

  const adminDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Admin delete product error:", err);
    }
    return false;
  };

  const adminUpdateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        return true;
      }
    } catch (err) {
      console.error("Admin order update error:", err);
    }
    return false;
  };

  const adminFetchAnalytics = async (): Promise<any> => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) return await res.json();
    } catch (err) {
      console.error("Admin analytics fetch error:", err);
    }
    return null;
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        products,
        cart,
        wishlist,
        orders,
        notifications,
        coupons,
        categories,
        brands,
        loading,
        error,
        darkMode,
        activeTab,
        selectedProductId,
        lastPlacedOrder,
        setDarkMode,
        setActiveTab,
        setSelectedProductId,
        login,
        register,
        logout,
        addAddress,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        placeOrder,
        addReview,
        validateCoupon,
        markNotificationsAsRead,
        refreshProducts,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminUpdateOrderStatus,
        adminFetchAnalytics
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
