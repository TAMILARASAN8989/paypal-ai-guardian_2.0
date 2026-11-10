'use client';

import React, { useState } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  X, 
  Check, 
  Ban,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { Transaction, RiskLevel, TransactionStatus } from '@/types';

export default function TransactionsPage() {
  const { transactions, approveTransaction, blockTransaction } = useGuardian();
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'ALL'>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filtered = transactions.filter((txn) => {
    const matchesSearch =
      search === '' ||
      txn.reference.toLowerCase().includes(search.toLowerCase()) ||
      txn.senderName.toLowerCase().includes(search.toLowerCase()) ||
      txn.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      txn.amount.toString().includes(search) ||
      txn.ipAddress.toLowerCase().includes(search.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || txn.riskLevel === selectedRisk;
    const matchesStatus = selectedStatus === 'ALL' || txn.status === selectedStatus;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Transaction Registry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Auditable ledger of screened payment authorizations, origin metadata, and risk ratings.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-semibold bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 rounded-lg">
          Showing <span className="text-emerald-400 font-bold">{filtered.length}</span> of {transactions.length} records
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions by reference (e.g. TXN-8921), sender, recipient, amount, or IP..."
            className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg pl-9 pr-10 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Risk Level:
          </span>
          {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedRisk(lvl)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                selectedRisk === lvl
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-[#090D16] text-slate-400 border border-[#1E293B] hover:text-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'All Risks' : lvl}
            </button>
          ))}

          <span className="text-slate-600 px-1">|</span>

          <span className="text-slate-400 text-[11px] font-semibold">Status:</span>
          {(['ALL', 'VERIFIED', 'PENDING', 'FLAGGED', 'BLOCKED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-[#090D16] text-slate-400 border border-[#1E293B] hover:text-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1E293B] mx-auto flex items-center justify-center text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No Matching Transactions Found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try clearing your search query or broadening the risk level and status filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedRisk('ALL');
              setSelectedStatus('ALL');
            }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] bg-[#111928] text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Sender & Recipient</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk Rating</th>
                  <th className="py-3 px-4">Origin IP & Location</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60 text-slate-200">
                {filtered.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{txn.reference}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{txn.senderName}</div>
                      <div className="text-[11px] text-slate-400">→ {txn.recipientName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${txn.amount.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">{txn.currency}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        txn.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                        txn.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                        txn.status === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-rose-950/60 text-rose-300 border border-rose-800'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        txn.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400' :
                        txn.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {txn.riskLevel} ({txn.riskScore}/100)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-300">{txn.ipAddress}</div>
                      <div className="text-[10px] text-slate-500">{txn.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{txn.timestamp}</td>
                    <td className="py-3.5 px-4 text-right">
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
      )}

      {/* Forensic Inspection Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Forensics Inspection</div>
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
                <div className="text-xs font-semibold">Risk Threat Index</div>
                <div className="text-2xl font-bold">{selectedTxn.riskScore}/100</div>
              </div>
              <span className="text-sm font-bold uppercase">{selectedTxn.riskLevel}</span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#090D16] p-4 rounded-xl border border-[#1E293B]">
              <div><span className="text-slate-400">Amount:</span> <span className="font-bold text-white">${selectedTxn.amount.toFixed(2)}</span></div>
              <div><span className="text-slate-400">Payment Method:</span> <span className="text-slate-200">{selectedTxn.paymentMethod}</span></div>
              <div><span className="text-slate-400">Sender:</span> <span className="text-slate-200">{selectedTxn.senderName} ({selectedTxn.senderEmail})</span></div>
              <div><span className="text-slate-400">Recipient:</span> <span className="text-slate-200">{selectedTxn.recipientName} ({selectedTxn.recipientEmail})</span></div>
              <div className="col-span-2"><span className="text-slate-400">Origin IP:</span> <span className="font-mono text-cyan-400">{selectedTxn.ipAddress}</span></div>
              <div className="col-span-2"><span className="text-slate-400">Device Fingerprint:</span> <span className="font-mono text-slate-300">{selectedTxn.deviceFingerprint}</span></div>
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
