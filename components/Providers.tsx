'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GuardianProvider, useGuardian } from '@/lib/store';
import { 
  Shield, 
  LayoutDashboard, 
  Receipt, 
  ShieldAlert, 
  FileCheck, 
  Globe, 
  Bot, 
  Bell, 
  Settings, 
  CreditCard,
  Menu, 
  X,
  Bolt,
  CheckCircle2
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Fraud Detection', href: '/fraud-detection', icon: ShieldAlert },
  { name: 'Payment Proof', href: '/payment-proof', icon: FileCheck },
  { name: 'URL Scanner', href: '/url-scanner', icon: Globe },
  { name: 'AI Assistant', href: '/assistant', icon: Bot },
  { name: 'Security Alerts', href: '/alerts', icon: Bell },
  { name: 'Sandbox Checkout', href: '/checkout', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { alerts, notification, clearNotification, simulateAttack } = useGuardian();

  const unresolvedAlertCount = alerts?.filter(a => !a.isResolved).length ?? 0;

  return (
    <div className="min-h-screen flex bg-[#090D16] text-slate-100 antialiased">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0F172A] border border-emerald-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{notification}</span>
          <button onClick={clearNotification} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#1E293B]">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide text-white">PAYPAL AI GUARDIAN</div>
              <div className="text-[10px] text-slate-400 font-medium">Intelligent Payment Protection</div>
            </div>
          </Link>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.name === 'Security Alerts' && unresolvedAlertCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {unresolvedAlertCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E293B] bg-[#090D16]/70 m-3 rounded-xl border">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Engine: Active
            </span>
            <span className="text-[10px] text-slate-400">TLS 1.3</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            PayPal Sandbox Connected. Independent Hackathon Prototype.
          </p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <header className="h-16 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SANDBOX ENVIRONMENT
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">{pathname}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={simulateAttack}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Bolt className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Test Attack Probe</span>
            </button>

            <Link
              href="/alerts"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] relative"
              title="Security Alerts"
            >
              <Bell className="w-4 h-4" />
              {unresolvedAlertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-[#1E293B]">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                PA
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white">Payment Auditor</div>
                <div className="text-[10px] text-slate-400">Sandbox Admin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GuardianProvider>
      <ShellInner>{children}</ShellInner>
    </GuardianProvider>
  );
}
