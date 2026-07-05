import React, { useRef } from "react";
import { useStore } from "../../context/StoreContext";
import { CheckCircle, ArrowRight, Printer, Download, Truck, Package, Clock } from "lucide-react";

export const OrderSuccessView: React.FC = () => {
  const { lastPlacedOrder, setActiveTab } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Invoice - Aura Boutique</title>
              <style>
                body { font-family: 'Inter', sans-serif; color: #171717; padding: 40px; margin: 0; }
                .header { display: flex; justify-content: space-between; border-b: 2px solid #e5e5e5; padding-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; letter-spacing: 0.15em; }
                .meta { text-align: right; font-size: 12px; line-height: 1.5; }
                .addresses { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: 40px; font-size: 12px; }
                .table { width: 100%; border-collapse: collapse; margin-top: 40px; font-size: 12px; }
                .table th { text-align: left; padding: 12px; border-bottom: 2px solid #e5e5e5; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; }
                .table td { padding: 12px; border-bottom: 1px solid #f5f5f5; }
                .summary { display: flex; flex-direction: column; align-items: flex-end; margin-top: 30px; font-size: 12px; line-height: 1.8; }
                .total { font-size: 16px; font-weight: bold; margin-top: 10px; border-top: 2px solid #171717; padding-top: 10px; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  if (!lastPlacedOrder) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-sm font-bold text-neutral-400">No order details found.</p>
        <button onClick={() => setActiveTab("home")} className="mt-4 rounded-full bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white">
          Back to Home
        </button>
      </div>
    );
  }

  const { id, date, orderItems, shippingAddress, shippingCost, discountAmount, totalAmount, paymentMethod, trackingNumber } = lastPlacedOrder;

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = (subtotal - discountAmount) * 0.08;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-12 animate-fade-in">
      
      {/* 1. SUCCESS HERO */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border border-[#E5E5E1] bg-white text-green-500 dark:bg-green-950/30">
          <CheckCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold tracking-widest text-green-600 uppercase">Transaction Confirmed</span>
          <h1 className="text-4xl font-serif font-normal text-[#1A1A1A] dark:text-white mt-1">Thank you for your order</h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto font-light">We've received your request. An executive invoice copy and carrier route tracking links have been sent to your inbox.</p>
        </div>
      </div>

      {/* 2. ORDER PROGRESS */}
      <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E5E1] pb-4 dark:border-neutral-800">
          <div>
            <h3 className="text-xs font-bold text-neutral-800 dark:text-white uppercase tracking-widest">Tracking Protocol</h3>
            <p className="text-[10px] font-mono text-neutral-400 mt-0.5">Route Code: {trackingNumber}</p>
          </div>
          <span className="inline-block mt-2 sm:mt-0 text-[10px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-3 py-1 rounded-none dark:bg-amber-950/20">
            Awaiting Carrier Pick-up
          </span>
        </div>

        {/* PROGRESS TIMELINE */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative">
          
          <div className="flex sm:flex-col items-center gap-3 sm:text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] font-bold text-xs border border-[#E5E5E1]">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Placed</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 font-light">Order confirmed</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 sm:text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-amber-500 text-white font-bold text-xs">
              <Clock className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Processing</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 font-light">Packaging items</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 sm:text-center opacity-40">
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-gray-200 text-neutral-500 font-bold text-xs">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Shipped</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 font-light">En route to carrier</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 sm:text-center opacity-40">
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-gray-200 text-neutral-500 font-bold text-xs">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Delivered</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 font-light">Left in secure locker</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. VISUAL INVOICE */}
      <div className="border border-[#E5E5E1] rounded-none p-6 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3 dark:border-neutral-800">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Printable Invoice Statement</h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="rounded-none border border-[#E5E5E1] bg-white p-2 text-neutral-500 hover:text-neutral-900 hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-800 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* PRINT TARGET AREA */}
        <div ref={printRef} className="p-4 bg-gray-50/30 rounded-none dark:bg-neutral-950/20 text-neutral-900 dark:text-white">
          <div className="header flex justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <div>
              <h2 className="logo font-serif text-lg font-normal tracking-widest text-neutral-950 dark:text-white">AURA</h2>
              <p className="text-[10px] text-neutral-400">Minimalist & Acoustic refinements</p>
            </div>
            <div className="meta text-right text-[11px] text-neutral-500 dark:text-neutral-400">
              <p>Invoice ID: {id}</p>
              <p>Issued: {new Date(date).toLocaleDateString()}</p>
              <p>Payment: {paymentMethod}</p>
            </div>
          </div>

          <div className="addresses grid grid-cols-2 gap-8 mt-6 text-xs text-neutral-500 dark:text-neutral-400">
            <div>
              <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">Billed To:</h4>
              <p className="mt-1 font-semibold text-neutral-900 dark:text-white">{shippingAddress.fullName}</p>
              <p className="mt-0.5">{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
              <p className="mt-1">{shippingAddress.phone}</p>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">Origin Warehouse:</h4>
              <p className="mt-1 font-semibold text-neutral-900 dark:text-white">Aura Logistics Hub 1</p>
              <p className="mt-0.5">800 Greenwich Street</p>
              <p>New York, NY 10014</p>
              <p>United States</p>
            </div>
          </div>

          <table className="table w-full mt-8 text-xs text-left text-neutral-500 dark:text-neutral-400">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 font-bold uppercase text-[10px] tracking-widest">
                <th className="py-2">Item Description</th>
                <th className="py-2">Selected Size</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Ext Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800/40">
                  <td className="py-3 font-semibold text-neutral-900 dark:text-white uppercase tracking-wide text-[11px]">{item.name}</td>
                  <td className="py-3">{item.selectedSize}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-serif italic text-sm text-neutral-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary flex flex-col items-end mt-6 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <div className="w-64 space-y-1">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-serif italic text-sm text-neutral-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount Applied</span>
                  <span className="font-serif italic text-sm">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Speed Charges</span>
                <span className="font-serif italic text-sm text-neutral-900 dark:text-white">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>State Tax (8%)</span>
                <span className="font-serif italic text-sm text-neutral-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-neutral-950 pt-2 dark:border-white font-bold uppercase tracking-widest text-xs text-neutral-950 dark:text-white">
                <span>Invoice Total Paid</span>
                <span className="font-serif italic text-base">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CONTINUOUS SHOP CTA */}
      <div className="text-center">
        <button
          onClick={() => setActiveTab("shop")}
          className="rounded-none bg-[#1A1A1A] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-1.5 mx-auto"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
