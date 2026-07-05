import React from "react";
import { useStore } from "../context/StoreContext";

export const Footer: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <footer className="border-t border-gray-100 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          
          {/* BRAND */}
          <div className="col-span-2 space-y-4">
            <span 
              onClick={() => setActiveTab("home")}
              className="font-sans text-lg font-bold tracking-widest text-neutral-950 dark:text-white cursor-pointer"
            >
              AURA
            </span>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Bespoke acoustic design paired with architectural minimalism. Sculpted details for the modern creative.
            </p>
          </div>

          {/* PRIVILEGES */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Boutique</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab("shop")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Catalog Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("contact")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Concierge Support
                </button>
              </li>
            </ul>
          </div>

          {/* INFORMATIONS */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Regulations</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab("faq")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  General FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("privacy")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("terms")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Terms of Registry
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM METRICS */}
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] text-neutral-400 font-medium">
          <p>© {new Date().getFullYear()} Aura Inc. All privileges reserved.</p>
          <div className="flex space-x-6">
            <span className="cursor-default">Acoustics & Style calibrated</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
