# PAYPAL AI GUARDIAN
**Intelligent Payment Protection — Independent Fintech Cybersecurity Prototype**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Fintech%20Dark-cyan.svg)](https://tailwindcss.com/)

---

## 1. Project Overview

**PayPal AI Guardian** is an enterprise-grade fintech cybersecurity platform engineered to protect online merchants and payment gateways against modern payment fraud vectors.

### Key Capabilities
- **Real-Time Threat Heuristics**: Autonomous rules engine monitoring Tor exit relays, impossible geo-velocity travel (>900 km/h), headless browser bots, and card testing velocity.
- **PayPal Developer Sandbox Integration**: Server-side order creation (`/api/paypal/create-order`) and server-side capture verification (`/api/paypal/capture-order`) following zero-trust fintech standards.
- **OCR & Forensic Proof Verification**: Analyzes uploaded payment receipts, PDF invoices, and wire confirmation screenshots for font kerning discrepancies, JPEG quantization compression artifacts, and digital ledger seals.
- **Phishing & Homograph URL Scanner**: Deconstructs checkout redirect links for deceptive Cyrillic glyph substitutions (e.g., `paypaI`), SSL cipher validity, and domain registration age.
- **AI Security Analyst (Gemini)**: Provides structured threat intelligence incident reports, risk explanations, and containment steps.
- **Progressive Web App (PWA)**: Installable on desktop and mobile devices with offline fallback.

> **Disclaimer**: *PayPal AI Guardian is an independent cybersecurity prototype built for payment fraud mitigation research. It is not an official PayPal product and is not officially affiliated with PayPal Inc. All transactions and entities in this demonstration are simulated for testing and evaluation purposes.*

---

## 2. Technology Stack

- **Frontend & App Shell**: Next.js 14 (App Router), React 18, TypeScript (Strict Mode).
- **Styling & Design System**: Tailwind CSS with custom fintech tokens (`#090D16` charcoal, `#0F172A` navy, `#10B981` emerald security green).
- **Visualizations**: Recharts (interactive 7-day volume vs. threat trend area chart, risk severity donut chart).
- **Backend & APIs**: Next.js Server Route Handlers (Node.js 22 runtime).
- **AI Threat Intelligence**: Google Gemini API via secure server proxy (`/api/ai/chat`).
- **Payment Gateway**: PayPal Developer Sandbox REST API v2.
- **PWA**: Web App Manifest (`manifest.json`), service worker compatibility, and SVG vector branding.

---

## 3. Application Structure

```
├── app/
│   ├── api/
│   │   ├── ai/chat/route.ts            # Server-side Gemini threat intelligence API
│   │   ├── paypal/create-order/route.ts # Server-side PayPal sandbox order creation
│   │   ├── paypal/capture-order/route.ts# Server-side order capture & risk scoring
│   │   ├── proof/analyze/route.ts      # Forensic receipt & kerning analyzer
│   │   └── scan/url/route.ts           # Phishing & homograph link detector
│   ├── dashboard/page.tsx              # Overview SOC dashboard & KPI charts
│   ├── transactions/page.tsx           # Searchable transaction registry & forensics
│   ├── fraud-detection/page.tsx        # Heuristic rules & attack simulation probe
│   ├── payment-proof/page.tsx          # OCR font kerning & tamper forensics
│   ├── url-scanner/page.tsx            # Phishing link & homograph scanner
│   ├── assistant/page.tsx              # AI threat intelligence analyst chat
│   ├── alerts/page.tsx                 # Real-time security incident alert feed
│   ├── checkout/page.tsx               # PayPal Developer Sandbox checkout test bench
│   ├── settings/page.tsx               # API credentials & sensitivity preferences
│   ├── globals.css                     # Tailwind CSS & custom scrollbar styles
│   ├── layout.tsx                      # App shell with responsive sidebar & header
│   └── page.tsx                        # Root redirect to /dashboard
├── lib/
│   ├── mock-data.ts                    # Realistic fintech demo transactions & alerts
│   └── store.tsx                       # Reactive client state management
├── types/
│   └── index.ts                        # TypeScript domain interfaces
├── public/
│   ├── manifest.json                   # Progressive Web App manifest
│   └── icon.svg                        # Vector cybersecurity shield logo
└── README.md
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (Node.js 22 recommended)
- npm 9+

### Installation
```bash
git clone https://github.com/your-username/paypal-ai-guardian.git
cd paypal-ai-guardian
npm install
```

### Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
# Google Gemini API Key for Threat Intelligence Analyst
GEMINI_API_KEY=your_gemini_api_key_here

# PayPal Developer Sandbox Credentials (Optional - Default simulates sandbox)
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Hackathon Judge Testing Guide

Judges can evaluate every feature using the following test journeys:

1. **Test PayPal Sandbox Checkout (`/checkout`)**:
   - Choose a test scenario: Standard ($45.00) or High-Value Anomaly ($3,890.00).
   - Click **Execute PayPal Sandbox Order**.
   - Notice the order creation and server-side capture verification receipt.
   - Return to the **Overview Dashboard (`/dashboard`)** to see the transaction instantly added to the live KPIs and chart.

2. **Test Heuristic Rules & Attack Probe (`/fraud-detection`)**:
   - Adjust the **Autonomous Interception Threshold** slider.
   - Toggle specific heuristic rules on/off (e.g. *Tor Exit Node Blocker*).
   - Click **Fire Adversarial Attack Probe** to trigger an automated botnet probe and verify that the transaction is immediately intercepted and quarantined.

3. **Test Payment Proof Forensics (`/payment-proof`)**:
   - Select the **Forged Wire Confirmation Screenshot** test sample.
   - Inspect the detected anomalies (font kerning discrepancy, JPEG quantization tampering).
   - Input custom parameters in the simulation form to test custom amounts.

4. **Test Phishing & Homograph URL Scanner (`/url-scanner`)**:
   - Click the preset test chip **Homograph Attack** (`https://paypaI-resolution-center.support-desk.xyz/verify`).
   - Notice the system flags the deceptive Cyrillic 'I' glyph substitution spoofing the PayPal brand.

5. **Test AI Threat Intelligence Assistant (`/assistant`)**:
   - Click any quick prompt chip (e.g. *"Analyze transaction TXN-8921-X9"*).
   - Receive detailed incident vectors, threat scores, and recommended containment steps.

---

## 6. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
