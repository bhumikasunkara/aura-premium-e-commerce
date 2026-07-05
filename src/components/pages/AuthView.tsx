import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Key, Mail, User as UserIcon, Eye, EyeOff, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

export const AuthView: React.FC = () => {
  const { login, register, error, setActiveTab } = useStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI Helpers
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Clientside validations
    if (!email.trim() || !password.trim()) {
      setFormError("Credentials cannot be left empty.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setFormError("Please state your name.");
        return;
      }
      if (password.length < 6) {
        setFormError("Security keys must exceed 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);
    let success = false;

    if (mode === "login") {
      success = await login(email.trim(), password);
    } else {
      success = await register(name.trim(), email.trim(), password);
    }

    setSubmitting(false);

    if (success) {
      setActiveTab("home");
      const event = new CustomEvent("aura_toast", { 
        detail: { message: mode === "login" ? "Welcome back to Aura." : "Aura registration complete.", type: "success" } 
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 space-y-8 animate-fade-in">
      
      {/* BRAND HEADER */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Bespoke Ecosystem</span>
        <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">
          {mode === "login" ? "Accede Aura Lounge" : "Claim Aura Membership"}
        </h1>
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          {mode === "login" 
            ? "Enter your secure registry credentials to access private portfolios." 
            : "Establish user profile nodes for complimentary carrier dispatch perks."}
        </p>
      </div>

      {/* FORM CORE */}
      <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        
        {formError && (
          <p className="text-xs font-bold text-red-500 text-center bg-red-50 py-2 rounded-none dark:bg-red-950/20">{formError}</p>
        )}
        {error && (
          <p className="text-xs font-bold text-red-500 text-center bg-red-50 py-2 rounded-none dark:bg-red-950/20">{error}</p>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* NAME (REGISTER ONLY) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Your Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Johnathan Doe"
                  className="w-full rounded-none border border-[#E5E5E1] py-2.5 pl-10 pr-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                />
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email ID</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johnathan@aura.com"
                className="w-full rounded-none border border-[#E5E5E1] py-2.5 pl-10 pr-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Registry Password</label>
              {mode === "login" && (
                <button type="button" onClick={() => alert("Credentials recovery links dispatched to input email.")} className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-800 dark:hover:text-white">Recover Key</button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-none border border-[#E5E5E1] py-2.5 pl-10 pr-10 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* PASSWORD STRENGTH GAUGE */}
            {mode === "register" && password.length > 0 && (
              <div className="pt-1 flex gap-1 items-center">
                <span className={`h-1 flex-1 rounded-none ${password.length >= 8 ? "bg-green-500" : password.length >= 6 ? "bg-amber-500" : "bg-red-500"}`} />
                <span className={`h-1 flex-1 rounded-none ${password.length >= 8 ? "bg-green-500" : "bg-gray-200 dark:bg-neutral-800"}`} />
                <span className={`h-1 flex-1 rounded-none ${password.length >= 10 ? "bg-green-500" : "bg-gray-200 dark:bg-neutral-800"}`} />
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-2">
                  {password.length >= 8 ? "Strong Key" : password.length >= 6 ? "Medium" : "Weak"}
                </span>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD (REGISTER ONLY) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-none border border-[#E5E5E1] py-2.5 pl-10 pr-3.5 text-xs font-semibold outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-1 py-3.5 rounded-none bg-[#1A1A1A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all active:scale-95"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1 text-white dark:text-neutral-950" />}
            <span>{mode === "login" ? "Enter Registry" : "Commit Registration"}</span>
          </button>

        </form>

        <div className="border-t border-[#E5E5E1] pt-4 text-center dark:border-neutral-800">
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setFormError(null);
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            {mode === "login" 
              ? "Establish new member account" 
              : "Access existing secure account node"}
          </button>
        </div>

      </div>

      {/* FOOTER PRIVACY NOTE */}
      <div className="text-center space-y-2">
        <p className="text-[10px] text-neutral-400 font-light">By accessing Aura registry, you agree to our structural privacy regulations.</p>
        <div className="flex justify-center space-x-3 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
          <button onClick={() => setActiveTab("terms")}>Terms</button>
          <span>•</span>
          <button onClick={() => setActiveTab("privacy")}>Privacy</button>
        </div>
      </div>

    </div>
  );
};
