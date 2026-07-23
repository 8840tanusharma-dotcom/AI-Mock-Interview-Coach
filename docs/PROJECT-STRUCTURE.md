# PROJECT STRUCTURE — AI Mock Interview Coach

This document defines the full folder structure for both `frontend/` and `backend/`, and explains the responsibility of every major folder. This structure is designed to support the approved v1.0 MVP scope while leaving clear, low-friction expansion points for v1.1+ features (recurring pattern analysis, resume upload, voice interviews) without requiring a restructure.

**Status as of Day 3:** The structure below is now implemented and verified working (not just planned). Additions made during Day 3 build-out beyond the original Day 2 design:
- `frontend/src/routes/AppRouter.jsx` — implemented using `react-router-dom` (added as a new dependency)
- `frontend/src/context/AuthContext.jsx` — scaffolded (structure only, no real signup/login logic yet — that's Day 4)
- `frontend/src/services/api.js` — implemented as a centralized fetch wrapper with JWT auto-attachment
- `frontend/src/pages/` — three placeholder pages created (`LandingPage.jsx`, `AuthPage.jsx`, `DashboardPage.jsx`) to give routing something to render; real content arrives Day 4+
- `backend/src/app.js`, `backend/server.js`, `backend/src/config/db.js` — implemented and verified: Express server running, MongoDB Atlas connected, `/api/v1/health` endpoint responding correctly

---

## Root Layout

```
AI-Mock-Interview-Coach/
├── frontend/
├── backend/
├── docs/
├── .gitignore
└── README.md
```

- **`frontend/`** — React + Vite client application
- **`backend/`** — Node.js + Express API server
- **`docs/`** — All planning and design documentation (PRD, blueprint, architecture, schema, API, wireframes, project log)

---

## Frontend Structure

```
frontend/
├── public/
├── src/
│   ├── assets/              # images, icons, static media
│   ├── components/
│   │   ├── common/          # Button, Input, Card, ProgressBar, Spinner, Modal
│   │   └── interview/       # QuestionCard, FeedbackCard, ReportSummaryCard
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx          # signup + login (tabbed or toggle)
│   │   ├── DashboardPage.jsx
│   │   ├── RoleSelectPage.jsx
│   │   ├── InterviewPage.jsx
│   │   ├── FinalReportPage.jsx
│   │   └── ReportDetailPage.jsx
│   ├── routes/
│   │   └── AppRouter.jsx    # React Router route table, protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx # holds JWT + current user, exposes login/logout
│   ├── services/
│   │   └── api.js          # single fetch/axios wrapper for all backend calls
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useInterview.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── styles/
│   │   └── index.css       # Tailwind entrypoint
│   ├── App.jsx
│   └── main.jsx
├── .env.example             # VITE_API_BASE_URL
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Where features live
| Feature | Location |
|---|---|
| Signup/Login screens | `pages/AuthPage.jsx`, state in `context/AuthContext.jsx` |
| Role/experience selection | `pages/RoleSelectPage.jsx` |
| Interview Q&A loop | `pages/InterviewPage.jsx` + `components/interview/QuestionCard.jsx` + `FeedbackCard.jsx` |
| Final report | `pages/FinalReportPage.jsx` |
| Dashboard / history | `pages/DashboardPage.jsx` |
| Past report view | `pages/ReportDetailPage.jsx` |
| All API calls | `services/api.js` (single source of truth for endpoint URLs) |

### Future expansion (no restructure needed)
- **Resume upload** → new `pages/ResumeUploadPage.jsx` + new method in `services/api.js`
- **Voice interviews** → new component `components/interview/VoiceRecorder.jsx`, slots into existing `InterviewPage.jsx`
- **Recurring patterns (v1.1)** → new section inside `FinalReportPage.jsx`, no new files required

---

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB connection setup
│   │   └── env.js           # centralized env var loading/validation
│   ├── models/
│   │   ├── User.js
│   │   └── InterviewSession.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── interviewController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── index.js         # mounts all route modules under /api/v1
│   ├── middleware/
│   │   ├── authMiddleware.js   # verifies JWT, attaches req.user
│   │   ├── errorHandler.js     # centralized error -> standard error shape
│   │   └── validateRequest.js  # generic request validation wrapper
│   ├── services/
│   │   └── claudeService.js    # all 3 Claude API calls (questions, evaluation, report)
│   ├── validators/
│   │   ├── authValidators.js
│   │   └── interviewValidators.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── password.js         # bcrypt hash/compare helpers
│   └── app.js                  # Express app setup, middleware registration
├── server.js                   # entrypoint, starts the HTTP server
├── .env.example                 # MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY, PORT
└── package.json
```

### Where features live
| Feature | Location |
|---|---|
| Signup/Login/JWT issuing | `controllers/authController.js`, `routes/authRoutes.js`, `utils/jwt.js`, `utils/password.js` |
| Auth protection on routes | `middleware/authMiddleware.js` |
| Start interview / generate questions | `controllers/interviewController.js` → `services/claudeService.js` |
| Submit answer / get feedback | `controllers/interviewController.js` → `services/claudeService.js` |
| Complete interview / generate report | `controllers/interviewController.js` → `services/claudeService.js` |
| All DB schema | `models/User.js`, `models/InterviewSession.js` |
| Input validation | `validators/*.js` + `middleware/validateRequest.js` |
| Error responses | `middleware/errorHandler.js` (standard `{ error: { code, message } }` shape) |

### Future expansion (no restructure needed)
- **Resume upload** → new field on `User.js` model + new route in `authRoutes.js` or a new `resumeRoutes.js`
- **Voice interviews** → extend `interviewValidators.js` to accept multipart audio; `claudeService.js` gains a transcription step
- **Recurring patterns (v1.1)** → additive field on `InterviewSession.report`, one new method in `claudeService.js`
- **v2 API** → new `routes/v2/` folder mounted alongside `v1`, old clients keep working

---

## Why This Structure

- **Separation of concerns:** controllers handle HTTP, services handle external calls (Claude), models handle data — easy to test and reason about independently
- **Single source of truth for API calls** (`frontend/services/api.js`) and **for Claude prompts** (`backend/services/claudeService.js`) — when the AI prompt format changes, there's exactly one file to touch
- **Flat, shallow nesting** — appropriate for a 10-day MVP; avoids premature over-engineering (no domain-driven "modules" folders yet, which would add overhead without payoff at this size)
- **Scoped for growth** — every planned v1.1+ feature has an identified, additive landing spot, so scope creep risk is low and the current MVP structure won't need to be torn up later
