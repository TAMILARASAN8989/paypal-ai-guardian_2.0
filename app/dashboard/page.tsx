'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGuardian } from '@/lib/store';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  X,
  FileSearch,
  Lock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Transaction } from '@/types';

const ACTIVITY_CHART_DATA = [
  { day: 'Mon', volume: 24, threats: 2 },
  { day: 'Tue', volume: 38, threats: 5 },
  { day: 'Wed', volume: 45, threats: 3 },
  { day: 'Thu', volume: 52, threats: 8 },
  { day: 'Fri', volume: 68, threats: 4 },
  { day: 'Sat', volume: 41, threats: 1 },
  { day: 'Sun', volume: 59, threats: 6 },
];

export default function DashboardPage() {
  const { kpis, transactions, alerts, approveTransaction, blockTransaction } = useGuardian();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const lowCount = transactions.filter(t => t.riskLevel === 'LOW').length;
  const medCount = transactions.filter(t => t.riskLevel === 'MEDIUM').length;
  const highCount = transactions.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL').length;
  const total = transactions.length || 1;

  const riskPieData = [
    { name: 'Low Risk', value: lowCount, color: '#10B981' },
    { name: 'Medium Risk', value: medCount, color: '#F59E0B' },
    { name: 'High / Critical', value: highCount, color: '#F43F5E' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Security Operations Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time transaction forensics, anomaly telemetry, and sandbox verification feed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Test Sandbox Payment</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Transactions */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 hover:border-[#2E3A52] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Total Monitored</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{kpis.totalTransactions}</div>
          <div className="text-xs text-slate-400 mt-1">
            Volume: <span className="text-slate-200 font-semibold">${kpis.totalVolumeUsd.toLocaleString()} USD</span>
          </div>
        </div>

        {/* Card 2: Verified Sandbox */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 hover:border-[#2E3A52] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Verified Sandbox</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{kpis.verifiedPayments}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Integrity check 100% verified
          </div>
        </div>

        {/* Card 3: Suspicious Threats */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 hover:border-[#2E3A52] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Suspicious Threats</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{kpis.suspiciousCount}</div>
          <div className="text-xs text-rose-400 mt-1">
            Prevented: <span className="font-semibold">${kpis.preventedFraudUsd.toLocaleString()} USD</span>
          </div>
        </div>

        {/* Card 4: Requires Review */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 hover:border-[#2E3A52] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Requires Review</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{kpis.reviewRequiredCount}</div>
          <div className="text-xs text-amber-400 mt-1">Secondary compliance auth</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Threat Line Chart */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Transaction Activity & Threat Events</h2>
              <p className="text-xs text-slate-400">7-day rolling sandbox volume vs. intercepted fraud anomalies</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Volume
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Threats
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_CHART_DATA}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090D16', 
                    borderColor: '#1E293B', 
                    borderRadius: '8px',
                    fontSize: '12px' 
                  }} 
                />
                <Area type="monotone" dataKey="volume" stroke="#06B6D4" strokeWidth={2} fill="url(#colorVol)" />
                <Area type="monotone" dataKey="threats" stroke="#F43F5E" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Donut Chart */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Risk Severity Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">Classification ratio of inspected transactions</p>
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskPieData} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={4}>
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-[#1E293B]">
            {riskPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-200">
                  {item.value} ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Threat Activity Section */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Active Threat Heuristic Feed</h2>
            <p className="text-xs text-slate-400">Incoming suspicious transaction signals and bot probes</p>
          </div>
          <Link href="/alerts" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>View All Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.slice(0, 4).map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.isResolved 
                  ? 'bg-[#090D16]/50 border-[#1E293B] opacity-60' 
                  : 'bg-[#111928] border-rose-500/20 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    alert.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-white">{alert.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{alert.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
                <span className="text-[11px] font-mono text-cyan-400">Target: {alert.affectedRef}</span>
                <span className="text-[10px] font-semibold text-slate-400">{alert.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Monitored Transactions Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Monitored Transactions</h2>
            <p className="text-xs text-slate-400">Live sandbox payment events screened by AI Guardian</p>
          </div>
          <Link href="/transactions" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>Open Registry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Reference</th>
                <th className="pb-3">Parties</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Risk Assessment</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-200">
              {transactions.slice(0, 6).map((txn) => (
                <tr key={txn.id} className="hover:bg-[#1E293B]/40 transition-colors">
                  <td className="py-3 font-mono text-cyan-400 font-semibold">{txn.reference}</td>
                  <td className="py-3">
                    <div className="font-medium text-white">{txn.senderName}</div>
                    <div className="text-[11px] text-slate-400">→ {txn.recipientName}</div>
                  </td>
                  <td className="py-3 font-bold text-white">
                    ${txn.amount.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">{txn.currency}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      txn.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                      txn.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                      txn.status === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-rose-950/60 text-rose-300 border border-rose-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      txn.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400' :
                      txn.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {txn.riskLevel} ({txn.riskScore}/100)
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{txn.timestamp}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#1E293B] hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Inspection Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Transaction Forensics</div>
                <div className="text-lg font-bold text-white font-mono">{selectedTxn.reference}</div>
              </div>
              <button 
                onClick={() => setSelectedTxn(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              selectedTxn.riskLevel === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              selectedTxn.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
              'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              <div>
                <div className="text-xs font-semibold">Calculated Threat Score</div>
                <div className="text-2xl font-bold">{selectedTxn.riskScore}/100</div>
              </div>
              <span className="text-sm font-bold uppercase">{selectedTxn.riskLevel}</span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#090D16] p-4 rounded-xl border border-[#1E293B]">
              <div><span className="text-slate-400">Amount:</span> <span className="font-bold text-white">${selectedTxn.amount.toFixed(2)}</span></div>
              <div><span className="text-slate-400">Status:</span> <span className="font-semibold text-white">{selectedTxn.status}</span></div>
              <div><span className="text-slate-400">Sender:</span> <span className="text-slate-200">{selectedTxn.senderName}</span></div>
              <div><span className="text-slate-400">Recipient:</span> <span className="text-slate-200">{selectedTxn.recipientName}</span></div>
              <div className="col-span-2"><span className="text-slate-400">Origin IP:</span> <span className="font-mono text-cyan-400">{selectedTxn.ipAddress}</span></div>
              <div className="col-span-2"><span className="text-slate-400">Device Hash:</span> <span className="font-mono text-slate-300">{selectedTxn.deviceFingerprint}</span></div>
            </div>

            {/* Fraud Signals */}
            {selectedTxn.fraudSignals.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1.5">
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Identified Threat Anomalies
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  {selectedTxn.fraudSignals.map((sig, idx) => (
                    <li key={idx}>{sig}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  approveTransaction(selectedTxn.id);
                  setSelectedTxn(null);
                }}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
              >
                Approve Payment
              </button>
              <button
                onClick={() => {
                  blockTransaction(selectedTxn.id);
                  setSelectedTxn(null);
                }}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Block & Quarantine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
