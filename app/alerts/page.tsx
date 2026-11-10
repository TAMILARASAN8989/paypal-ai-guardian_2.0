'use client';

import React, { useState } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Filter,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { RiskLevel } from '@/types';

export default function AlertsPage() {
  const { alerts, resolveAlert, dismissAlert } = useGuardian();
  const [selectedSeverity, setSelectedSeverity] = useState<RiskLevel | 'ALL'>('ALL');

  const filtered = alerts.filter((a) => {
    return selectedSeverity === 'ALL' || a.severity === selectedSeverity;
  });

  const unresolved = filtered.filter(a => !a.isResolved);
  const resolved = filtered.filter(a => a.isResolved);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Security Alerts & Threat Events</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of intercepted payment anomalies, bot probes, and velocity alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {alerts.filter(a => !a.isResolved).length} Pending Review
          </span>
        </div>
      </div>

      {/* Severity Filter Chips */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Severity Filter:
        </span>
        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              selectedSeverity === sev
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-[#090D16] text-slate-400 border border-[#1E293B] hover:text-slate-200'
            }`}
          >
            {sev === 'ALL' ? 'All Severities' : sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">No Security Alerts Found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All incident anomalies have been mitigated or dismissed from this view.
            </p>
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border transition-all ${
                alert.isResolved
                  ? 'bg-[#0F172A]/50 border-[#1E293B] opacity-60'
                  : 'bg-[#0F172A] border-rose-500/30 shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      alert.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-sm font-bold text-white">{alert.title}</span>
                    <span className="text-xs text-cyan-400 font-semibold">• {alert.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>Target: <strong className="font-mono text-slate-200">{alert.affectedRef}</strong></span>
                    <span>Reported: <strong className="text-slate-300">{alert.timestamp}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {!alert.isResolved ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mitigate</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Mitigated
                    </span>
                  )}

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
                    title="Dismiss Alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
