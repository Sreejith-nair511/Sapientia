<div align="center">

<img src="public/next.svg" alt="Sapientia" width="60" />

# Sapientia — Engineering OS

**Master Engineering. One Day at a Time.**

A full-stack, AI-era study operating system built for CS/engineering students targeting placements, GATE, ML roles, and full-stack development. Dark-themed, fast, and built to replace scattered Notion docs, random YouTube playlists, and forgotten LeetCode streaks.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)](https://clerk.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](https://engineering-os.vercel.app) · [Report Bug](https://github.com/Sreejith-nair511/Sapientia/issues) · [Request Feature](https://github.com/Sreejith-nair511/Sapientia/issues)

</div>

---

## ✨ What is Sapientia?

Sapientia is a **personal engineering study OS** — a single app that replaces the fragmented mess of tabs, spreadsheets, and todo lists most students use to prepare for placements, GATE, or senior engineering roles.

It combines:
- 📚 A **full curriculum** (DSA, AI/ML, Core CS, Full Stack, Competitive Programming, GATE)
- 🗂️ A **task manager** with Kanban, Pomodoro timer, and analytics
- 🧠 A **workspace** per topic — notes, code editor, flashcards, practice tracker
- 📊 A **dashboard** with heatmaps, radar charts, and streak tracking
- 🚀 A **profile** with shareable progress cards for LinkedIn, WhatsApp, Twitter, Instagram

---

## 🖼️ Screenshots

> Dashboard · Task Manager · DSA Workspace · Knowledge Graph

| Dashboard | Task Manager |
|-----------|-------------|
| ![Dashboard](https://placehold.co/600x340/09090b/6366f1?text=Dashboard) | ![Tasks](https://placehold.co/600x340/09090b/6366f1?text=Task+Manager) |

| DSA Topics | Workspace |
|------------|-----------|
| ![DSA](https://placehold.co/600x340/09090b/6366f1?text=DSA+Topics) | ![Workspace](https://placehold.co/600x340/09090b/6366f1?text=Workspace) |

---

## 🚀 Features

### 📊 Dashboard
- Greeting with today's date
- Today's task focus list pulled from Supabase
- Study stopwatch (session timer)
- Skill mastery radar chart
- 7-day activity area chart
- 30-day contribution heatmap
- Quick-access grid to all curriculum sections

### ✅ Task Manager
- **Kanban board** (Backlog → Today → In Progress → Review → Completed)
- **List view** with search, filters, category grouping
- **Focus/Pomodoro view** — 25/5/15 min timer with AudioContext beep
- Full CRUD: title, description, category (20 options), priority, difficulty, due date, tags, estimated time
- Subtasks, task notes, drag-and-drop reordering

### 📈 Analytics
- Stats cards: total tasks, completed today, overdue, estimated vs actual hours
- Skill radar, 14-day area chart, tasks-by-category bar chart
- Priority breakdown, 30-day activity heatmap
- All powered by real Supabase data

### 🧩 Curriculum (Static + Workspace)

| Section | Topics |
|---------|--------|
| **DSA** | 11 topics (Arrays → DP → Backtracking), 70+ LeetCode problems with links |
| **AI / ML** | 6 modules (Math, Classical ML, Deep Learning, GenAI/LLMs, CV, NLP) |
| **Core CS** | OS, DBMS, Networks, OOP/SOLID, System Design, Linux |
| **Full Stack** | HTML/CSS, JS, TS, React 19, Next.js 15, Node, Databases, Auth, DevOps |
| **Competitive Programming** | Number Theory, Advanced DP, Graphs, Strings, Combinatorics + C++ templates |
| **Programming Languages** | C++ (68 lessons), Python (72), Java, JavaScript, TypeScript |
| **GATE** | 10 subjects with chapter breakdowns, weightage, and strategy tips |
| **Placements** | Company-specific prep (Google, Amazon, Microsoft, Meta, Apple), 16-week plan, resume checklist |

### 🖥️ Workspace (per topic)
8 tabs, all persisted to Supabase:
- **Overview** — definition, complexity table, learning objectives, company frequency
- **Checklist** — 15-item XP-tracked progress checklist (280 XP per topic mastered)
- **Notes** — 5 note types (Personal, Tricks, Mistakes, Revision, Interview) — markdown editor + live preview, auto-saved
- **Code Editor** — Monaco Editor (7 languages: C++, Python, Java, JS, TS, SQL, Markdown) — save snippets to DB
- **Practice** — problem tracker (add/edit/delete), difficulty badges, status (solved/revise/todo), favorites
- **Revision / Flashcards** — spaced repetition with 7 intervals (1d → 90d), easy/okay/hard rating, persisted to DB
- **Resources** — curated + user-added resource list
- **Interview Prep** — 4 hardcoded questions with confidence tracking

### 🗺️ Knowledge Graph
- Interactive SVG dependency graph of all 11 DSA topics
- Node states: Completed (green) / Unlocked (indigo) / Locked (grey)
- Click any node for topic detail panel + "Open Workspace" button
- Progress loaded from real checklist data in Supabase
- Filter by: All / Available / Completed

### 🛤️ Roadmaps
- 4 complete roadmaps: SDE Placement (24wk), GATE (52wk), ML Engineer (36wk), Full Stack (32wk)
- Phased timeline view with goals, topics, and projects per phase

### 👤 Profile
- Clerk-powered user info (name, avatar, email)
- Live stats: problems solved, streak days, projects, XP
- Platform links: GitHub, LeetCode, Codeforces, LinkedIn — persisted to Supabase
- **Shareable progress card** — canvas-rendered 1080×566px image card with your stats
  - Share to WhatsApp, Twitter/X, LinkedIn, Instagram (copy), native mobile share sheet
  - Download as PNG

### ⚙️ Settings
- Theme: Dark / Light / System — persisted
- Accent color (7 options) — persisted
- Monaco editor theme + font size — persisted
- Daily and weekly study goals — persisted
- All settings saved to Supabase `user_settings`

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| ORM/Client | `@supabase/ssr` |
| Charts | Recharts |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Drag & Drop | `@hello-pangea/dnd` |
| Animations | Framer Motion |
| Markdown | `react-markdown` + `remark-gfm` |
| Dates | `date-fns` |
| Icons | Lucide React |

---

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── tasks/              # Task Manager (Kanban + List + Focus)
│   ├── analytics/          # Analytics dashboard
│   ├── dsa/                # DSA curriculum
│   ├── ai/                 # AI/ML curriculum
│   ├── core-cs/            # Core CS (OS, DBMS, etc.)
│   ├── full-stack/         # Full Stack curriculum
│   ├── cp/                 # Competitive Programming
│   ├── programming/        # Language tracks
│   ├── gate/               # GATE prep
│   ├── placements/         # Placement prep
│   ├── roadmap/            # Study roadmaps
│   ├── projects/           # Project ideas
│   ├── resources/          # Resource library
│   ├── graph/              # Knowledge dependency graph
│   ├── workspace/[topicId] # Per-topic 8-tab workspace
│   ├── track/[trackId]     # Track dashboard
│   ├── profile/            # User profile + share card
│   └── settings/           # Persisted settings
│
├── components/
│   ├── layout/             # AppLayout, Sidebar, Navbar, MobileNav
│   ├── tasks/              # KanbanBoard, TaskList, CreateTaskModal, PomodoroTimer
│   ├── profile/            # ShareProgressCard (canvas share)
│   └── ui/                 # shadcn/ui components
│
├── hooks/
│   ├── useTasks.ts         # Task CRUD + subtasks
│   ├── useTopicData.ts     # Topic fetch by slug
│   ├── useTopicProgress.ts # Checklist CRUD
│   ├── useNotes.ts         # Auto-save markdown notes
│   ├── useCodeSnippets.ts  # Save/load code snippets
│   ├── useFlashcards.ts    # Flashcard CRUD + spaced repetition
│   ├── usePracticeProblems.ts # Problem tracker CRUD
│   ├── useProfile.ts       # Profile stats + platform links
│   └── useSettings.ts      # Persisted user settings
│
├── data/                   # Static curriculum content (TypeScript)
│   ├── dsa.ts              # 11 DSA topics, 70+ LeetCode problems
│   ├── ai-ml.ts            # 6 AI/ML modules
│   ├── core-cs.ts          # 6 Core CS subjects
│   ├── languages.ts        # 5 language tracks
│   ├── projects.ts         # 10 project ideas
│   ├── resources.ts        # 24 curated resources
│   └── roadmaps.ts         # 4 study roadmaps
│
├── lib/
│   ├── supabase.ts         # Browser Supabase client
│   ├── supabase-server.ts  # Server Supabase client
│   └── utils.ts            # cn() utility
│
└── types/
    └── tasks.ts            # Task/Status/Priority types

supabase/
├── schema.sql              # Full database schema (24 tables)
├── migrations/             # Task manager migration
└── seed.sql                # Initial tracks + topics seed data
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application

### 1. Clone the repo

```bash
git clone https://github.com/Sreejith-nair511/Sapientia.git
cd Sapientia
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Set up Supabase

Run the schema and seed files in your Supabase SQL editor (in order):

```
supabase/schema.sql          ← creates all 24 tables
supabase/migrations/*.sql    ← task manager tables
supabase/seed.sql            ← sample tracks + topics
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sreejith-nair511/Sapientia)

1. Fork / clone the repo
2. Create a new Vercel project from the fork
3. Add all environment variables in Vercel project settings
4. Deploy — it just works

---

## 🗄️ Database Schema (overview)

| Table | Purpose |
|-------|---------|
| `users` | Synced from Clerk — name, email, avatar |
| `tracks` | Learning tracks (DSA, Full Stack, etc.) |
| `topics` | Individual topics with metadata |
| `tasks` | Task manager — full CRUD |
| `checklists` | Per-user, per-topic XP progress |
| `markdown_documents` | Saved notes (5 types per topic) |
| `code_snippets` | Saved code from Monaco editor |
| `flashcards` | Spaced repetition cards with review schedule |
| `practice_questions` | Problem tracker per topic |
| `user_settings` | Theme, goals, platform links |
| `user_xp` | XP totals + level |
| `streaks` | Daily streak tracking |
| `project_progress` | Project completion tracking |
| `resources` | Curated + user-added resources |
| `revision_schedule` | Spaced repetition schedule |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © [Sreejith Nair](https://github.com/Sreejith-nair511)

---

<div align="center">
Built with ❤️ using Next.js, Supabase, and Clerk
</div>
