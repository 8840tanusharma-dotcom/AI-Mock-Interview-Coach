# PITCH-DECK.md — AI Mock Interview Coach

## The Problem
Job seekers rarely get realistic, structured interview practice. Mock interviews with real people are hard to schedule, inconsistent in quality, and often lack objective, actionable feedback.

## The Solution
An AI-powered mock interview coach that:
- Generates realistic, role- and level-specific interview questions
- Evaluates each answer immediately with a score and concrete feedback
- Produces a final performance report with an overall score, confidence level, and personalized recommendations
- Lets users track their progress and revisit past sessions over time

## How It Works
1. Sign up and select a target role + experience level
2. Answer 5 AI-generated interview questions, one at a time
3. Receive structured feedback (strengths, weaknesses, suggestions) after every answer
4. Get a final report summarizing overall performance
5. Log back in anytime to review past interviews and track improvement

## Why Now
Large language models have reached a point where they can generate contextually appropriate interview questions and give consistent, structured evaluation — something previously only available through expensive human coaching.

## v1.0 MVP Scope
Role selection, experience level selection, AI question generation, 5-question interview flow, per-answer AI evaluation, progress tracking, final report, saved report history (auth-backed), responsive UI, public deployment.

## Deliberately Out of Scope for v1.0
Resume upload, voice/video interviews, ATS analysis, admin dashboard, recurring-pattern analysis, and password reset — all identified as strong v1.1+ candidates once the core loop is validated.

## Tech Foundation
React + Vite frontend, Node/Express backend, MongoDB Atlas, self-built JWT auth, Anthropic Claude API for question generation and evaluation, deployed free-tier on Vercel + Render.

## Timeline
10-day build, following an approved software development lifecycle: planning and blueprint (Days 1–2), backend and AI integration (Days 3–5), frontend build (Days 6–8), integration/testing/polish (Day 9), deployment and launch (Day 10).
