'use client';

import React from 'react';
import { useGuardian } from '@/lib/store';
import { 
  ShieldAlert, 
  Bolt, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Power,
  RefreshCw,
  Info
} from 'lucide-react';

export default function FraudDetectionPage() {
  const { 
    rules, 
    toggleRule, 
    fraudThreshold, 
    setFraudThreshold, 
    autoBlockEnabled, 
    toggleAutoBlock, 
    simulateAttack 
  } = useGuardian();

  const enabledCount = rules.filter(r => r.isEnabled).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">AI Fraud Detection Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure real-time threat heuristics, behavioral velocity thresholds, and automated interception rules.
          </p>
        </div>
        <button
          onClick={simulateAttack}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Bolt className="w-4 h-4 text-amber-400" />
          <span>Fire Adversarial Attack Probe</span>
        </button>
      </div>

      {/* Engine Status & Sensitivity Control Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Heuristic Engine Status: ACTIVE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs text-slate-400">
                {enabledCount} of {rules.length} anomaly detection models actively screening incoming payments
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Autonomous Quarantine:</span>
            <button
              onClick={() => toggleAutoBlock(!autoBlockEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                autoBlockEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {autoBlockEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Sensitivity Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Autonomous Threat Interception Threshold
            </span>
            <span className="text-amber-400 font-bold font-mono text-sm">
              Score &gt; {fraudThreshold} pts
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={95}
            value={fraudThreshold}
            onChange={(e) => setFraudThreshold(Number(e.target.value))}
            className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Aggressive (30 pts - Higher False Positives)</span>
            <span>Conservative (95 pts - Strict Block Only)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed bg-[#090D16] p-3 rounded-lg border border-[#1E293B]">
            <Info className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
            Transactions scoring above {fraudThreshold} are immediately halted and quarantined to prevent checkout settlement.
          </p>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Active Heuristic Detection Algorithms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-xl border transition-all ${
                rule.isEnabled
                  ? 'bg-[#0F172A] border-[#1E293B] hover:border-[#2E3A52]'
                  : 'bg-[#090D16]/60 border-[#1E293B]/40 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-sm font-bold text-white">{rule.name}</div>
                  <div className="text-[11px] font-semibold text-cyan-400 mt-0.5">
                    Category: {rule.category} • Risk Weight: +{rule.riskWeight} pts
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    rule.isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  aria-label={`Toggle rule ${rule.name}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      rule.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">{rule.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-[#1E293B] text-[11px] text-slate-400">
                <span>Interceptions: <strong className="text-slate-200">{rule.triggerCount}</strong> events</span>
                <span>Last Triggered: <strong className="text-slate-200">{rule.lastTriggered}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
