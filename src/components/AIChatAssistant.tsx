import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, HelpCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  date: string;
}

export const AIChatAssistant: React.FC = () => {
  const { products } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Welcome to Aura. I am Aura, your design and lifestyle concierge. How may I assist you in finding the perfect audio, wearables, or minimalist workspace refinements today?",
      date: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: inputText,
      date: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Map chat history for server context (excluding IDs and dates)
      const chatHistory = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          chatHistory
        })
      });

      const data = await res.json();
      
      const assistantMessage: ChatMessage = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        sender: "assistant",
        text: data.reply || "I am currently unable to parse details. Feel free to explore our product shelves directly.",
        date: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI Assistant response error:", err);
      setMessages(prev => [...prev, {
        id: "err_" + Math.random(),
        sender: "assistant",
        text: "My apologies. I encountered a connectivity interruption. Our catalog services remain fully accessible.",
        date: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInputText(q);
  };

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white shadow-xl hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-all hover:scale-110 active:scale-95"
        id="ai-assistant-fab"
        title="Open AI Concierge"
      >
        <Sparkles className="h-6 w-6 animate-pulse text-amber-400 dark:text-amber-500" />
      </button>

      {/* CHAT DRAWER */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300">
          
          {/* HEADER */}
          <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-6 dark:border-neutral-800 bg-neutral-950 text-white rounded-tl-3xl">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-amber-400">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-widest text-white">AURA CONCIERGE</h2>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">AI Styling Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* CHAT WINDOW */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex w-full items-start space-x-3 ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {/* AVATAR */}
                <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border text-xs font-bold ${m.sender === "user" ? "bg-neutral-100 text-neutral-800 border-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700" : "bg-neutral-950 text-amber-400 border-neutral-800 dark:bg-white dark:text-neutral-900 dark:border-neutral-200"}`}>
                  {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                </div>

                {/* BUBBLE */}
                <div className={`flex flex-col max-w-[75%]`}>
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${m.sender === "user" ? "bg-neutral-900 text-white rounded-tr-none dark:bg-white dark:text-neutral-950" : "bg-neutral-50 text-neutral-800 rounded-tl-none dark:bg-neutral-800/40 dark:text-neutral-200"}`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <span className={`text-[9px] text-neutral-400 mt-1 ${m.sender === "user" ? "text-right" : ""}`}>
                    {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex w-full items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-amber-400 dark:bg-white dark:text-neutral-950">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex flex-col max-w-[75%]">
                  <div className="rounded-2xl px-4 py-3 bg-neutral-50 rounded-tl-none dark:bg-neutral-800/40 flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTIONS */}
          {messages.length <= 2 && !isTyping && (
            <div className="px-6 pb-2">
              <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-2 dark:text-neutral-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> Quick Inquiries
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickQuestion("Which products are featured or best sellers?")}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 dark:hover:border-neutral-600"
                >
                  Featured best sellers
                </button>
                <button
                  onClick={() => handleQuickQuestion("Tell me about Aura Studio Headphones.")}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 dark:hover:border-neutral-600"
                >
                  Aura Studio Headphones
                </button>
                <button
                  onClick={() => handleQuickQuestion("Do you have premium leather bags or sneakers?")}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300 dark:hover:border-neutral-600"
                >
                  Bags and sneakers
                </button>
              </div>
            </div>
          )}

          {/* INPUT FORM */}
          <form onSubmit={handleSendMessage} className="border-t border-neutral-100 p-4 dark:border-neutral-800">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask Aura concierge..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="w-full rounded-2xl border border-gray-200 py-3 pl-4 pr-12 text-xs font-medium outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white dark:focus:border-neutral-700"
              />
              <button
                type="submit"
                disabled={isTyping || !inputText.trim()}
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-center text-[9px] text-neutral-400 tracking-wide">Concierge utilizes Gemini 3.5 Flash for elite product navigation.</p>
          </form>

        </div>
      )}
    </>
  );
};
