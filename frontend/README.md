# TruthLens 🔍

> An AI-powered fact-checking web app. Submit any news claim or URL and get a verdict backed by live web sources.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) + React + Tailwind CSS |
| Backend *(Phase 2+)* | Node.js + Express |
| Database *(Phase 2+)* | MySQL |
| AI *(Phase 2+)* | Gemini 2.5 Flash with search grounding |

---

## Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org) v18 or above
- [Git](https://git-scm.com)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/truthlens.git

# 2. Move into the project folder
cd truthlens

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Project Structure

```
truthlens/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Verify (home) page
│   ├── news/page.tsx     # News & Blogs page
│   ├── profile/page.tsx  # User profile page
│   ├── login/page.tsx    # Login page
│   └── signup/page.tsx   # Signup page
├── components/           # Reusable React components
│   ├── Navbar.tsx
│   ├── FactCheckInput.tsx
│   ├── ResultsBlock.tsx
│   ├── CredibilityChart.tsx
│   ├── ChatPanel.tsx
│   ├── SourceCard.tsx
│   ├── VerdictBadge.tsx
│   └── ThemeProvider.tsx
├── lib/
│   └── mockData.ts       # All mock data (Phase 1)
└── public/
```

---

## Features (Phase 1 — UI / Mock Data)

- ✅ Fact-check via text claim or news URL
- ✅ AI verdict: True / False / Misleading / Unverifiable
- ✅ Confidence score + credibility donut chart
- ✅ Source breakdown with links
- ✅ Follow-up chat panel scoped to each fact-check
- ✅ News & Blogs browser with searchable tag filters
- ✅ User profile with fact-check history
- ✅ Dark / Light mode toggle (cookie-persisted)
- ✅ Black & Red editorial theme

---

## Roadmap

- [ ] Phase 2 — Express backend + MySQL schema
- [ ] Phase 3 — Gemini API integration with search grounding
- [ ] Phase 4 — Wire frontend to real API
- [ ] Phase 5 — Auth (JWT) + user sessions
- [ ] Phase 6 — Chat API endpoint per fact-check

---

## Notes

- All data in Phase 1 is **mock data** — no real API calls are made yet.
- The `npm install` step recreates the `node_modules` folder (not stored in Git).

---

*Built as a solo college project.*
