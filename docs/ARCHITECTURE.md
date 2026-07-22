# ARCHITECTURE.md — AI Mock Interview Coach

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Fast dev server, large ecosystem, Tailwind speeds up responsive UI |
| Backend | Node.js + Express | Same language as frontend; fast to build in 10 days; mature auth/JWT ecosystem |
| Database | MongoDB Atlas (free tier) | Schema-flexible, ideal for nested/variable interview report documents; free 512MB tier sufficient for MVP |
| Authentication | Self-built: bcrypt + JWT | Matches approved scope (email+password); no vendor lock-in, no cost |
| AI Model/API | Anthropic Claude API | Strong structured JSON output for questions, evaluations, and reports |
| Hosting (Frontend) | Vercel (free tier) | Zero-config React/Vite deploys, free SSL |
| Hosting (Backend) | Render (free tier) | Free Node hosting, auto-deploy from GitHub (cold start ~30-50s accepted for MVP) |
| Other | dotenv, Zod, React Router | Lightweight, standard, free |

## Component Diagram

```mermaid
graph TD
    U[User Browser]
    FE[Frontend<br/>React + Vite<br/>Vercel]
    BE[Backend API<br/>Node.js + Express<br/>Render]
    DB[(MongoDB Atlas)]
    AI[Anthropic Claude API]

    U -->|HTTPS| FE
    FE -->|REST API calls<br/>JWT in header| BE
    BE -->|Mongoose queries| DB
    BE -->|Prompt requests| AI
    AI -->|Structured JSON| BE
    BE -->|JSON responses| FE
    FE -->|Rendered UI| U
```

Frontend never talks to the DB or Claude directly — all traffic proxies through the backend, keeping credentials and API keys server-side only.

## Data Flow

```mermaid
flowchart LR
    A[User signs up/logs in] --> B[Selects role + experience level]
    B --> C[Backend asks Claude to generate 5 questions]
    C --> D[Question 1 shown to user]
    D --> E[User submits answer]
    E --> F[Backend sends answer to Claude for evaluation]
    F --> G[Score + strengths/weaknesses/suggestions returned]
    G --> H{More questions?}
    H -->|Yes| D
    H -->|No| I[Backend asks Claude to generate final report]
    I --> J[Report saved to MongoDB, tied to user]
    J --> K[User views report / revisits later from dashboard]
```

## Request Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant M as MongoDB
    participant C as Claude API

    U->>F: Log in (email + password)
    F->>B: POST /api/v1/auth/login
    B->>M: Verify user, fetch hash
    B-->>F: JWT token
    F->>B: POST /api/v1/interviews (role, level)
    B->>C: Generate 5 questions (prompt)
    C-->>B: JSON array of questions
    B->>M: Save interview session
    B-->>F: Interview + Question 1

    loop For each of 5 questions
        U->>F: Submit answer
        F->>B: POST /api/v1/interviews/:id/answers
        B->>C: Evaluate answer (prompt)
        C-->>B: Score, strengths, weaknesses, suggestions
        B->>M: Save answer + feedback
        B-->>F: Feedback + next question
    end

    F->>B: POST /api/v1/interviews/:id/complete
    B->>C: Generate final report (prompt)
    C-->>B: Overall score, confidence, recommendations
    B->>M: Save final report
    B-->>F: Final report
    F-->>U: Display report
```

## AI Interaction Detail

Three distinct Claude calls, each with a strict "respond only in JSON" system prompt for deterministic parsing:

| Call | Input | Output |
|---|---|---|
| Question generation | Role + experience level | Array of 5 questions (text + difficulty) |
| Per-answer evaluation | Question + answer + role/level context | `{score, strengths[], weaknesses[], suggestions[]}` |
| Final report generation | All 5 Q&A pairs + evaluations | `{overallScore, confidenceLevel, recommendations[]}` |

*Recurring-pattern analysis is deferred to v1.1 per approved scope trade-off (see PRD.md).*

## External Services

- **Anthropic Claude API** — question generation, evaluation, report generation
- **MongoDB Atlas** — persisted users + interview sessions/reports
- **Vercel** — frontend hosting
- **Render** — backend hosting
