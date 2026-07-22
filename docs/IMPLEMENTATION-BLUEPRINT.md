# IMPLEMENTATION-BLUEPRINT.md — AI Mock Interview Coach

**Total timeline:** 10 days
**Status after Day 2:** On track, no scope creep beyond the one approved amendment (see PRD.md Day 2 Amendment Log)

---

## Day-by-Day Plan

### Day 1 — Discovery & Planning ✅ Complete
- Defined MVP scope, in/out-of-scope boundaries
- Drafted PRD and Pitch Deck

### Day 2 — Technical Blueprint ✅ Complete
- Repository created, cloned, initial folder skeleton pushed
- Tech stack finalized (React/Vite, Node/Express, MongoDB Atlas, JWT auth, Claude API, Vercel + Render)
- Full system architecture designed (component diagram, data flow, request lifecycle, AI interaction detail)
- Database schema designed and validated against every approved user story
- Full REST API designed (all v1.0 endpoints, request/response formats, validation, error handling)
- Complete UI/UX flow designed (user flow, screen flow, wireframes, navigation rules)
- Full project structure (frontend + backend folders) designed
- **Scope amendment approved:** Auth + Database moved in-scope; recurring-pattern analysis + password reset deferred to v1.1 to preserve the 10-day timeline

### Day 3 — Backend Foundation (Next)
- Initialize Express app (`app.js`, `server.js`), connect MongoDB Atlas
- Build `User` and `InterviewSession` Mongoose models per SCHEMA.md
- Implement auth: signup, login, JWT middleware, bcrypt hashing
- Implement `claudeService.js` skeleton with the 3 prompt functions (questions, evaluation, report) — can stub/mock Claude responses initially to unblock frontend work later
- Deploy a bare-bones version to Render to validate the hosting pipeline early (reduces Day 10 risk)

### Day 4 — Backend Feature Completion
- Implement interview endpoints: create session, submit answer, complete session
- Wire real Claude API calls into `claudeService.js`
- Input validation (Zod) on all endpoints
- Manual testing of full backend flow via Postman/curl (no frontend needed yet)

### Day 5 — Backend Hardening
- Error handling middleware, consistent error shape
- Ownership checks (403 cases), idempotency on `/complete`
- Basic rate-limiting / abuse protection on auth endpoints
- Buffer day for any Day 3–4 spillover

### Day 6 — Frontend Foundation
- Scaffold Vite + Tailwind project, routing, AuthContext
- Build Landing, Auth (signup/login), Dashboard pages (static/mock data)

### Day 7 — Frontend Core Flow
- Build Role Select, Interview screen, Feedback display
- Wire to real backend endpoints

### Day 8 — Frontend Completion
- Build Final Report and Past Report Detail pages
- Responsive polish across breakpoints
- Navigation rules (leave-confirmation, protected routes)

### Day 9 — Integration & Testing
- End-to-end manual test of the full user journey
- Bug fixes, edge cases (empty answers, Claude API failures, expired tokens)

### Day 10 — Deployment & Launch
- Final deploy to Vercel (frontend) + Render (backend)
- Environment variable configuration in both dashboards
- Smoke test the live public URL
- Launch post / project wrap-up

---

## Day 3 Readiness Check (Completed End of Day 2)

**Can the project realistically be completed in the remaining 8 days?**
Yes. The approved auth/DB scope addition added real work, but it is fully absorbed by deferring recurring-pattern analysis and password reset — both cleanly separable, additive features with no dependency on the rest of the build. No other scope adjustments are needed.

**Has any unnecessary scope crept in?**
No. Every screen, endpoint, and schema field maps directly to an approved user story (validated explicitly in SCHEMA.md and cross-checked against the PRD). No admin tooling, no premature analytics, no unused fields.

**Can Day 3 begin implementation immediately, with no additional planning required?**
Yes. Models, endpoints, folder structure, and prompt responsibilities are all fully specified. Day 3 can start directly with `npm init` in `backend/` and model creation — no design decisions remain open.

**Recommended simplification carried into Day 3:** Stub Claude responses for the first backend pass (Day 3) before wiring the real API (Day 4). This decouples "does the API contract work" from "does the AI produce good output," reducing debugging complexity per day.
