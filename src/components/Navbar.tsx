import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ShoppingBag, Heart, User, Sun, Moon, Search, LogOut, Bell, LayoutDashboard, Settings } from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    user,
    cart,
    wishlist,
    notifications,
    darkMode,
    setDarkMode,
    activeTab,
    setActiveTab,
    logout,
    markNotificationsAsRead
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab("shop");
    // Trigger search filter in shop by modifying query param or context
    const event = new CustomEvent("aura_search", { detail: searchQuery });
    window.dispatchEvent(event);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab("home")} 
          className="flex cursor-pointer items-center space-x-2 font-sans text-xl font-bold tracking-widest text-neutral-900 dark:text-white"
          id="navbar-logo"
        >
          <span className="bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">AURA</span>
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => setActiveTab("home")}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white ${activeTab === "home" ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-1" : "text-neutral-500 dark:text-neutral-400"}`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white ${activeTab === "shop" ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-1" : "text-neutral-500 dark:text-neutral-400"}`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white ${activeTab === "about" ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-1" : "text-neutral-500 dark:text-neutral-400"}`}
          >
            Story
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white ${activeTab === "contact" ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-1" : "text-neutral-500 dark:text-neutral-400"}`}
          >
            Contact
          </button>
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center space-x-4">
          
          {/* SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search Aura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 lg:w-64 rounded-full border border-gray-200 bg-gray-50/50 py-1.5 pl-4 pr-10 text-xs font-medium tracking-wide outline-none transition-all focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* LIGHT / DARK TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            id="theme-toggle"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* NOTIFICATION CENTER */}
          {user && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                id="notifications-toggle"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-900">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-200">
                  <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2 dark:border-neutral-800">
                    <span className="text-xs font-bold tracking-wide uppercase text-neutral-900 dark:text-white">Inbox ({unreadNotifications} Unread)</span>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">Close</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-neutral-400 dark:text-neutral-500">Your notification inbox is clean.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`rounded-xl p-2.5 transition-all text-xs border ${n.read ? "bg-transparent border-transparent" : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800/60"}`}>
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-100">{n.title}</h4>
                            <span className="text-[9px] text-neutral-400">{new Date(n.date).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-1 leading-relaxed text-neutral-500 dark:text-neutral-400">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WISHLIST BUTTON */}
          <button
            onClick={() => setActiveTab("wishlist")}
            className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            id="wishlist-nav"
            title="Wishlist"
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white ring-2 ring-white dark:bg-white dark:text-neutral-900 dark:ring-neutral-900">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* CART BUTTON */}
          <button
            onClick={() => setActiveTab("cart")}
            className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            id="cart-nav"
            title="Shopping Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white ring-2 ring-white dark:bg-white dark:text-neutral-900 dark:ring-neutral-900">
                {cartCount}
              </span>
            )}
          </button>

          {/* USER PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-1.5 focus:outline-none"
              id="profile-dropdown-btn"
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-neutral-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors">
                  <User className="h-4.5 w-4.5" />
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-200">
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-neutral-800 mb-1.5">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                      <span className={`inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"}`}>
                        {user.role === "admin" ? "AURA STAFF" : "AURA MEMBER"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile & Orders</span>
                    </button>

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setActiveTab("admin");
                          setShowProfileMenu(false);
                        }}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-gray-100 dark:border-neutral-800"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="p-2 space-y-1">
                    <p className="text-[11px] text-neutral-400 text-center px-2 py-1 leading-relaxed">Join Aura for premium privileges, express shipping, and seamless checkout.</p>
                    <button
                      onClick={() => {
                        setActiveTab("login");
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full justify-center rounded-lg bg-neutral-900 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                      Login / Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
