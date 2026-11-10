'use client';

import React, { useState } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  Globe, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { UrlScanResult } from '@/types';

const PRESET_URLS = [
  { label: 'Homograph Attack', url: 'https://paypaI-resolution-center.support-desk.xyz/verify?id=992' },
  { label: 'Official Sandbox', url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders' },
  { label: 'Insecure Phish', url: 'http://invoice-paypal-client-confirm.tk/bill/pay' },
];

export default function UrlScannerPage() {
  const { urls, addUrlScan, showNotification } = useGuardian();
  const [targetUrl, setTargetUrl] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = async (urlToScan?: string) => {
    const url = (urlToScan || targetUrl).trim();
    if (!url) return;

    setScanning(true);
    try {
      const res = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        addUrlScan(data.result);
        setTargetUrl('');
        showNotification(`URL threat audit complete: ${data.result.classification}`);
      }
    } catch (err) {
      showNotification('Failed to execute URL security scan');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Phishing & Gateway URL Scanner</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detects homograph glyph spoofing (e.g. Cyrillic &apos;I&apos; substitutions), SSL certificate validity, domain registration age, and threat reputation.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Inspect Destination Link / Checkout Redirect</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="e.g. https://paypaI-resolution-center.xyz or invoice link..."
              className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={() => handleScan()}
            disabled={scanning || !targetUrl.trim()}
            className="px-6 py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{scanning ? 'Scanning Domain...' : 'Scan Target URL'}</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Test Presets:</span>
          {PRESET_URLS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setTargetUrl(item.url);
                handleScan(item.url);
              }}
              className="px-3 py-1 rounded-md text-[11px] font-semibold bg-[#111928] border border-[#1E293B] hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>{item.label}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Scanned Results Feed */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Inspected URLs & Threat Records ({urls.length})
        </h2>

        <div className="space-y-4">
          {urls.map((scan) => {
            const isSafe = scan.reputationScore >= 70;
            return (
              <div
                key={scan.id}
                className={`p-6 rounded-xl border bg-[#0F172A] transition-all ${
                  isSafe ? 'border-emerald-500/30' : 'border-rose-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-white">{scan.domain}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSafe ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {scan.classification}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1 break-all">{scan.targetUrl}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Reputation</div>
                      <div className={`text-xl font-bold font-mono ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {scan.reputationScore}/100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Homograph Attack Warning Banner */}
                {scan.homographAttackDetected && (
                  <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs font-bold text-rose-300 mb-4">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>HOMOGRAPH ATTACK DETECTED: Deceptive Cyrillic character substitution spoofing {scan.typosquattingTarget || 'PayPal brand'}</span>
                  </div>
                )}

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#090D16] p-3 rounded-lg border border-[#1E293B] mb-4">
                  <div>
                    <span className="text-slate-400 text-[10px] block">IP Address</span>
                    <span className="font-mono text-slate-200">{scan.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">SSL Status</span>
                    <span className={`font-semibold ${scan.sslValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {scan.sslValid ? 'Valid' : 'Invalid / Insecure'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">SSL Issuer</span>
                    <span className="text-slate-300 truncate block">{scan.sslIssuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Domain Age</span>
                    <span className="font-mono text-slate-200">{scan.domainAgeDays} days</span>
                  </div>
                </div>

                {/* Threat Details */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Audit Findings:</div>
                  {scan.threatDetails.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {isSafe ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
