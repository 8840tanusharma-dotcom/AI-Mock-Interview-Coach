# API.md — AI Mock Interview Coach

**Base URL:** `/api/v1`
**Auth mechanism:** `Authorization: Bearer <JWT>` header on all protected routes. Token issued on signup/login, expires in 7 days.
**Standard error shape (all endpoints):**
```json
{ "error": { "code": "INVALID_INPUT", "message": "Human-readable explanation" } }
```

---

## Auth Endpoints

### `POST /auth/signup`
- **Purpose:** Create a new user account
- **Auth:** No
- **Request:** `{ "name": "Jane Doe", "email": "jane@example.com", "password": "min8chars" }`
- **Validation:** `email` valid + unique; `password` min 8 chars; `name` required, 1-100 chars
- **Response `201`:** `{ "token": "jwt...", "user": { "id": "...", "name": "...", "email": "..." } }`
- **Errors:** `400` invalid input · `409` email already registered

### `POST /auth/login`
- **Purpose:** Authenticate existing user
- **Auth:** No
- **Request:** `{ "email": "...", "password": "..." }`
- **Response `200`:** same shape as signup
- **Errors:** `400` missing fields · `401` invalid credentials

### `GET /auth/me`
- **Purpose:** Get current logged-in user profile
- **Auth:** Yes
- **Response `200`:** `{ "id": "...", "name": "...", "email": "..." }`
- **Errors:** `401` missing/invalid/expired token

---

## Interview Session Endpoints

### `POST /interviews`
- **Purpose:** Start a new mock interview; triggers Claude to generate 5 questions
- **Auth:** Yes
- **Request:** `{ "role": "Frontend Developer", "experienceLevel": "Mid" }`
- **Validation:** `role` non-empty string; `experienceLevel` enum `["Entry","Mid","Senior"]`
- **Response `201`:**
```json
{
  "sessionId": "...",
  "role": "Frontend Developer",
  "experienceLevel": "Mid",
  "status": "in_progress",
  "currentQuestion": { "index": 0, "questionText": "...", "difficulty": "easy" }
}
```
- **Errors:** `400` invalid role/level · `401` unauthorized · `502` Claude API failure

### `GET /interviews`
- **Purpose:** List all sessions (past + in-progress) for the logged-in user
- **Auth:** Yes
- **Response `200`:** array of `{ id, role, experienceLevel, status, overallScore?, startedAt }`
- **Errors:** `401` unauthorized

### `GET /interviews/:id`
- **Purpose:** Get full session detail (questions, answers, feedback, report if completed)
- **Auth:** Yes, must own the session
- **Response `200`:** full session document
- **Errors:** `401` unauthorized · `403` not owner · `404` not found

### `POST /interviews/:id/answers`
- **Purpose:** Submit an answer to the current question; triggers Claude evaluation, returns feedback + next question
- **Auth:** Yes, must own session
- **Request:** `{ "questionIndex": 2, "answerText": "..." }`
- **Validation:** `questionIndex` must match the session's current unanswered question (prevents skipping/replay); `answerText` non-empty, max 5000 chars
- **Response `200`:**
```json
{
  "feedback": { "score": 78, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."] },
  "nextQuestion": { "index": 3, "questionText": "...", "difficulty": "medium" },
  "isLastQuestion": false
}
```
On the 5th answer: `nextQuestion: null`, `isLastQuestion: true`.
- **Errors:** `400` invalid/out-of-order questionIndex · `401` unauthorized · `403` not owner · `404` not found · `409` session already completed · `502` Claude evaluation failure

### `POST /interviews/:id/complete`
- **Purpose:** Finalize the session; triggers Claude to generate the overall report
- **Auth:** Yes, must own session
- **Validation:** All 5 questions must have answer + feedback; idempotent (repeat calls return existing report, no regeneration)
- **Response `200`:**
```json
{
  "overallScore": 82,
  "confidenceLevel": "High",
  "recommendations": ["...", "..."],
  "completedAt": "2026-07-22T10:15:00Z"
}
```
- **Errors:** `400` session not fully answered · `401` unauthorized · `403` not owner · `404` not found · `502` Claude report generation failure

---

## System Endpoint

### `GET /health`
- **Purpose:** Uptime check (also used by frontend to "wake" Render's free-tier backend before starting an interview)
- **Auth:** No
- **Response `200`:** `{ "status": "ok" }`

---

## Future-Proofing Notes (not built in v1.0)

- **Resume upload:** `POST /users/resume` + new `resumeUrl` field on `users` — additive, no existing endpoint changes
- **Voice interviews:** extend `POST /interviews/:id/answers` to accept multipart audio alongside `answerText` — same endpoint, additive
- **Analytics / recurring patterns (v1.1):** additive `report.recurringPatterns` field — no breaking change
