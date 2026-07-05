import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, ShieldAlert, FileText } from "lucide-react";

// ABOUT VIEW
export const AboutView: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Design Manifesto</span>
        <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Acoustical & Refined Architecture</h1>
      </div>

      <div className="aspect-video w-full rounded-none overflow-hidden bg-gray-100 border border-[#E5E5E1] dark:border-neutral-800">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
          alt="Aura Design Workshop"
          className="h-full w-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-6 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
        <p>
          Founded in New York City, Aura is a premium lifestyle brand bridging high-performance acoustics with architectural minimalist design. We build tools and accessories for the creative vanguard who require uncompromising performance draped in pure visual silence.
        </p>
        <p>
          Every item in our gallery is crafted with structural honesty. We reject unnecessary labels, loud colors and decorative clutter. Instead, we elevate authentic materials—space grade aluminum, aerospace titanium, full grain vegetable-tanned leathers and fine woven textiles.
        </p>
        <p>
          Our acoustic devices are calibrated in bespoke anechoic chambers to reproduce sound exactly as the creator captured it. No synthetic bass boosters or frequency inflation—only absolute, pure high-fidelity sonic truth.
        </p>
      </div>
    </div>
  );
};

// CONTACT VIEW
export const ContactView: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setMessage("");
      const event = new CustomEvent("aura_toast", { 
        detail: { message: "Aura Concierge Support has received your dispatch.", type: "success" } 
      });
      window.dispatchEvent(event);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Concierge Line</span>
        <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Connect with Aura</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* DISPATCH FORM */}
        <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-neutral-200">Electronic Dispatch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Aurelius"
                className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@philosophy.com"
                className="w-full rounded-none border border-[#E5E5E1] py-2.5 px-3.5 text-xs outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Message Dispatch</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inquire on collections, sizing, or private acoustics consultations..."
                className="w-full rounded-none border border-[#E5E5E1] p-3.5 text-xs outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 font-light"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full flex items-center justify-center space-x-1.5 py-3.5 rounded-none bg-[#1A1A1A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest dark:bg-white dark:text-[#1A1A1A]"
            >
              <Send className="h-4 w-4" />
              <span>{submitted ? "Sending Dispatch..." : "Send Secure Message"}</span>
            </button>
          </form>
        </div>

        {/* METADATA COORDS */}
        <div className="space-y-8 text-xs font-light text-neutral-600 dark:text-neutral-400">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-neutral-200">Global Coords</h2>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-4.5 w-4.5 text-neutral-900 dark:text-white mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wider text-[11px]">Aura Headquarters</p>
                <p className="mt-1 font-light">800 Greenwich Street</p>
                <p className="font-light">New York, NY 10014</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="h-4.5 w-4.5 text-neutral-900 dark:text-white mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wider text-[11px]">Secure Mail Channels</p>
                <p className="mt-1 font-light">support@auraboutique.com</p>
                <p className="font-light">concierge@auraboutique.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-4.5 w-4.5 text-neutral-900 dark:text-white mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wider text-[11px]">Voice Concierge Line</p>
                <p className="mt-1 font-light">+1 (800) 909-AURA</p>
                <p className="font-light text-neutral-400">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E5E5E1] rounded-none overflow-hidden aspect-video relative dark:border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600"
              alt="Mock Map location"
              className="h-full w-full object-cover opacity-60 dark:opacity-40 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-neutral-950/10 dark:bg-neutral-950/40"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

// FAQ VIEW
export const FAQView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs = [
    {
      q: "What makes Aura acoustics sound signature unique?",
      a: "Our sound engineers configure a flat, high-fidelity studio response. We refuse digital equalizers that artificially inflate bass signatures. We preserve complete vocal ranges and transients exactly as they were engineered inside recording bays."
    },
    {
      q: "Where do you ship products from?",
      a: "All boutique orders ship from our primary climate-controlled warehousing facilities inside New York. Order dispatches are completed within 24 hours of checkout authorization."
    },
    {
      q: "How does the lifetime warranty operate?",
      a: "Aura warrants that our hardware components are free of manufacturing defects for the entire lifetime of the original buyer. If a structural wire, solder joint or shell crack manifests under regular use patterns, we replace it complimentary."
    },
    {
      q: "Can I cancel or alter my shipping destination?",
      a: "Due to our immediate automated logistics fulfillment loop, shipping destinations can only be altered if written request is submitted within 30 minutes of placing the checkout order."
    }
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Information Center</span>
        <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Frequently Queried</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => {
          const isExpanded = expandedId === i;
          return (
            <div key={i} className="border border-[#E5E5E1] rounded-none overflow-hidden bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <button
                onClick={() => setExpandedId(isExpanded ? null : i)}
                className="w-full flex items-center justify-between p-4 font-normal text-xs text-left text-[#1A1A1A] dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/20"
              >
                <span className="uppercase tracking-wider text-[11px] font-bold">{f.q}</span>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
              </button>
              {isExpanded && (
                <div className="p-4 border-t border-[#E5E5E1] dark:border-neutral-800 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 font-light bg-neutral-50/20">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// PRIVACY VIEW
export const PrivacyView: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-2 border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
        <ShieldAlert className="h-5 w-5 text-neutral-800 dark:text-white" />
        <h1 className="text-xl font-serif font-normal text-neutral-950 dark:text-white">Privacy Regulations</h1>
      </div>
      <div className="space-y-4 text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
        <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest text-[10px]">1. Secure Profile Ledger</p>
        <p>Aura maintains strict standards regarding individual user records. When you register a member node, all details are locked behind TLS hashes. We never monetize or rent transaction sheets to marketing entities.</p>
        <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest text-[10px]">2. Cookies & Trace Settings</p>
        <p>We apply minimal, high-efficiency functional cookies to handle local shopping bag items, wishlist references and keep dashboard login tokens. No background trace nodes or behavioral advertising trackers are authorized.</p>
        <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest text-[10px]">3. Payment Encryption Protocol</p>
        <p>Your monetary transactions are processed directly by our clearing partners at Stripe. Aura's database systems do not have memory fields to store raw CVV codes or complete banking numbers.</p>
      </div>
    </div>
  );
};

// TERMS VIEW
export const TermsView: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-2 border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
        <FileText className="h-5 w-5 text-neutral-800 dark:text-white" />
        <h1 className="text-xl font-serif font-normal text-neutral-950 dark:text-white">Terms of Registry</h1>
      </div>
      <div className="space-y-4 text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
        <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest text-[10px]">1. Authorized Usage</p>
        <p>By purchasing catalog items from Aura Store, you represent that products are acquired for individual custom enjoyment and visual refinement. Compulsive automatic scraping or commercial secondary scalping of boutique runs is strictly prohibited.</p>
        <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest text-[10px]">2. Shipping Allocations</p>
        <p>Aura guarantees carrier dispatch within 48 hours for all items displaying clear stock indicators. If unexpected warehouse shortages happen, you are immediately briefed and given direct options for complete refund cancellation.</p>
        <p className="font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest text-[10px]">3. Warranties & Liability</p>
        <p>In no situation shall Aura be liable for custom incidental acoustic damage resulting from excessive headphone decibel usage. Guard your acoustic senses as you enjoy our ultra-isolation performance devices.</p>
      </div>
    </div>
  );
};
