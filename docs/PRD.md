# PRD.md — AI Mock Interview Coach

**Status:** Approved (Day 1, amended Day 2)
**Timeline:** 10-day MVP build

## Product Summary
A web application where users select a target job role and experience level, complete a realistic 5-question AI-powered mock interview, receive structured feedback after each answer (score, strengths, weaknesses, improvement suggestions), and get a final performance report with overall score, confidence level, and recommendations.

## v1.0 Scope — In

- User signup / login (email + password)
- Role selection
- Experience level selection
- AI-generated interview questions (5 per session)
- 5-question interview flow
- AI evaluation after every answer (score, strengths, weaknesses, suggestions)
- Progress tracking through the 5 questions
- Final performance report (overall score, confidence level, recommendations)
- Saved interview reports — users can revisit past sessions across visits
- Responsive UI
- Public deployment

## v1.0 Scope — Out (deferred to v1.1+)

- Recurring pattern analysis in the final report (cross-question behavioral pattern detection)
- Password reset / forgot-password flow
- Resume upload
- Voice interviews
- Video interviews
- ATS analysis
- Admin dashboard

## Day 2 Amendment Log

On Day 2, during technical blueprint design, two scope changes were proposed, discussed, and approved:

1. **Authentication and Database moved from Out of Scope to In Scope.**
   - **Reason:** User wants to save and revisit past interview reports across visits, which requires persistent, per-user storage.
   - **Trade-off accepted:** To keep the 10-day timeline unchanged, two features were deferred to v1.1 to absorb the added engineering time: recurring-pattern analysis in the final report, and password-reset functionality. Signup/login remain in scope for v1.0; only password recovery is deferred.
   - **Auth approach:** Self-built email + password authentication (bcrypt password hashing + JWT sessions), not a managed auth provider.
   - **Database:** MongoDB Atlas (free tier), chosen for schema flexibility fitting the nested interview-report data structure.

This amendment is reflected in ARCHITECTURE.md, SCHEMA.md, and API.md, all approved on Day 2.

## Success Criteria for v1.0
- A user can sign up, log in, select a role/level, complete a 5-question mock interview, receive feedback after each answer, and view a final report.
- The user can log out, log back in later, and see their past reports.
- The application is deployed and publicly accessible.
- No unauthenticated access to another user's interview data.
