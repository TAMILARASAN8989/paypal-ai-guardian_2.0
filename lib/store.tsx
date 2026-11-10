'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  SecurityAlert, 
  FraudRule, 
  PaymentProofAnalysis, 
  UrlScanResult, 
  ChatMessage,
  KpiSummary,
  RiskLevel
} from '@/types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_ALERTS, 
  INITIAL_RULES, 
  INITIAL_PROOFS, 
  INITIAL_URLS, 
  INITIAL_MESSAGES 
} from '@/lib/mock-data';

interface GuardianContextType {
  transactions: Transaction[];
  alerts: SecurityAlert[];
  rules: FraudRule[];
  proofs: PaymentProofAnalysis[];
  urls: UrlScanResult[];
  messages: ChatMessage[];
  fraudThreshold: number;
  isSandboxActive: boolean;
  autoBlockEnabled: boolean;
  paypalClientId: string;
  paypalSecret: string;
  notification: string | null;
  kpis: KpiSummary;
  setFraudThreshold: (val: number) => void;
  toggleSandbox: (val: boolean) => void;
  toggleAutoBlock: (val: boolean) => void;
  setPaypalCredentials: (clientId: string, secret: string) => void;
  addTransaction: (txn: Transaction) => void;
  approveTransaction: (id: string) => void;
  blockTransaction: (id: string) => void;
  toggleRule: (id: string) => void;
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  addUrlScan: (scan: UrlScanResult) => void;
  addProof: (proof: PaymentProofAnalysis) => void;
  addMessage: (msg: ChatMessage) => void;
  simulateAttack: () => void;
  resetDemoData: () => void;
  showNotification: (msg: string) => void;
  clearNotification: () => void;
}

const GuardianContext = createContext<GuardianContextType | null>(null);

export function GuardianProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [rules, setRules] = useState<FraudRule[]>(INITIAL_RULES);
  const [proofs, setProofs] = useState<PaymentProofAnalysis[]>(INITIAL_PROOFS);
  const [urls, setUrls] = useState<UrlScanResult[]>(INITIAL_URLS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [fraudThreshold, setFraudThreshold] = useState<number>(65);
  const [isSandboxActive, setIsSandboxActive] = useState<boolean>(true);
  const [autoBlockEnabled, setAutoBlockEnabled] = useState<boolean>(true);
  const [paypalClientId, setPaypalClientId] = useState<string>('sb-mock-client-id-49210');
  const [paypalSecret, setPaypalSecret] = useState<string>('sb-mock-secret-x9102');
  const [notification, setNotification] = useState<string | null>(null);

  // Compute live KPIs
  const kpis: KpiSummary = {
    totalTransactions: transactions.length,
    verifiedPayments: transactions.filter(t => t.status === 'VERIFIED').length,
    suspiciousCount: transactions.filter(t => t.status === 'FLAGGED' || t.riskLevel === 'HIGH').length,
    reviewRequiredCount: transactions.filter(t => t.status === 'PENDING').length,
    totalVolumeUsd: transactions.reduce((acc, t) => acc + t.amount, 0),
    preventedFraudUsd: transactions.filter(t => t.status === 'BLOCKED').reduce((acc, t) => acc + t.amount, 0),
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  const addTransaction = (txn: Transaction) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  const approveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'VERIFIED', riskLevel: 'LOW', riskScore: 10 } : t))
    );
    showNotification(`Transaction ${id} approved & marked verified`);
  };

  const blockTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'BLOCKED', riskLevel: 'CRITICAL', riskScore: 99 } : t))
    );
    showNotification(`Transaction ${id} blocked & payment intercepted`);
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
    showNotification('Detection rule configuration updated');
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a))
    );
    showNotification('Threat alert mitigated');
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showNotification('Threat alert dismissed');
  };

  const addUrlScan = (scan: UrlScanResult) => {
    setUrls((prev) => [scan, ...prev]);
  };

  const addProof = (proof: PaymentProofAnalysis) => {
    setProofs((prev) => [proof, ...prev]);
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const simulateAttack = () => {
    const simTxn: Transaction = {
      id: `txn-sim-${Date.now()}`,
      reference: `TXN-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: 4999.00,
      currency: 'USD',
      senderName: 'Adversary Bot Probe',
      senderEmail: 'botnet@adversary-proxy.org',
      recipientName: 'Sandbox Target Merchant',
      recipientEmail: 'merchant@sandbox.internal',
      timestamp: 'Just now',
      status: 'BLOCKED',
      riskLevel: 'CRITICAL',
      riskScore: 99,
      paymentMethod: 'Compromised Card •••• 9102',
      ipAddress: '195.123.210.8 (Bulletproof Proxy)',
      location: 'Bucharest, RO',
      deviceFingerprint: 'dev_fp_synthetic_emulator',
      fraudSignals: [
        'SIMULATED ATTACK: Automated credential spray cluster',
        'Known adversary proxy IP subnet',
        'Automated rule "Tor & Anonymizing Proxy Blocker" triggered'
      ],
      isSandbox: true,
    };

    const simAlert: SecurityAlert = {
      id: `alt-sim-${Date.now()}`,
      title: 'SIMULATED: Automated Botnet Spray Intercepted',
      description: `Simulated adversarial transaction (${simTxn.reference}) was intercepted by AI Guardian rules.`,
      severity: 'CRITICAL',
      timestamp: 'Just now',
      affectedRef: simTxn.reference,
      category: 'Simulated Attack',
      isResolved: false,
    };

    setTransactions((prev) => [simTxn, ...prev]);
    setAlerts((prev) => [simAlert, ...prev]);
    showNotification('Simulated adversarial attack probe intercepted by rules engine');
  };

  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setAlerts(INITIAL_ALERTS);
    setRules(INITIAL_RULES);
    setProofs(INITIAL_PROOFS);
    setUrls(INITIAL_URLS);
    setMessages(INITIAL_MESSAGES);
    setFraudThreshold(65);
    setIsSandboxActive(true);
    setAutoBlockEnabled(true);
    showNotification('Demo sandbox environment reset to baseline');
  };

  const setPaypalCredentials = (clientId: string, secret: string) => {
    setPaypalClientId(clientId);
    setPaypalSecret(secret);
    showNotification('PayPal Developer Sandbox API credentials saved');
  };

  return (
    <GuardianContext.Provider
      value={{
        transactions,
        alerts,
        rules,
        proofs,
        urls,
        messages,
        fraudThreshold,
        isSandboxActive,
        autoBlockEnabled,
        paypalClientId,
        paypalSecret,
        notification,
        kpis,
        setFraudThreshold,
        toggleSandbox: setIsSandboxActive,
        toggleAutoBlock: setAutoBlockEnabled,
        setPaypalCredentials,
        addTransaction,
        approveTransaction,
        blockTransaction,
        toggleRule,
        resolveAlert,
        dismissAlert,
        addUrlScan,
        addProof,
        addMessage,
        simulateAttack,
        resetDemoData,
        showNotification,
        clearNotification,
      }}
    >
      {children}
    </GuardianContext.Provider>
  );
}

export function useGuardian() {
  const context = useContext(GuardianContext);
  if (!context) {
    throw new Error('useGuardian must be used within a GuardianProvider');
  }
  return context;
}
