import React from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../ProductCard";
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

export const HomeView: React.FC = () => {
  const { products, setActiveTab, setSelectedProductId } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
    setActiveTab("product");
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-[#1A1A1A] text-white rounded-none mx-4 sm:mx-6 lg:mx-8 my-6 border border-[#E5E5E1]/20">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1920"
            alt="Aura Luxury Banner"
            className="h-full w-full object-cover object-center grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-neutral-950/80"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-12 sm:py-28 lg:px-16 lg:py-32 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center px-3.5 py-1 bg-white text-[#1A1A1A] rounded-full text-[10px] font-bold tracking-widest uppercase">
            Neural Recommendation Engine Active
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight max-w-4xl leading-none">
            The New <br />
            <span className="italic sm:ml-20 text-neutral-300">Standard</span>
          </h1>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-neutral-400 font-light">
            Our AI-driven personalization learns your aesthetic preferences to curate a gallery of essentials designed for the modern minimalist. Immerse yourself in precision acoustic architecture.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => selectProduct("p1")}
              className="border border-white bg-white text-[#1A1A1A] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>Explore Studio</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className="border border-white/30 bg-transparent text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all"
            >
              Browse Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 border-b border-gray-100 pb-12 dark:border-neutral-800">
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 dark:bg-neutral-800 dark:text-white mb-3">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Free Express Delivery</h3>
            <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">On all domestic orders over $150</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 dark:bg-neutral-800 dark:text-white mb-3">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">30-Day Returns</h3>
            <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">Hassle-free, complimentary shipping</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 dark:bg-neutral-800 dark:text-white mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Lifetime Warranty</h3>
            <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">Guaranteed premium craftsmanship</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 dark:bg-neutral-800 dark:text-white mb-3">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Aura Membership</h3>
            <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">Unlock rewards, sales & early drops</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES HUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Explore Collections</span>
            <h2 className="text-3xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Shop by Category</h2>
          </div>
          <button onClick={() => setActiveTab("shop")} className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white hover:opacity-80 transition-opacity">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          <div onClick={() => setActiveTab("shop")} className="group relative h-72 cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-950">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400"
              alt="Audio Collection"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-base font-bold tracking-wide">Audio</h3>
              <p className="text-[10px] text-neutral-300 font-semibold uppercase tracking-wider mt-0.5">Premium Headsets & Pods</p>
            </div>
          </div>

          <div onClick={() => setActiveTab("shop")} className="group relative h-72 cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-950">
            <img
              src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400"
              alt="Wearables Collection"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-base font-bold tracking-wide">Wearables</h3>
              <p className="text-[10px] text-neutral-300 font-semibold uppercase tracking-wider mt-0.5">Sleek smartwatches</p>
            </div>
          </div>

          <div onClick={() => setActiveTab("shop")} className="group relative h-72 cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-950">
            <img
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400"
              alt="Workspace Collection"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-base font-bold tracking-wide">Workspace</h3>
              <p className="text-[10px] text-neutral-300 font-semibold uppercase tracking-wider mt-0.5">Refined desk accessories</p>
            </div>
          </div>

          <div onClick={() => setActiveTab("shop")} className="group relative h-72 cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-950">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400"
              alt="Apparel Collection"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-base font-bold tracking-wide">Apparel</h3>
              <p className="text-[10px] text-neutral-300 font-semibold uppercase tracking-wider mt-0.5">Minimalist wear & shoes</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (GRID) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Selected Works</span>
            <h2 className="text-3xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Featured Essentials</h2>
          </div>
          <button onClick={() => setActiveTab("shop")} className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white hover:opacity-80 transition-opacity">
            <span>Explore All</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. SPLIT MARKETING SLIDES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 sm:mx-6 lg:mx-8">
        <div className="relative h-[420px] rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-12 flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"
            alt="Chronos Smartwatch"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent"></div>
          <div className="relative z-10 space-y-4">
            <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase">Aerospace Wearables</span>
            <h3 className="text-2xl font-bold tracking-tight">Aura Chronos Smartwatch S</h3>
            <p className="text-xs text-neutral-300 max-w-sm leading-relaxed font-medium">LTPO Retina panel housed in sculpted space grade titanium casing. Health, communication and navigation aligned.</p>
            <button onClick={() => selectProduct("p2")} className="rounded-full bg-white text-neutral-900 px-5 py-2.5 text-xs font-bold hover:bg-neutral-100 transition-colors">
              Explore Design
            </button>
          </div>
        </div>

        <div className="relative h-[420px] rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-12 flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800"
            alt="Heritage Backpack"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent"></div>
          <div className="relative z-10 space-y-4">
            <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase">Handmade Leatherware</span>
            <h3 className="text-2xl font-bold tracking-tight">Aura Heritage Leather Backpack</h3>
            <p className="text-xs text-neutral-300 max-w-sm leading-relaxed font-medium">Vegetable tanned full-grain leather containing secure felt linings for laptop hardware. Aged by lifetime elements.</p>
            <button onClick={() => selectProduct("p5")} className="rounded-full bg-white text-neutral-900 px-5 py-2.5 text-xs font-bold hover:bg-neutral-100 transition-colors">
              Explore Craft
            </button>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Popular Demands</span>
          <h2 className="text-3xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Best Selling Essentials</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. REVIEWS & TESTIMONIALS */}
      <section className="bg-neutral-50 dark:bg-neutral-900/40 py-16 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Endorsements</span>
            <h2 className="text-3xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Reflections from Aura Members</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                  "The Aura tactile mechanical keyboard is a tactile dream. Its heavy aluminum frame doesn't move on my desk, and the linear switches sound incredible."
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-6 border-t border-gray-50 pt-4 dark:border-neutral-800">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80" alt="Reviewer" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Marcus Vance</h4>
                  <p className="text-[10px] text-neutral-400">Architect & Developer</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                  "Spectacular noise cancellation on the Headphones. They completely lock out the coffee house noise so I can write code in absolute acoustic isolation."
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-6 border-t border-gray-50 pt-4 dark:border-neutral-800">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80" alt="Reviewer" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Sarah Jenkins</h4>
                  <p className="text-[10px] text-neutral-400">UI Designer, Apple</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                  "Curated, premium, high-quality. No unnecessary marketing labels or loud colors. The packaging alone feels like buying a high-end designer watch."
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-6 border-t border-gray-50 pt-4 dark:border-neutral-800">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=80" alt="Reviewer" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">David Miller</h4>
                  <p className="text-[10px] text-neutral-400">Senior Art Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="mx-4 sm:mx-6 lg:mx-8">
        <div className="bg-[#1A1A1A] text-white rounded-none p-8 sm:p-16 lg:p-20 text-center max-w-4xl mx-auto space-y-6 border border-[#E5E5E1]/20">
          <span className="text-[10px] font-bold tracking-widest text-[#E5E5E1]/60 uppercase">Aura Publications</span>
          <h2 className="font-serif text-3xl font-normal sm:text-5xl">Acquire the Aura Dispatch</h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-light">Receive private briefings containing early product invitations, member-only gallery openings, and architectural inspiration design notes.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to the Aura Dispatch list."); }} className="max-w-md mx-auto flex items-center gap-2 bg-neutral-900 rounded-none p-1 border border-neutral-800">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="bg-transparent text-xs text-white pl-4 pr-2 outline-none flex-grow"
            />
            <button type="submit" className="bg-white text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-neutral-100 transition-colors">
              Subscribe
            </button>
          </form>
          <p className="text-[9px] text-neutral-500">Unsubscribe at any moment. Zero trace.</p>
        </div>
      </section>

    </div>
  );
};
