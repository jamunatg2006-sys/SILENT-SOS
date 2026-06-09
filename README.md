<div align="center">

<img src="https://img.shields.io/badge/SilentSOS-Emergency%20Platform-0ea5e9?style=for-the-badge&logo=shield&logoColor=white" />

# 🛡️ SilentSOS

### *One scan. One voice. One life saved.*

**A real-time emergency communication platform for non-verbal, autistic, and communication-impaired individuals.**  
Built for the moment when someone cannot speak — but still needs to be heard.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-silent--sos--rust.vercel.app-0ea5e9?style=for-the-badge)](https://silent-sos-rust.vercel.app)
[![Backend Health](https://img.shields.io/badge/⚡_API_Health-online-22c55e?style=for-the-badge)](https://silent-sos-9h05.onrender.com/api/health)
[![Frontend](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://silent-sos-rust.vercel.app)
[![Backend](https://img.shields.io/badge/Backend_on-Render-46e3b7?style=for-the-badge&logo=render)](https://render.com)

<br/>

---

</div>

## 📌 The Problem We're Solving

In an emergency, the first 3 minutes are critical.

But millions of people **cannot speak** when it matters most:

| Who | The Crisis Moment |
|---|---|
| 🧩 Autistic individual | Sensory overload → complete shutdown. Cannot explain triggers. |
| 🧠 Stroke survivor | Conscious, but aphasia blocks speech. Paramedic has no history. |
| 🦷 Cerebral palsy | Speech impairment is permanent. Strangers can't understand. |
| 👴 Dementia patient | Gets lost. Cannot remember name, address, or family number. |
| 🧒 Non-verbal child | Separated in a crowd. Cannot ask for help. |

**Current solutions fail them:**
- Medical alert bracelets show 1–2 words. No instructions, no contacts, no context.
- ICE contacts require unlocking the phone. Most people don't know how.
- Emergency responders are trained for verbal patients. Silence = confusion = danger.

**SilentSOS bridges the gap** — a single QR scan gives any stranger everything they need to help safely.

---

## 🎯 Our Solution at a Glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   CAREGIVER sets up profile once                                    │
│       ↓                                                             │
│   SYSTEM generates unique QR card (wristband / ID / phone)         │
│       ↓                                                             │
│   EMERGENCY happens — stranger scans QR with any phone             │
│       ↓                                                             │
│   INSTANT: Medical profile + contacts + calm instructions           │
│       ↓                                                             │
│   PARALLEL: GPS captured → WhatsApp alert → caregiver notified     │
│       ↓                                                             │
│   PATIENT uses Symbol Communicator to express needs via voice       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

No app download. No login. No friction. **Just scan and help.**

---

## 🖼️ Product Screenshots

> **Emergency Responder View** — What a stranger sees after scanning the QR code

```
╔══════════════════════════════════════════╗
║  🛡️ SilentSOS          🌐 हिन्दी ▾       ║
║──────────────────────────────────────────║
║                                          ║
║   👤  Arjun Rao  •  Age 28  •  B+       ║
║                                          ║
║  ⚠️  ALLERGIES                           ║
║  ┌────────────────────────────────────┐  ║
║  │ 🔴 Valium — triggers seizure        │  ║
║  │ 🟡 Penicillin — moderate reaction   │  ║
║  └────────────────────────────────────┘  ║
║                                          ║
║  🧩 Autism Spectrum  •  Epilepsy         ║
║                                          ║
║  ✅ DO:  Speak slowly. Use gestures.    ║
║  ❌ AVOID: Loud noise. Sudden touch.    ║
║                                          ║
║  📞 CALL: Meera Rao  +91 98765 43210   ║
║  💬 WhatsApp SOS → Sent ✓               ║
║                                          ║
║  [😣 Pain] [💧 Water] [😨 Scared] [🆘] ║
╚══════════════════════════════════════════╝
```

> **Caregiver Dashboard** — Live incident feed with GPS and status sync

```
╔══════════════════════════════════════════════════════════════════╗
║  🛡️ SilentSOS Dashboard         ● Live    👤 Riya K             ║
║──────────────────────────────────────────────────────────────────║
║                                                                  ║
║  📊 47 scans    🚨 2 active    👥 3 profiles    ⏱ 1m 12s avg   ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  🟢 Arjun Rao  ·  MG Road, Bengaluru  ·  2 min ago      │   ║
║  │     Conscious & Responsive  ·  Hindi  ·  [Open]         │   ║
║  ├──────────────────────────────────────────────────────────┤   ║
║  │  🟡 Sneha Mehta  ·  Koramangala  ·  18 min ago          │   ║
║  │     Unresponsive  ·  Kannada  ·  [Open]                 │   ║
║  ├──────────────────────────────────────────────────────────┤   ║
║  │  ⚫ Priya Kumar  ·  Indiranagar  ·  Yesterday            │   ║
║  │     Transported  ·  Tamil  ·  [Resolved ✓]              │   ║
║  └──────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SilentSOS Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   CAREGIVER      │
                    │   (Browser)      │
                    └────────┬─────────┘
                             │ React + Vite
                             │ Tailwind CSS
                             ▼
              ┌──────────────────────────┐
              │      VERCEL CDN          │
              │   (Frontend Hosting)     │
              │  silent-sos-rust.        │
              │  vercel.app              │
              └─────────────┬────────────┘
                            │ HTTPS / Axios
                            │
          ┌─────────────────▼──────────────────┐
          │         EXPRESS.JS API              │
          │      (Render — Node 20)             │
          │                                     │
          │  ┌──────────────────────────────┐   │
          │  │  Auth Router                 │   │
          │  │  /api/auth/register          │   │
          │  │  /api/auth/login  (JWT)      │   │
          │  └──────────────────────────────┘   │
          │                                     │
          │  ┌──────────────────────────────┐   │
          │  │  Profiles Router             │   │
          │  │  /api/profiles  (CRUD)       │   │
          │  │  /api/profiles/:id/qr        │   │
          │  └──────────────────────────────┘   │
          │                                     │
          │  ┌──────────────────────────────┐   │
          │  │  Emergency Router (PUBLIC)   │   │
          │  │  /api/emergency/:qrId        │   │
          │  │  /api/emergency/:qrId/note   │   │
          │  └──────────────────────────────┘   │
          │                                     │
          │  ┌──────────────────────────────┐   │
          │  │  Alerts Router               │   │
          │  │  /api/alerts/sos             │   │
          │  └──────────────────────────────┘   │
          │                                     │
          └──────────────┬──────────────────────┘
                         │ Mongoose ODM
                         ▼
          ┌──────────────────────────┐
          │     MongoDB Atlas        │
          │   (Cloud Database)       │
          │                          │
          │  Collections:            │
          │  • users                 │
          │  • profiles              │
          │  • emergencyscans        │
          │  • alerts                │
          └──────────────────────────┘

                    ┌───────────────────┐
                    │   QR SCANNER      │
                    │ (Any smartphone)  │
                    └────────┬──────────┘
                             │ No app, no login
                             │ Just a browser URL
                             ▼
              ┌──────────────────────────┐
              │  PUBLIC EMERGENCY PAGE   │
              │  /emergency/:qrId        │
              │  • Profile data          │
              │  • GPS capture           │
              │  • Symbol communicator   │
              │  • WhatsApp SOS trigger  │
              └──────────────────────────┘
```

---

## 🔄 Emergency Flow — Sequence Diagram

```
CAREGIVER          SYSTEM              RESPONDER          PATIENT
    │                 │                    │                  │
    │  Create Profile │                    │                  │
    │────────────────▶│                    │                  │
    │                 │ Generate uuidv4 QR │                  │
    │                 │ Store in MongoDB   │                  │
    │◀────────────────│                    │                  │
    │  QR Card PDF    │                    │                  │
    │  (wristband)    │                    │                  │
    │                 │                    │                  │
    │                 │         [EMERGENCY HAPPENS]           │
    │                 │                    │                  │
    │                 │   Scan QR code     │                  │
    │                 │◀───────────────────│                  │
    │                 │                    │                  │
    │                 │  GET /emergency/   │                  │
    │                 │  :qrId             │                  │
    │                 │  (no auth needed)  │                  │
    │                 │───────────────────▶│                  │
    │                 │                    │                  │
    │                 │  Log scan event    │                  │
    │                 │  + GPS coords      │                  │
    │◀────────────────│                    │                  │
    │  WhatsApp alert │                    │                  │
    │  + Maps link    │                    │                  │
    │                 │                    │                  │
    │                 │  Profile loaded    │                  │
    │                 │  Responder reads:  │                  │
    │                 │  conditions,       │                  │
    │                 │  allergies,        │                  │
    │                 │  calm instructions │                  │
    │                 │                    │  Symbol buttons  │
    │                 │                    │◀─────────────────│
    │                 │                    │  "I am in pain"  │
    │                 │                    │  (spoken aloud)  │
```

---

## 🧮 DSA & Engineering Decisions

These aren't implementation details for their own sake — each choice directly affects how fast and safely someone gets helped.

### 1. UUID v4 for QR Identity

```javascript
const qrId = uuidv4(); // e.g. "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
```

**Why not sequential IDs?**  
Sequential IDs (`/emergency/1`, `/emergency/2`) are trivially enumerable. Anyone could scrape every patient's medical data. UUID v4 has 2¹²² possible values — brute-force enumeration is computationally infeasible. This is a **security-by-obscurity-as-defense-in-depth** pattern used in medical record systems.

---

### 2. Priority Queue Pattern for Critical Data Display

Emergency data is sorted before rendering using a weighted priority system:

```javascript
// Allergies sorted by severity weight
const SEVERITY_WEIGHT = { critical: 3, moderate: 2, mild: 1 };

const sortedAllergies = profile.allergies.sort(
  (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
);

// Emergency contacts: primary contact always index 0
const sortedContacts = profile.emergencyContacts.sort(
  (a, b) => b.isPrimary - a.isPrimary
);
```

**Why this matters:** In a high-stress emergency, a responder cannot scan a list. Critical allergies and the primary contact **must** appear first. This is a **max-heap ordering** applied at the data layer — O(n log n) sort on small n, but the UX impact is life-critical.

---

### 3. Stateless Public Emergency Route

```
GET /api/emergency/:qrId   →   No JWT required
POST /api/emergency/:qrId/location   →   No JWT required
```

The emergency view is **intentionally stateless and auth-free**. A responder cannot be expected to create an account before helping someone. This is a deliberate architectural split:

```
AUTHENTICATED SURFACE        PUBLIC SURFACE
─────────────────────        ──────────────
/dashboard                   /emergency/:qrId
/profiles                    (read-only snapshot)
/profiles/:id/edit
/settings
```

The public surface only exposes what was explicitly published by the caregiver. **Principle of least privilege** applied at the route level.

---

### 4. Scan Event Log as an Append-Only Ledger

Every QR scan creates a new document — existing documents are never mutated:

```javascript
// emergencyscan model — append only
{
  profileId: ObjectId,
  qrId: String,
  scannedAt: Date,       // immutable timestamp
  location: { lat, lng },
  scannerIp: String,
  responderNotes: String
}
```

This mirrors the **event sourcing pattern** — the full audit trail is preserved. Caregivers can answer: "Who scanned this, when, and from where?" This is the same approach used in financial ledgers and medical audit systems.

---

### 5. JWT + bcrypt Auth Pipeline

```
Register:
  password → bcrypt.hash(password, 12) → stored in DB
  
Login:
  input → bcrypt.compare(input, hash) → JWT signed (HS256)
  JWT payload: { userId, iat, exp: 7d }

Protected routes:
  Authorization: Bearer <token>
  → middleware verifies signature → attaches req.user
```

Salt rounds = 12: roughly 300ms per hash on commodity hardware. This makes brute-force attacks on leaked hashes computationally expensive while keeping login latency acceptable for users.

---

### 6. Offline-First with Service Worker (PWA)

```javascript
// sw.js — cache-first strategy for emergency data
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        caches.open('silentsos-v1').then(cache => {
          cache.put(event.request, response.clone());
        });
        return response;
      });
    })
  );
});
```

**Why:** Hospitals, basements, and rural areas often have no signal. Once a profile is loaded, the Service Worker caches all assets. The symbol communicator and medical notes remain available offline. This is a **cache-first, network-fallback** strategy — standard pattern in PWA engineering.

---

## 📡 Full API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create caregiver account |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/api/auth/me` | ✅ JWT | Get current user |

**Register payload:**
```json
{
  "name": "Riya Kumar",
  "email": "riya@example.com",
  "password": "securepassword"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Riya Kumar", "email": "riya@example.com" }
}
```

---

### Profiles

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/profiles` | ✅ JWT | All profiles for logged-in caregiver |
| `POST` | `/api/profiles` | ✅ JWT | Create new emergency profile |
| `GET` | `/api/profiles/:id` | ✅ JWT | Single profile by MongoDB ID |
| `PUT` | `/api/profiles/:id` | ✅ JWT | Update profile |
| `DELETE` | `/api/profiles/:id` | ✅ JWT | Delete profile |
| `GET` | `/api/profiles/:id/qr` | ✅ JWT | Get QR code image for profile |
| `GET` | `/api/profiles/activity` | ✅ JWT | All scan events for caregiver's profiles |

**Create Profile payload:**
```json
{
  "name": "Arjun Rao",
  "age": 28,
  "bloodGroup": "B+",
  "preferredLanguage": "Hindi",
  "conditions": ["Autism Spectrum Disorder", "Epilepsy"],
  "allergies": [
    { "name": "Valium", "severity": "critical", "reaction": "triggers seizure" }
  ],
  "medications": [
    { "name": "Levetiracetam", "dosage": "500mg", "frequency": "twice daily" }
  ],
  "emergencyContacts": [
    { "name": "Meera Rao", "phone": "+919876543210", "relationship": "Mother", "isPrimary": true }
  ],
  "calmTriggers": ["Soft music", "Familiar voice"],
  "avoidTriggers": ["Loud noise", "Sudden touch"],
  "communicationNotes": "Speak slowly. Give him time. Do not force eye contact.",
  "whatsappSosEnabled": true
}
```

---

### Public Emergency (No Auth)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/emergency/:qrId` | ❌ | Load full profile by QR ID. Logs scan event. |
| `POST` | `/api/emergency/:qrId/location` | ❌ | Update GPS coordinates for incident |
| `POST` | `/api/emergency/:qrId/note` | ❌ | Add responder note to scan log |

**Location update payload:**
```json
{
  "lat": 12.9716,
  "lng": 77.5946
}
```

---

### Alerts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/alerts/sos` | ❌ | Log SOS event, generate WhatsApp link |

**SOS payload:**
```json
{
  "qrId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "message": "Person found unconscious near MG Road"
}
```

---

## 🧑‍💻 Real-World Case Studies

### Case 1 — Sensory Overload at a Shopping Mall

> Ravi, 24, is autistic and non-verbal. He visits a mall with his mother. In the food court, the crowd noise triggers a shutdown. He drops to the floor, unable to respond or move. A security guard approaches — Ravi cannot speak, cannot make eye contact, cannot give his mother's number.

**Without SilentSOS:** The guard calls an ambulance. Ravi is taken to a hospital. His mother isn't reached for 2 hours. The hospital doesn't know about his autism or that physical restraint will cause a meltdown.

**With SilentSOS:** The guard scans the QR on Ravi's ID card. In 4 seconds:
- Sees: Autism, sensory overload instructions, "do not touch without warning"
- Reads: "Play calm music. Give space. Do not crowd him."
- Calls: Mother's WhatsApp — already pre-alerted with Google Maps pin
- Ravi taps: 😨 Scared → phone speaks "I am scared" aloud

---

### Case 2 — Stroke Survivor at a Pharmacy

> Kamala, 67, had a stroke 8 months ago. She has aphasia — she understands everything but cannot form words. She takes blood thinners. At the pharmacy, she feels dizzy and collapses.

**The pharmacist scans her wristband QR code:**
- Conditions: Stroke recovery, Aphasia
- Medications: Warfarin 5mg daily — **DO NOT give aspirin or NSAIDs**
- Blood group: A+
- Contact: Son — Dr. Venkat Rao (emergency listed first, sorted by priority weight)

The pharmacist avoids aspirin (which could cause internal bleeding), calls the son, and waits for the ambulance with full context.

---

### Case 3 — Lost Child at a Railway Station

> Aanya, 8, is non-verbal due to cerebral palsy. She becomes separated from her father at a busy railway station. She can tap but cannot speak.

A railway employee notices her. She is wearing a SilentSOS wristband. The employee scans it:
- Photo confirms identity
- Name, age, father's number appear instantly
- Communication board: Aanya taps 😨 → phone says "I am scared, please help me"
- Father receives WhatsApp alert with platform GPS coordinates

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND                                               │
│  React 18 + Vite · React Router v6 · Axios             │
│  Tailwind CSS · Lucide Icons                            │
│  Web Speech API (TTS) · MediaRecorder API              │
│  Service Worker (PWA / Offline)                         │
├─────────────────────────────────────────────────────────┤
│  BACKEND                                                │
│  Node.js 20 · Express.js · Mongoose                    │
│  JWT (HS256) · bcrypt (rounds: 12)                     │
│  qrcode npm package · uuid v4                          │
├─────────────────────────────────────────────────────────┤
│  DATABASE                                               │
│  MongoDB Atlas (Cloud) · Mongoose ODM                  │
│  Collections: users, profiles,                         │
│  emergencyscans, alerts                                 │
├─────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE                                         │
│  Vercel (Frontend CDN) · Render (Node API)             │
│  UptimeRobot (Health monitoring every 5 min)           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas URI (or local MongoDB)

### 1. Clone

```bash
git clone https://github.com/jamunatg2006-sys/SILENT-SOS.git
cd SILENT-SOS
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=a_long_random_secret_string
```

```bash
npm run dev
# API running at http://localhost:5000
# Health: http://localhost:5000/api/health
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# App running at http://localhost:5173
```

---

## 🌐 Deployment

| Service | Config |
|---------|--------|
| **Vercel** (Frontend) | Root: `frontend` · Build: `npm run build` · Output: `dist` |
| **Render** (Backend) | Root: `backend` · Build: `npm install` · Start: `npm start` |
| **MongoDB Atlas** | Shared cluster · IP whitelist: `0.0.0.0/0` for Render |

### Environment Variables

**Render:**
```
CLIENT_URL=https://silent-sos-rust.vercel.app
MONGODB_URI=<atlas_uri>
JWT_SECRET=<secret>
NODE_VERSION=20
```

**Vercel:**
```
VITE_API_URL=https://silent-sos-9h05.onrender.com/api
```

---

## 🔐 Security Model

```
┌─────────────────────────────────────────────────────────┐
│  THREAT              MITIGATION                         │
├─────────────────────────────────────────────────────────┤
│  Profile enumeration  UUID v4 QR IDs (2¹²² space)     │
│  Credential theft     bcrypt rounds=12, JWT 7d expiry  │
│  Unauthorized write   JWT middleware on all mutations  │
│  XSS                  React's DOM escaping (default)   │
│  CORS abuse           Strict origin whitelist          │
│  Cold credential leak .env never committed to git      │
└─────────────────────────────────────────────────────────┘
```

---

## 🗺️ Roadmap

- [x] JWT caregiver auth
- [x] Emergency profiles with QR
- [x] Public emergency view (no login)
- [x] Symbol communicator with TTS
- [x] WhatsApp SOS alert flow
- [x] Scan event logging
- [x] Offline PWA support
- [x] Multi-language display (EN / HI / KN / TA / TE)
- [ ] Real-time caregiver dashboard (WebSocket)
- [ ] Vitals status broadcast by responder
- [ ] Calm Kit — caregiver voice messages
- [ ] SMS fallback for WhatsApp
- [ ] Printable PDF emergency cards
- [ ] Rate limiting + abuse prevention
- [ ] Admin moderation panel

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

```bash
# Fork → Clone → Branch
git checkout -b feature/your-feature-name

# Make changes → Commit
git commit -m "feat: describe your change"

# Push → Pull Request
git push origin feature/your-feature-name
```

---

## 📄 License

This project is built for accessibility-focused innovation and hackathon demonstration.  
Add a license before commercial distribution.

---

<div align="center">

**Built with urgency. Designed for silence. Made for the moments that matter.**

*SilentSOS — because safety should never depend on someone's ability to speak.*

<br/>

[![Live Demo](https://img.shields.io/badge/Try_It_Now-silent--sos--rust.vercel.app-0ea5e9?style=for-the-badge)](https://silent-sos-rust.vercel.app)

</div>
