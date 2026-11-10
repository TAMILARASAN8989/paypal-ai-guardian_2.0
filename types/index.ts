export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TransactionStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'BLOCKED';

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  timestamp: string;
  status: TransactionStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  paymentMethod: string;
  ipAddress: string;
  location: string;
  deviceFingerprint: string;
  fraudSignals: string[];
  isSandbox: boolean;
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  timestamp: string;
  affectedRef: string;
  category: string;
  isResolved: boolean;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  category: string;
  riskWeight: number;
  isEnabled: boolean;
  triggerCount: number;
  lastTriggered: string;
}

export interface PaymentProofAnalysis {
  id: string;
  sampleName: string;
  documentType: string;
  reportedAmount: string;
  reportedTimestamp: string;
  fontKerningScore: number;
  recipientMatch: boolean;
  tamperScore: number;
  verdict: 'AUTHENTIC' | 'MANIPULATED' | 'SUSPICIOUS';
  detectedAnomalies: string[];
  digitalSignatureValid: boolean;
}

export interface UrlScanResult {
  id: string;
  targetUrl: string;
  domain: string;
  ipAddress: string;
  sslValid: boolean;
  sslIssuer: string;
  domainAgeDays: number;
  homographAttackDetected: boolean;
  typosquattingTarget: string | null;
  reputationScore: number;
  classification: string;
  threatDetails: string[];
  scanTimestamp: string;
}

export interface KpiSummary {
  totalTransactions: number;
  verifiedPayments: number;
  suspiciousCount: number;
  reviewRequiredCount: number;
  totalVolumeUsd: number;
  preventedFraudUsd: number;
}

export interface ChatMessage {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: string;
  referenceId?: string;
}
