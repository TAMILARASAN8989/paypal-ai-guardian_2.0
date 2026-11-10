'use client';

import React, { useState } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage() {
  const { addTransaction, showNotification } = useGuardian();
  const [amount, setAmount] = useState('45.00');
  const [buyerName, setBuyerName] = useState('Sandbox Test Buyer');
  const [buyerEmail, setBuyerEmail] = useState('buyer@sandbox.paypal.com');
  const [description, setDescription] = useState('Sandbox Cloud Security License');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const handleCreateAndCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrderResult(null);

    try {
      // Step 1: Server-side order creation
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount).toFixed(2),
          currency: 'USD',
          description,
        }),
      });

      const createData = await createRes.json();
      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create PayPal sandbox order');
      }

      // Step 2: Server-side capture & fraud evaluation
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createData.orderId,
          amount: parseFloat(amount),
          senderName: buyerName,
          senderEmail: buyerEmail,
        }),
      });

      const captureData = await captureRes.json();
      if (captureData.success && captureData.transaction) {
        setOrderResult(captureData);
        addTransaction(captureData.transaction);
        showNotification(`Sandbox order ${createData.orderId} captured & screened server-side`);
      } else {
        throw new Error(captureData.error || 'Order capture failed');
      }
    } catch (err: any) {
      showNotification(err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">PayPal Developer Sandbox Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">
          Test live order creation, server-side capture verification, and automated fraud threat scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="md:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Payment Authorization Test Bench</div>
                <div className="text-[11px] text-slate-400">PayPal REST API v2 Order &amp; Capture Simulator</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SANDBOX MODE
            </span>
          </div>

          {/* Quick Scenario Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-slate-400">Quick Test Scenarios:</label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAmount('45.00');
                  setDescription('Verified SaaS Subscription');
                  setBuyerName('Elena Rostova');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] text-slate-300 hover:text-emerald-400 text-xs font-medium"
              >
                Standard Payment ($45.00)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount('3890.00');
                  setDescription('High-Value Cloud Server Lease');
                  setBuyerName('Alpha Venture Holdings');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] text-slate-300 hover:text-amber-400 text-xs font-medium"
              >
                High-Value Anomaly ($3,890.00)
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateAndCapture} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Payment Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-bold font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Purchase Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Buyer Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Buyer Email
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#FFC439] hover:bg-[#F4B41A] text-slate-950 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'Processing Server Capture & Screening...' : 'Execute PayPal Sandbox Order'}</span>
            </button>
          </form>
        </div>

        {/* Security & Architecture Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Frontend Trust Architecture</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with hackathon fintech guidelines, payments are never verified on client response tokens.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4">
              <li>Server-side OAuth token exchange</li>
              <li>Server-side order intent capture</li>
              <li>Heuristic threat scoring before balance settlement</li>
            </ul>
          </div>

          {/* Capture Result Receipt */}
          {orderResult && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sandbox Capture Verified</span>
              </div>
              <div className="text-xs text-slate-300">
                Order ID: <strong className="font-mono text-white">{orderResult.orderId}</strong>
              </div>
              <div className="text-xs text-slate-300">
                Risk Score: <strong className="text-emerald-400">{orderResult.transaction?.riskScore}/100 ({orderResult.transaction?.riskLevel})</strong>
              </div>
              <div className="text-[10px] text-slate-400 italic">
                {orderResult.advisoryNotice}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
