'use client';

import React, { useState } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  FileSearch, 
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { PaymentProofAnalysis } from '@/types';

export default function PaymentProofPage() {
  const { proofs, addProof, showNotification } = useGuardian();
  const [activeProof, setActiveProof] = useState<PaymentProofAnalysis>(proofs[0]);
  const [docName, setDocName] = useState('');
  const [docAmount, setDocAmount] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleCustomAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const res = await fetch('/api/proof/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: docName.trim() || 'Custom Uploaded Receipt Sample',
          reportedAmount: docAmount.trim() || '$1,250.00 USD',
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        addProof(data.analysis);
        setActiveProof(data.analysis);
        setDocName('');
        setDocAmount('');
        showNotification(`Forensic inspection complete: Verdict ${data.analysis.verdict}`);
      }
    } catch (err) {
      showNotification('Forensic analysis failed to execute');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">OCR & Payment Proof Forensics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect payment receipts, invoice screenshots, and wire confirmations for font rasterization anomalies, JPEG quantization tampering, and cryptographic seals.
        </p>
      </div>

      {/* Hero: Active Forensic Analysis Report */}
      {activeProof && (
        <div className={`p-6 rounded-2xl border bg-[#0F172A] shadow-xl space-y-6 transition-all ${
          activeProof.verdict === 'AUTHENTIC' ? 'border-emerald-500/40' :
          activeProof.verdict === 'MANIPULATED' ? 'border-rose-500/50' :
          'border-amber-500/40'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Forensic Audit Target</div>
              <div className="text-lg font-bold text-white mt-0.5">{activeProof.sampleName}</div>
              <div className="text-xs text-slate-400">{activeProof.documentType} • Amount: <strong className="text-white">{activeProof.reportedAmount}</strong></div>
            </div>

            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 self-start sm:self-auto ${
              activeProof.verdict === 'AUTHENTIC' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
              activeProof.verdict === 'MANIPULATED' ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' :
              'bg-amber-500/10 border-amber-500/40 text-amber-400'
            }`}>
              {activeProof.verdict === 'AUTHENTIC' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider">Forensic Verdict</div>
                <div className="text-sm font-bold">{activeProof.verdict}</div>
              </div>
            </div>
          </div>

          {/* Metric Gauges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#090D16] border border-[#1E293B] rounded-xl p-4 text-center space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Font Kerning Score</div>
              <div className={`text-2xl font-bold font-mono ${activeProof.fontKerningScore > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeProof.fontKerningScore}%
              </div>
              <div className="text-[10px] text-slate-500">
                {activeProof.fontKerningScore > 80 ? 'Natural geometric spacing' : 'Irregular digit editing'}
              </div>
            </div>

            <div className="bg-[#090D16] border border-[#1E293B] rounded-xl p-4 text-center space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Tamper Noise Level</div>
              <div className={`text-2xl font-bold font-mono ${activeProof.tamperScore < 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeProof.tamperScore}/100
              </div>
              <div className="text-[10px] text-slate-500">
                {activeProof.tamperScore < 30 ? 'Pristine quantization' : 'JPEG splicing detected'}
              </div>
            </div>

            <div className="bg-[#090D16] border border-[#1E293B] rounded-xl p-4 text-center space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Ledger Cryptographic Seal</div>
              <div className={`text-2xl font-bold font-mono ${activeProof.digitalSignatureValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeProof.digitalSignatureValid ? 'VERIFIED' : 'INVALID'}
              </div>
              <div className="text-[10px] text-slate-500">
                {activeProof.digitalSignatureValid ? 'Matched sandbox transaction' : 'Unrecognized reference'}
              </div>
            </div>
          </div>

          {/* Detected Anomalies */}
          <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileSearch className="w-4 h-4" />
              Forensic Analysis Findings
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activeProof.detectedAnomalies.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeProof.verdict === 'AUTHENTIC' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Simulator / Custom Analysis Form */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>Simulate Receipt & Document Forensic Analysis</span>
        </div>
        <p className="text-xs text-slate-400">
          Enter custom receipt details or amount to trigger server-side OCR font alignment and compression tamper evaluation.
        </p>

        <form onSubmit={handleCustomAnalyze} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Receipt / Invoice Title</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Wire Confirmation #8821 or Forged Receipt"
              className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Claimed Settlement Amount</label>
            <input
              type="text"
              value={docAmount}
              onChange={(e) => setDocAmount(e.target.value)}
              placeholder="e.g. $450.00 USD (or $12,500 for forgery test)"
              className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Executing Image Forensics...' : 'Run Forensic Verification Engine'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preset Test Proof Samples */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Test Proof Samples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proofs.map((proof) => {
            const isSelected = activeProof?.id === proof.id;
            return (
              <div
                key={proof.id}
                onClick={() => setActiveProof(proof)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#1E293B] border-emerald-500 shadow-md' 
                    : 'bg-[#0F172A] border-[#1E293B] hover:border-[#2E3A52]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    proof.verdict === 'AUTHENTIC' ? 'bg-emerald-500/10 text-emerald-400' :
                    proof.verdict === 'MANIPULATED' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {proof.verdict}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Score: {proof.tamperScore}/100</span>
                </div>
                <div className="text-sm font-bold text-white mb-1">{proof.sampleName}</div>
                <div className="text-xs text-slate-400 mb-2">{proof.documentType}</div>
                <div className="text-xs font-bold text-cyan-400">Amount: {proof.reportedAmount}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
