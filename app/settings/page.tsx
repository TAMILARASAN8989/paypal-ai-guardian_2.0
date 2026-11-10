'use client';

import React, { useState } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  Settings, 
  Key, 
  Sliders, 
  ShieldCheck, 
  RefreshCw, 
  Bolt, 
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    isSandboxActive, 
    toggleSandbox, 
    autoBlockEnabled, 
    toggleAutoBlock, 
    fraudThreshold, 
    setFraudThreshold, 
    paypalClientId, 
    paypalSecret, 
    setPaypalCredentials, 
    simulateAttack, 
    resetDemoData, 
    showNotification 
  } = useGuardian();

  const [clientIdInput, setClientIdInput] = useState(paypalClientId);
  const [secretInput, setSecretInput] = useState(paypalSecret);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalCredentials(clientIdInput.trim(), secretInput.trim());
    showNotification('PayPal Developer Sandbox API credentials updated');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">System Configuration & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure PayPal Developer Sandbox credentials, fraud detection thresholds, and autonomous interception policies.
        </p>
      </div>

      {/* PayPal Sandbox Credentials Configuration */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">PayPal Developer Sandbox Credentials</div>
              <div className="text-xs text-slate-400">Configure your REST API keys for live sandbox token exchange.</div>
            </div>
          </div>
          <a
            href="https://developer.paypal.com/dashboard/applications/sandbox"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <span>PayPal Developer Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Sandbox Client ID
            </label>
            <input
              type="text"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              placeholder="e.g. sb-mock-client-id-49210 or your actual PayPal Sandbox Client ID"
              className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Sandbox Client Secret
            </label>
            <input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="Enter your sandbox client secret"
              className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              *If left as default mock keys, the system operates in simulated sandbox mode.
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>

      {/* Environment Policies */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-[#1E293B] pb-3">
          Sandbox Environment Toggles
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">PayPal Sandbox Gateway Active</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Routes checkout orders to sandbox accounts. Prevents real monetary settlements.
            </div>
          </div>
          <button
            onClick={() => toggleSandbox(!isSandboxActive)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              isSandboxActive ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isSandboxActive ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
          <div>
            <div className="text-xs font-bold text-white">Autonomous Threat Interception</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Instantly blocks transactions with threat scores exceeding the threshold.
            </div>
          </div>
          <button
            onClick={() => toggleAutoBlock(!autoBlockEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              autoBlockEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoBlockEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Threshold Slider */}
        <div className="pt-2 border-t border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Quarantine Sensitivity Threshold</span>
            <span className="text-amber-400 font-bold font-mono">{fraudThreshold} pts</span>
          </div>
          <input
            type="range"
            min={30}
            max={95}
            value={fraudThreshold}
            onChange={(e) => setFraudThreshold(Number(e.target.value))}
            className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Simulator & Demo Reset */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Auditor Simulation Controls
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={simulateAttack}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Bolt className="w-4 h-4" />
            <span>Simulate Adversarial Attack Probe</span>
          </button>

          <button
            onClick={resetDemoData}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Environment to Baseline</span>
          </button>
        </div>
      </div>

      {/* Hackathon Disclaimer */}
      <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2 text-xs text-slate-400">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
          Hackathon Prototype Notice
        </div>
        <p className="leading-relaxed">
          PAYPAL AI GUARDIAN is an independent cybersecurity prototype engineered for automated fraud detection research. It is not an official PayPal product and is not officially affiliated with PayPal Inc. All transactions and entities in this demonstration are simulated for testing and evaluation purposes.
        </p>
      </div>
    </div>
  );
}
