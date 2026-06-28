<div align="center">

# Sapientia — Engineering OS

**Master Engineering. One Day at a Time.**

A full-stack study operating system for CS/engineering students targeting placements, GATE, ML engineering, and full-stack development. Dark-themed, fast, and built to replace scattered Notion docs, random YouTube playlists, and forgotten LeetCode streaks.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)](https://clerk.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Report Bug](https://github.com/Sreejith-nair511/Sapientia/issues) · [Request Feature](https://github.com/Sreejith-nair511/Sapientia/issues)

</div>

---

## What is Sapientia?

Sapientia is a personal engineering study OS — a single app that replaces the fragmented mess of tabs, spreadsheets, and todo lists most students use to prepare for placements, GATE, or senior engineering roles.

It combines a full curriculum (DSA, AI/ML, Core CS, Full Stack, Competitive Programming, GATE), a task manager with Kanban and Pomodoro, a per-topic workspace with notes and flashcards, analytics, and a shareable progress profile.

---

## Features

### Dashboard
- Today's task focus list from Supabase
- Study stopwatch and session timer
- Skill mastery radar chart
- 7-day activity area chart
- 30-day contribution heatmap
- Quick-access grid to all curriculum sections

### Task Manager
- Kanban board — Backlog, Today, In Progress, Review, Completed
- List view with search, filters, and category grouping
- Focus / Pomodoro view — 25/5/15 min sessions with audio cue
- Full CRUD with title, description, category (20 options), priority, difficulty, due date, tags, and estimated time
- Subtasks, task notes, drag-and-drop reordering

### Analytics
- Stats: total tasks, completed today, overdue, estimated vs actual hours
- Skill radar, 14-day area chart, category bar chart, priority breakdown
- 30-day activity heatmap — all from real Supabase data

### Curriculum

| Section | Content |
|---------|---------|
| DSA | 11 topics (Arrays through Backtracking), 70+ LeetCode problems with links |
| AI / ML | 6 modules — Math, Classical ML, Deep Learning, GenAI/LLMs, CV, NLP |
| Core CS | OS, DBMS, Networks, OOP/SOLID, System Design, Linux |
| Full Stack | HTML/CSS, JS, TS, React 19, Next.js 15, Node, Databases, Auth, DevOps |
| Competitive Programming | Number Theory, Advanced DP, Graphs, Strings, Combinatorics + C++ templates |
| Programming Languages | C++ (68 lessons), Python (72), Java, JavaScript, TypeScript |
| GATE | 10 subjects with chapter breakdowns, weightage, and strategy |
| Placements | Company-specific prep (Google, Amazon, Microsoft, Meta, Apple), 16-week plan, resume checklist |

### Workspace (per topic)
Eight tabs, all persisted to Supabase:

- **Overview** — definition, complexity table, learning objectives, company frequency
- **Checklist** — 15-item XP-tracked progress checklist
- **Notes** — 5 note types (Personal, Tricks, Mistakes, Revision, Interview), markdown editor with live preview, auto-saved
- **Code Editor** — Monaco Editor in 7 languages: C++, Python, Java, JS, TS, SQL, Markdown — save snippets to DB
- **Practice** — problem tracker with difficulty, status (solved/revise/todo), favorites, and notes
- **Revision / Flashcards** — spaced repetition with 7 intervals (1d to 90d), easy/okay/hard rating, all persisted
- **Resources** — curated and user-added links
- **Interview Prep** — questions with confidence tracking

### Knowledge Graph
- Interactive SVG dependency graph of all 11 DSA topics
- Node states: Completed / Unlocked / Locked — loaded from real checklist data
- Click any node for topic detail and direct workspace link
- Filter by All / Available / Completed

### Roadmaps
Four complete plans: SDE Placement (24 weeks), GATE (52 weeks), ML Engineer (36 weeks), Full Stack (32 weeks). Phased timeline with goals, topics, and projects per phase.

### Profile
- Clerk user info with live stats: problems solved, streak days, projects, XP
- Platform links (GitHub, LeetCode, Codeforces, LinkedIn) persisted to Supabase
- Shareable progress card — canvas-rendered 1080x566 PNG with your stats
  - Share to WhatsApp, Twitter/X, LinkedIn, Instagram (copy), or native mobile share sheet
  - Download as PNG

### Settings
Theme, accent color, Monaco editor theme, font size, daily and weekly study goals — all persisted to Supabase per user.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| DB Client | @supabase/ssr |
| Charts | Recharts |
| Code Editor | Monaco Editor (@monaco-editor/react) |
| Drag and Drop | @hello-pangea/dnd |
| Markdown | react-markdown + remark-gfm |
| Dates | date-fns |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Dashboard
│   ├── tasks/               # Task Manager
│   ├── analytics/           # Analytics
│   ├── dsa/                 # DSA curriculum
│   ├── ai/                  # AI/ML curriculum
│   ├── core-cs/             # Core CS
│   ├── full-stack/          # Full Stack curriculum
│   ├── cp/                  # Competitive Programming
│   ├── programming/         # Language tracks
│   ├── gate/                # GATE prep
│   ├── placements/          # Placement prep
│   ├── roadmap/             # Study roadmaps
│   ├── projects/            # Project ideas
│   ├── resources/           # Resource library
│   ├── graph/               # Knowledge dependency graph
│   ├── workspace/[topicId]  # Per-topic 8-tab workspace
│   ├── track/[trackId]      # Track dashboard
│   ├── profile/             # User profile + share card
│   └── settings/            # Persisted settings
│
├── components/
│   ├── layout/              # AppLayout, Sidebar, Navbar, MobileNav
│   ├── tasks/               # KanbanBoard, TaskList, CreateTaskModal, PomodoroTimer
│   ├── profile/             # ShareProgressCard
│   └── ui/                  # shadcn/ui components
│
├── hooks/
│   ├── useTasks.ts
│   ├── useTopicData.ts
│   ├── useTopicProgress.ts
│   ├── useNotes.ts
│   ├── useCodeSnippets.ts
│   ├── useFlashcards.ts
│   ├── usePracticeProblems.ts
│   ├── useProfile.ts
│   └── useSettings.ts
│
├── data/                    # Static curriculum content (TypeScript)
│   ├── dsa.ts
│   ├── ai-ml.ts
│   ├── core-cs.ts
│   ├── languages.ts
│   ├── projects.ts
│   ├── resources.ts
│   └── roadmaps.ts
│
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   └── utils.ts
│
└── types/
    └── tasks.ts

supabase/
├── schema.sql               # Full database schema (24 tables)
├── migrations/              # Task manager migration
└── seed.sql                 # Initial tracks + topics
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application

### 1. Clone and install

```bash
git clone https://github.com/Sreejith-nair511/Sapientia.git
cd Sapientia
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Set up Supabase

Run in your Supabase SQL editor (in order):

```
supabase/schema.sql
supabase/migrations/*.sql
supabase/seed.sql
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sreejith-nair511/Sapientia)

Connect the repo in Vercel, add the environment variables, and deploy.

---

## Database Schema

| Table | Purpose |
|-------|---------|
| users | Synced from Clerk |
| tracks | Learning tracks |
| topics | Individual topics with metadata |
| tasks | Task manager — full CRUD |
| checklists | Per-user, per-topic XP progress |
| markdown_documents | Saved notes (5 types per topic) |
| code_snippets | Saved code from Monaco editor |
| flashcards | Spaced repetition cards |
| practice_questions | Problem tracker per topic |
| user_settings | Theme, goals, platform links |
| user_xp | XP totals and level |
| streaks | Daily streak tracking |
| project_progress | Project completion tracking |
| resources | Curated and user-added resources |

---

## Contributing

Open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a pull request

---

## License

MIT © [Sreejith Nair](https://github.com/Sreejith-nair511)
