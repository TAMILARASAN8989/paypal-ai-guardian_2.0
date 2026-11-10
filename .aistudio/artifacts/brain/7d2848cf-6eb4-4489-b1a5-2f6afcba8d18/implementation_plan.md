# PayPal AI Guardian — Full-Stack Web Application Migration

Intelligent Payment Protection: A cybersecurity and fraud mitigation platform converted from the Android prototype into an enterprise-grade, responsive full-stack Next.js 14 web application with PayPal Sandbox, Google Gemini AI, and PWA capabilities.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during Phase 1 clarification:
> - **Framework**: Next.js 14 with App Router, TypeScript (strict mode), and Route Handlers (`app/api/*`).
> - **PayPal Integration**: Dual-mode system supporting instant mock sandbox transactions out of the box, with live API credential injection (`PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`) via the Settings panel and server-side token exchange.
> - **Deployment & Delivery**: Complete responsive web application with HTTPS preview, manifest/service worker for Progressive Web App (PWA) installation, and clean project export for GitHub/ZIP distribution.

---

## 1. Overview & Core Concept

**PayPal AI Guardian** is an independent fintech cybersecurity prototype engineered for online merchants, payment compliance officers, and fraud analysts. It monitors incoming payment streams, intercepts suspicious velocity spikes, evaluates fake payment proofs with forensic image analysis, scans checkout redirect URLs for homograph phishing glyphs, and queries Google Gemini for real-time threat intelligence.

### Target Personas
1. **E-Commerce Merchants & Developers**: Testing checkout integration safely against sandbox endpoints while screening for fraudulent transactions and payment tampering.
2. **Security & Compliance Analysts**: Auditing chargeback risks, investigating anonymizer IPs/Tor exit nodes, and reviewing flagged transactions.
3. **Hackathon Judges & Evaluators**: Reviewing full end-to-end payment creation, server-side capture verification, and advisory AI risk reporting.

### Core Value
Automating payment defense through multi-signal heuristics and generative AI explanations before transactions settle or digital goods are dispatched.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Security Operations Center (`/dashboard`)**:
   - High-level KPIs: Total Transactions, Verified Sandbox Payments, Suspicious Threats, and Requires Review.
   - Interactive charts: 7-day transaction activity vs. threat events (Recharts area graph) and risk distribution donut chart.
   - Recent monitored transactions table with instant drill-down inspection.
2. **Transaction Registry (`/transactions`)**:
   - Searchable, filterable audit log (by Risk Level: Low, Medium, High, Critical; and Status: Verified, Pending, Flagged, Blocked).
   - Forensic detail drawer displaying origin IP, geo-location, device fingerprint, and manual disposition actions (Approve / Block).
3. **PayPal Sandbox Checkout (`/checkout`)**:
   - Embedded PayPal Smart Buttons powered by `@paypal/react-paypal-js` and backend verification.
   - Server-side order creation (`/api/paypal/create-order`) and server-side capture (`/api/paypal/capture-order`).
4. **AI Fraud Detection Engine (`/fraud-detection`)**:
   - Active heuristic rules (Tor Exit Blocker, Geo-Velocity Impossible Travel, Bot & Headless Browser Detection, Card Testing Velocity Guard).
   - Sensitivity slider and "Simulate Adversarial Attack" probe to test instant rule firing.
5. **Payment Proof Forensic Analysis (`/payment-proof`)**:
   - Upload receipt screenshots or select samples (Authentic Sandbox Receipt, Forged Wire Screenshot, Altered PDF).
   - Forensic checks: Font kerning consistency, Error Level Analysis (ELA) tamper score, recipient match, and ledger signature verification.
6. **URL & Phishing Scanner (`/url-scanner`)**:
   - Real-time domain verification checking for Cyrillic homograph glyph substitutions (e.g., `paypaI`), domain age, SSL cipher suites, and reputation scores.
7. **AI Security Assistant (`/assistant`)**:
   - Conversational security analyst powered by Gemini API with structured prompts for threat incident reports, phishing deconstructions, and rule optimization.
8. **Security Alerts (`/alerts`) & Settings (`/settings`)**:
   - Filterable threat alert feed with "Mitigate" and "Dismiss" controls.
   - Environment toggles (Sandbox Mode, Autonomous Blocking), sensitivity thresholds, API key management, and baseline demo reset.

### Visual Identity & Theme
- **Background**: Deep dark charcoal (`#090D16`) and slate navy (`#0F172A`).
- **Surfaces & Cards**: Elevated dark navy (`#111928` / `#1E293B`) with 1px subtle borders (`#26354D`).
- **Accents**:
  - *Primary Security Green*: Emerald (`#10B981`) and dark container (`#064E3B`).
  - *Cyber Telemetry*: Cyan (`#06B6D4`).
  - *Warning / Review*: Amber (`#F59E0B`).
  - *Threat / Blocked*: Rose / Red (`#F43F5E`).
- **Typography**: Inter / system monospace for references, IP addresses, and hash fingerprints.
- **PWA Experience**: Web manifest (`manifest.json`), service worker registration, responsive navigation drawer for mobile and fixed sidebar for desktop.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Mode PayPal Sandbox (Simulation + Live API)**
  - *Chosen Approach*: Ship with a realistic mock sandbox engine so all checkout and capture flows work immediately without requiring API keys, while allowing users to enter real PayPal Sandbox Client ID/Secret in Settings to test against PayPal's live `api-m.sandbox.paypal.com`.
  - *Why*: Eliminates setup friction for evaluators while maintaining full production readiness.

- **Decision 2: Server-Side Gemini API Proxy (`/api/ai/analyze` & `/api/ai/chat`)**
  - *Chosen Approach*: Route all Gemini requests through Next.js server Route Handlers using environment variables.
  - *Why*: Strict security: API keys are never leaked to client bundles. Formatted responses clearly identify AI risk scores as advisory.

- **Decision 3: Firebase Firestore with In-Memory / Local Storage Fallback**
  - *Chosen Approach*: Configure Firebase Web SDK for transaction persistence with automatic local fallback if Firebase configuration is unprovisioned.
  - *Why*: Guarantees zero runtime crashes while supporting cloud synchronization when configured.

- **Decision 4: Mobile & Desktop PWA Support**
  - *Chosen Approach*: Standalone manifest with app icons, theme color meta tags, and an offline status indicator without caching sensitive payment tokens.
  - *Why*: Allows judges and mobile users to install the dashboard directly to their home screens as a native-feeling app.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PAYPAL AI GUARDIAN (WEB PWA)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CLIENT LAYER (Next.js 14 App Router + Tailwind CSS + Lucide + Recharts)    │
│  ┌────────────┬─────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ /dashboard │ /transact.. │ /fraud-det.. │ /payment-..  │ /url-scanner │  │
│  ├────────────┴─────────────┴──────────────┴──────────────┴──────────────┤  │
│  │ /assistant (Gemini)      │ /alerts      │ /settings    │ /checkout    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │ (Fetch / REST)                       │
│                                      ▼                                      │
│  SERVER LAYER (Next.js API Route Handlers / Node.js 22)                     │
│  ┌───────────────────────┬──────────────────────┬────────────────────────┐  │
│  │ /api/paypal/create-.. │ /api/paypal/capture  │ /api/ai/chat (Gemini)  │  │
│  ├───────────────────────┼──────────────────────┼────────────────────────┤  │
│  │ /api/scan/url         │ /api/proof/analyze   │ /api/transactions      │  │
│  └───────────────────────┴──────────────────────┴────────────────────────┘  │
│             │                         │                         │           │
│             ▼                         ▼                         ▼           │
│  EXTERNAL SERVICES & STORAGE                                                │
│  ┌─────────────────────┐   ┌─────────────────────┐   ┌───────────────────┐  │
│  │ PayPal Sandbox API  │   │ Google Gemini API   │   │ Firebase Firestore│  │
│  │ (OAuth & Orders v2) │   │ (Threat Intel Expl) │   │ (Audits & Alerts) │  │
│  └─────────────────────┘   └─────────────────────┘   └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State Stores
1. **Transaction**: `reference`, `amount`, `currency`, `sender`, `recipient`, `timestamp`, `status`, `riskLevel`, `riskScore`, `paymentMethod`, `ipAddress`, `location`, `fraudSignals`.
2. **SecurityAlert**: `id`, `title`, `description`, `severity`, `timestamp`, `affectedRef`, `category`, `isResolved`.
3. **FraudRule**: `id`, `name`, `description`, `category`, `riskWeight`, `isEnabled`, `triggerCount`.
4. **UrlScanResult**: `targetUrl`, `domain`, `ipAddress`, `sslValid`, `domainAgeDays`, `homographAttackDetected`, `reputationScore`, `threatDetails`.
5. **PaymentProofAnalysis**: `sampleName`, `documentType`, `reportedAmount`, `fontKerningScore`, `tamperScore`, `verdict`, `detectedAnomalies`, `digitalSignatureValid`.

### Implementation Sequence
1. **Step 1: Web Foundation**: Create `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, and PWA `manifest.json`.
2. **Step 2: Shared Types & Mock Data**: Port domain models and demo databases from the Android repository into clean TypeScript definitions.
3. **Step 3: Backend API Routes**: Build PayPal order/capture endpoints, Gemini AI proxy, URL scanner engine, and proof forensic analyzer.
4. **Step 4: Layout & UI Components**: Build sidebar, header, KPI cards, charts, risk badges, and detail modals.
5. **Step 5: All 8 Working Routes**: Implement Dashboard, Transactions, Fraud Detection, Payment Proof, URL Scanner, AI Assistant, Alerts, Settings, and Sandbox Checkout.
6. **Step 6: Documentation & Export**: Generate `README.md`, `.env.example`, hackathon testing instructions, and verify the production build.
