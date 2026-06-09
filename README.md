# Silent Emergency / SilentSOS

Silent Emergency is a healthcare and accessibility web application built to help people who cannot communicate clearly during emergencies. It is designed for non-verbal individuals, autistic people, stroke survivors, people with speech impairments, people with cognitive disabilities, and anyone who may need urgent support but cannot explain their identity, condition, medical needs, or preferred way of being helped.

Live frontend: https://silent-sos-rust.vercel.app  
Live backend health check: https://silent-sos-9h05.onrender.com/api/health

## The Problem

In an emergency, the first few minutes matter. But many people cannot always speak, explain their condition, remember contact numbers, describe allergies, or tell a stranger how to help them safely.

This creates a dangerous communication gap for:

- Non-verbal individuals
- Autistic people who may experience sensory overload or shutdown
- Stroke survivors with speech or cognitive difficulty
- People with cerebral palsy or speech impairments
- Elderly people with dementia or memory loss
- Children or adults who may get lost, overwhelmed, injured, or separated from caregivers

Most emergency systems assume that the person can speak, answer questions, or unlock a phone. Silent Emergency is built for the moments when that assumption fails.

## Our Solution

Silent Emergency gives caregivers a way to create a secure emergency medical profile and convert it into a scannable QR code. The QR code can be printed on an ID card, attached to a wristband, saved on a phone lock screen, placed in a school bag, or carried anywhere.

When a stranger, teacher, security guard, first responder, or medical professional scans the QR code, they are taken to a public emergency page. No login is required for the scanner. The page shows the most important information needed to help the person quickly and safely.

The goal is not just to display medical information. The goal is to create a complete emergency communication and assistance bridge for people who cannot communicate for themselves.

## Who It Helps

Silent Emergency is built for three main groups:

1. The person in need
   - They get a safer way to communicate identity, needs, and emergency instructions.

2. Caregivers and family members
   - They can prepare a profile once and share it through a QR code.
   - They can review emergency scan activity and know when a profile was accessed.

3. Helpers and responders
   - They can scan a QR code and immediately understand what to do, who to call, and how to communicate.

## Core Features

### Secure Caregiver Accounts

Caregivers can register, log in, and manage emergency profiles using JWT-based authentication.

### Emergency Medical Profiles

Each profile can store essential information such as:

- Name and age
- Photo
- Blood group
- Medical conditions
- Allergies
- Medications
- Emergency contacts
- Calm triggers
- Avoid triggers
- Communication notes
- Preferred language
- Personalized helping instructions

### QR Code Emergency Access

Every profile receives a unique QR identifier. The backend generates a QR code that links to a public emergency page.

Example emergency route:

```txt
https://silent-sos-rust.vercel.app/emergency/:qrId
```

This allows the emergency page to open in any browser without requiring an app download or account login.

### Public Emergency Page

When someone scans the QR code, the public emergency page displays critical information in a clear and action-focused format.

It can show:

- Identity and photo
- Medical conditions
- Allergies and medications
- Emergency contacts
- Communication preferences
- Instructions for safe assistance
- Links to communication tools and handoff views

### Accessibility Communication Board

The app includes an accessibility-focused communication board with large visual buttons such as:

- I need water
- I am in pain
- Call my caregiver
- I need help
- I am scared
- I need space

When a button is pressed, the application can use text-to-speech so the user's need is spoken aloud.

### Emergency Scan Logging

When a QR profile is accessed, the backend logs the emergency scan with:

- Profile reference
- QR ID
- Timestamp
- Scanner network information when available
- Optional location updates
- Optional notes from the helper

This helps caregivers understand when and where the emergency profile was used.

### SOS and Caregiver Contact Flow

The backend can log SOS alerts and generate a pre-filled WhatsApp message for the primary emergency contact. If location is available, it can include a Google Maps link.

### Hospital Handoff

The app includes a hospital handoff-style view so responders or medical professionals can quickly read the most important information in a more clinical summary format.

## How It Works

1. A caregiver creates an account.
2. The caregiver creates a medical and communication profile.
3. Silent Emergency generates a unique QR code for that profile.
4. The QR code is printed, saved, or attached to something the person carries.
5. During an emergency, anyone scans the QR code.
6. The scanner sees the emergency page without logging in.
7. The person receives better help because their needs, contacts, and instructions are available instantly.
8. The scan is logged for caregiver awareness.

## Example Use Cases

### Autism and Sensory Overload

A person becomes overwhelmed in a crowded place and cannot explain what is happening. A helper scans the QR code and learns what triggers to avoid, how to speak calmly, and who to contact.

### Stroke Recovery

A stroke survivor is conscious but unable to speak clearly. A responder scans the QR code and sees medications, conditions, contacts, and assistance instructions.

### Speech Impairment

A person cannot verbally communicate their need. They use the communication board to tap a large button, and the app speaks the message aloud.

### Dementia or Memory Loss

An elderly person becomes lost. A stranger scans the QR code and can contact family while viewing safe support instructions.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React icons
- Text-to-speech browser APIs

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- QR code generation
- CORS configuration

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```txt
Silent-SOS/
  backend/
    middleware/
    models/
    routes/
    package.json
    server.js
  frontend/
    public/
    src/
      components/
      context/
      pages/
      utils/
    package.json
    vite.config.js
  render.yaml
  README.md
```

## Backend API Overview

### Health

```txt
GET /api/health
```

Checks whether the API is running and whether MongoDB is connected.

### Authentication

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Profiles

```txt
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/activity
GET    /api/profiles/:id
PUT    /api/profiles/:id
DELETE /api/profiles/:id
GET    /api/profiles/:id/qr
```

### Public Emergency Access

```txt
GET  /api/emergency/:qrId
POST /api/emergency/:qrId/location
POST /api/emergency/:qrId/note
```

### Alerts

```txt
POST /api/alerts/sos
```

## Local Development Setup

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB Atlas connection string or local MongoDB

### Clone the Repository

```bash
git clone <your-repository-url>
cd Silent-SOS
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/silentsos
JWT_SECRET=replace-with-a-long-random-secret
```

Start the backend:

```bash
npm run dev
```

Backend will run at:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at:

```txt
http://localhost:5173
```

## Production Environment Variables

### Render Backend

Add these in Render environment settings:

```txt
CLIENT_URL=https://silent-sos-rust.vercel.app
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<long-random-secret>
NODE_VERSION=20
```

Do not commit real secrets, database passwords, API keys, or tokens to GitHub.

### Vercel Frontend

Add this in Vercel environment variables:

```txt
VITE_API_URL=https://silent-sos-9h05.onrender.com/api
```

After changing Vercel environment variables, redeploy the frontend.

## Deployment Notes

The repository includes a `render.yaml` blueprint for the backend.

Render settings:

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Vercel settings:

```txt
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

## Uptime Monitoring

The backend health endpoint can be monitored with UptimeRobot or a similar service.

Monitor this URL:

```txt
https://silent-sos-9h05.onrender.com/api/health
```

Suggested monitor settings:

```txt
Monitor Type: HTTP(s)
Interval: 5 minutes
```

Note: Free hosting plans may still have sleep limits, usage limits, or policy restrictions. Uptime monitoring can reduce cold starts, but the most reliable production solution is a paid backend instance.

## Security and Privacy Considerations

Silent Emergency handles sensitive medical and personal information, so security matters.

Current protections include:

- JWT authentication for caregiver-only actions
- Password hashing with bcrypt
- Public emergency access limited to QR-linked emergency data
- CORS configured for the deployed frontend
- Environment variables for secrets and database credentials

Important production considerations:

- Do not expose database credentials publicly.
- Rotate any password that was accidentally shared.
- Use a strong JWT secret.
- Review what information appears on public emergency pages.
- Consider caregiver consent and local medical privacy requirements before real-world use.
- Add rate limiting and audit logging for production-grade safety.

## Why This Project Matters

Silent Emergency is built around a simple idea: safety should not depend on someone's ability to speak during the worst moment of their day.

A QR code alone is not enough. A complete emergency support system should help the responder understand the person, contact the right caregiver, avoid harmful actions, and give the person a way to express urgent needs.

Silent Emergency turns a small QR scan into a bridge between silence and help.

## Future Improvements

- Real-time caregiver notifications
- SMS or WhatsApp alert integration
- Multi-language emergency page translation
- Offline-first emergency card caching
- More advanced communication board customization
- Admin moderation and abuse prevention
- Rate limiting and stronger production security
- Printable PDF emergency cards
- Wearable-friendly QR templates
- Emergency responder dashboard

## Status

Silent Emergency is currently a working full-stack prototype with deployed frontend, deployed backend, MongoDB integration, QR profile sharing, caregiver authentication, emergency profile views, communication tools, and scan logging.

## License

This project is intended for learning, prototyping, and accessibility-focused innovation. Add a license before using it in production or distributing it commercially.
