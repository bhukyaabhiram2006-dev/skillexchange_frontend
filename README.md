# 🎓 Student Skill Exchange Platform

> **"Learn Together. Grow Together."** — A modern, responsive web application where college students exchange skills, discover peer mentors, collaborate on projects, and build an authentic campus learning community.

---

## 🌟 Overview

The **Student Skill Exchange Platform** solves the high cost and impersonality of learning new technical and creative skills by creating a zero-cost reciprocal knowledge-sharing economy. 

- A student proficient in **Python** or **Web Development** can easily connect with a design peer skilled in **Figma** or **UI/UX Design**.
- Both students mentor each other 1-on-1, track exchange sessions, message in real time, and build verified peer portfolios.

This phase represents the **complete frontend application**, featuring dynamic client-side state management, realistic mock data, a transparent match-scoring algorithm, and localStorage persistence for seamless testing.

---

## 🚀 Quick Start (VS Code & Local Terminal)

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+ (tested on npm 11)

### Setup Instructions

1. Open this project in **Visual Studio Code**:
   ```bash
   code c:\abhiramproject\frontend
   ```

2. Open the **Integrated Terminal** in VS Code (`Ctrl + ~` or `` Ctrl + ` ``) and install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧪 Testing & Verification

### Run Automated Tests
We use **Vitest** with **React Testing Library** and `jsdom`:
```bash
npm run test
```
*Current test suite: **15 tests passing** across 4 suites covering the matching algorithm, reusable UI components, authentication form validations, and skill exchange interactions.*

### Build for Production
To generate the optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest 5](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) + `@testing-library/jest-dom`
- **State & Persistence**: React Context API (`AuthContext`, `ExchangeContext`, `MessageContext`, `ToastContext`) + HTML5 `localStorage`

---

## 🎨 UI/UX Design System

- **Color Palette**: Primary Indigo (`#4f46e5`), Violet (`#7c3aed`), and clean White with neutral slate tones (`#f8fafc`, `#334155`).
- **Cards & Elevation**: Rounded 2xl borders (`rounded-2xl`, `rounded-3xl`), soft shadows, and clean border dividers (`border-slate-100`).
- **Responsive Layout**: Desktop navigation with fixed sidebar and top quick-actions; full drawer menu and touch-friendly controls on tablets and mobile screens.
- **Micro-interactions**: Toast notifications for user feedback, modal dialogs with keyboard accessibility (Escape to close), animated match score pills.

---

## 📱 Pages & Features Included

| Page | Route | Key Functionality |
|---|---|---|
| **Landing Page** | `/` | Hero section, How It Works (3 steps), Featured Categories, Featured Student Cards, Benefits, Testimonials, and Call to Action. |
| **Login Page** | `/login` | Email/password fields, show/hide password toggle, remember-me checkbox, demo notice, and **One-Click Demo Student Login**. |
| **Sign-Up Page** | `/signup` | Full registration with college, major, year, skills offered, skills desired, client-side validation, and instant account onboarding. |
| **Student Dashboard** | `/dashboard` | Personalized welcome banner, 4 summary metric cards, Top Recommended Matches with match %, upcoming sessions, and recent activity. |
| **Explore Skills** | `/skills` | Filter by 10 categories, difficulty level, and format. Real-time search, Grid/List view toggle, and "Offer a Skill" modal. |
| **Student Profiles** | `/students` | Browse student peer directory, match score badges with tooltips, campus filter, learning mode filter, and connect buttons. |
| **Student Details** | `/students/:id` | Full student profile, skills catalog, wishlist, availability schedule, mutual match analysis, and exchange proposal modal. |
| **My Skill Exchanges** | `/exchanges` | Tabs for **Pending**, **Active**, and **Completed** exchanges. Accept/reject requests, schedule sessions, mark complete, and leave reviews. |
| **Messages & Chat** | `/messages` | Two-panel messenger, conversation search, unread badges, instant sending, and simulated friendly peer replies. |
| **Profile & Settings** | `/profile` | Edit student info, add/remove skills to teach and learn, notification toggles, and **Reset Demo Data** button. |

---

## 🧠 Skill Exchange Matching Logic

Located in [`src/utils/matchingAlgorithm.js`](src/utils/matchingAlgorithm.js):

1. **Reciprocal Goal Analysis**: Compares skills the current student wants to learn against the peer's offered skills.
2. **Mutual Exchange Bonus**: If Peer A teaches what Student B wants, **and** Student B teaches what Peer A wants, the algorithm flags a **"Mutual Match" (90%+ score)**.
3. **Explanatory Reason Generation**: Provides human-readable justifications on match badges, e.g.:
   > *"Mutual Match: Sophia teaches Figma (which you want to learn) & wants Python (which you teach)."*

---

## 📊 Mock State vs. Future Backend Roadmap

| Feature | Current Phase (Frontend Demo) | Future Production Backend |
|---|---|---|
| **Authentication** | Browser-side demo session via `AuthContext` and `localStorage` | JWT / OAuth2 (Google & .edu college SSO) |
| **Skill Marketplace** | In-memory mock catalog augmented with custom user submissions | PostgreSQL / Supabase with full-text search |
| **Exchanges & Booking** | Local state status transitions (Pending ➔ Active ➔ Completed) | Relational database, calendar invites (iCal/Google Cal) |
| **Messaging** | Local conversation log with simulated responsive replies | WebSockets (Socket.io) or Pusher real-time channels |
| **Reviews & Ratings** | Local mock reviews and average score calculations | Verified exchange review system with anti-spam safeguards |

---

## 🛠️ Troubleshooting

- **Port in use**: If port 5173 is already occupied, run:
  ```bash
  npm run dev -- --port 5174
  ```
- **Reset Demo State**: If you want to reset all mock exchanges and created skills back to default, navigate to `/profile` and click **"Reset Demo Data"**, or clear your browser's local storage for `localhost:5173`.
