# CamcodeLearn Academy — User Learning Application (Port 3001)

Bilingual (**English + Khmer**) learner portal for **CamcodeLearn**, built with **Vite + React 19 + TypeScript + Tailwind CSS v4** on **Port 3001** (`camcode-learninguser`), sharing the visual identity and data ecosystem of `camcode-learningonline` (Port 3000).

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Runs at **http://localhost:3001**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server on port `3001` |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run build` | Type-check and build production bundle to `dist/` |
| `npm run preview` | Preview production build on port `3001` |

## Implemented Screens & Routes

- `/` — **Screen 01: User Dashboard** (welcome header, weekly goal & streak, 4 learning stats, Continue Learning resume card, active courses, learning paths, recommended courses, upcoming assessments, recent achievements, membership status)
- `/explore` — **Screen 02: Explore Courses** (search, category pills, difficulty, free/premium/purchased filter, sorting, Load More)
- `/courses/:slug` — **Screen 03: Course Details** (outcomes, requirements, expandable curriculum, instructor profile, all 5 enrollment/purchase/subscription CTAs)
- `/my-courses` — **Screen 04: My Courses** (`All`, `In Progress`, `Not Started`, `Completed` tabs with progress bars & last accessed date)
- `/learn/:slug/:lessonId?` — **Screen 05: Course Learning Workspace** (video, reading, and quiz lessons, collapsible curriculum sidebar, prev/next & mark complete, downloadable resources, persisted lesson notes)
- `/videos/:slug` — **Screen 06: Video Player** (interactive 16:9 presentation player with playback speed, captions, quality selector, chapter markers, clickable transcript, theater & fullscreen modes, resume position)
- `/learning-paths` & `/learning-paths/:slug` — Structured Career Learning Paths
- `/videos` & `/watchlist` — Video Library & Saved Watchlist
- `/assessments` & `/assessments/:slug` — Graded Certification Exams
- `/certifications` — Verified Printable Academy Certificates
- `/achievements` — XP, Weekly Activity Chart & Badges
- `/membership`, `/notifications`, `/profile`, `/settings`, `/help` — Account Management

