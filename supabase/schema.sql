-- ============================================================
-- ENGINEERING OS v2 — COMPLETE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS & PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    github_username TEXT,
    leetcode_username TEXT,
    codeforces_handle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. STREAKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    total_active_days INTEGER DEFAULT 0
);

-- ============================================================
-- 3. USER XP & GAMIFICATION
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_xp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    rank TEXT DEFAULT 'Novice', -- 'Novice', 'Apprentice', 'Engineer', 'Senior', 'Principal', 'Staff', 'Fellow'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TRACKS (Broad areas: DSA, Full Stack, AI, Core CS, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TOPICS (Arrays, Binary Search, React, Docker, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    definition TEXT,
    why_it_exists TEXT,
    real_world_usage TEXT,
    complexity_notes TEXT,
    estimated_hours INTEGER,
    difficulty TEXT DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard', 'Expert'
    importance TEXT DEFAULT 'High', -- 'Low', 'Medium', 'High', 'Critical'
    company_frequency TEXT[], -- ['Google', 'Amazon', 'Meta', ...]
    learning_objectives TEXT[],
    order_index INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. TOPIC DEPENDENCIES (Knowledge Graph)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.topic_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prerequisite_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    dependent_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    UNIQUE(prerequisite_id, dependent_id)
);

-- ============================================================
-- 7. SUBTOPICS (under each topic)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subtopics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_md TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. USER TOPIC PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_topic_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started', -- 'not_started', 'learning', 'practicing', 'revising', 'mastered'
    mastery_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'expert'
    confidence_score INTEGER DEFAULT 0, -- 0-100
    completion_percentage REAL DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_opened TIMESTAMPTZ,
    UNIQUE(user_id, topic_id)
);

-- ============================================================
-- 9. LEARNING SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    session_type TEXT DEFAULT 'study' -- 'study', 'practice', 'revision', 'project'
);

-- ============================================================
-- 10. CHECKLISTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    item_key TEXT NOT NULL, -- 'theory', 'watch_playlist', 'read_docs', 'easy_problems', 'medium_problems', 'hard_problems', 'revision_1', 'revision_2', 'revision_3', 'interview_prep', 'mini_project', 'full_project', 'contest', 'mastered'
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, topic_id, item_key)
);

-- ============================================================
-- 11. MARKDOWN DOCUMENTS (Notes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.markdown_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL, -- 'personal_notes', 'tricks', 'mistakes', 'revision', 'interview_prep', 'summary'
    title TEXT NOT NULL DEFAULT 'Untitled',
    content_md TEXT DEFAULT '',
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic_id, doc_type)
);

-- ============================================================
-- 12. CODE SNIPPETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    language TEXT NOT NULL, -- 'cpp', 'python', 'java', 'javascript', 'typescript', 'sql', 'markdown'
    code TEXT NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- 'documentation', 'book', 'youtube', 'article', 'github', 'paper', 'cheatsheet', 'blog'
    url TEXT,
    author TEXT,
    description TEXT,
    is_free BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'bookmarked', -- 'completed', 'watching', 'bookmarked', 'skipped'
    rating INTEGER, -- 1-5
    UNIQUE(user_id, resource_id)
);

-- ============================================================
-- 14. PRACTICE QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.practice_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    problem_name TEXT NOT NULL,
    difficulty TEXT, -- 'Easy', 'Medium', 'Hard'
    platform TEXT, -- 'LeetCode', 'Codeforces', 'AtCoder', 'CodeChef', 'Custom'
    problem_url TEXT,
    striver_link TEXT,
    neetcode_link TEXT,
    status TEXT DEFAULT 'attempted', -- 'attempted', 'solved', 'skipped'
    is_favorite BOOLEAN DEFAULT false,
    revision_required BOOLEAN DEFAULT false,
    time_taken_minutes INTEGER,
    acceptance_rate REAL,
    company_tags TEXT[],
    personal_notes TEXT,
    personal_solution_md TEXT,
    optimal_solution_md TEXT,
    mistakes_made TEXT,
    solved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic_id, problem_name)
);

-- ============================================================
-- 15. FLASHCARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    confidence INTEGER DEFAULT 0, -- 0=new, 1=hard, 2=ok, 3=easy
    next_review_date DATE,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. REVISION SCHEDULE (Spaced Repetition)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.revision_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    next_review_date DATE NOT NULL,
    review_level INTEGER DEFAULT 1, -- 1=1d, 2=3d, 3=7d, 4=15d, 5=30d, 6=60d, 7=90d
    is_missed BOOLEAN DEFAULT false,
    last_reviewed_at TIMESTAMPTZ,
    UNIQUE(user_id, topic_id)
);

-- ============================================================
-- 17. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- 'Beginner', 'Intermediate', 'Advanced', 'Research', 'Startup', 'Hackathon'
    tech_stack TEXT[],
    github_url TEXT,
    live_url TEXT,
    architecture_notes TEXT,
    status TEXT DEFAULT 'planning', -- 'planning', 'in_progress', 'completed', 'paused'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    milestone TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.topic_project_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    UNIQUE(topic_id, project_id)
);

-- ============================================================
-- 18. GOALS & TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active', -- 'active', 'achieved', 'abandoned'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    task_date DATE NOT NULL,
    title TEXT NOT NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    task_type TEXT, -- 'study', 'practice', 'revision', 'project', 'reading'
    is_completed BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 10,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, task_date, title)
);

CREATE TABLE IF NOT EXISTS public.weekly_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.monthly_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    month_start_date DATE NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false
);

-- ============================================================
-- 19. ACHIEVEMENTS & BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT, -- 'Practice', 'Streak', 'Project', 'Research', 'Speed', 'Mastery'
    xp_reward INTEGER DEFAULT 50
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ============================================================
-- 20. BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 21. HISTORY / ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'topic', 'problem', 'note', 'project', 'resource'
    entity_id UUID,
    entity_title TEXT,
    action TEXT NOT NULL, -- 'opened', 'completed', 'bookmarked', 'solved', 'revised'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 22. ANALYTICS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    study_minutes INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    topics_completed INTEGER DEFAULT 0,
    notes_written INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    UNIQUE(user_id, log_date)
);

-- ============================================================
-- 23. USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'dark', -- 'light', 'dark', 'system'
    accent_color TEXT DEFAULT '#6366f1',
    editor_theme TEXT DEFAULT 'vs-dark',
    editor_font_size INTEGER DEFAULT 14,
    revision_frequency TEXT DEFAULT 'standard', -- 'aggressive', 'standard', 'relaxed'
    daily_goal_minutes INTEGER DEFAULT 120,
    weekly_goal_hours INTEGER DEFAULT 20,
    notification_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 24. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info', -- 'info', 'revision_due', 'achievement', 'challenge'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED: DEFAULT BADGES
-- ============================================================
INSERT INTO public.badges (name, description, category, xp_reward) VALUES
  ('First Step', 'Complete your first topic', 'Mastery', 50),
  ('Problem Solver', 'Solve 100 problems', 'Practice', 200),
  ('Grinder', 'Solve 500 problems', 'Practice', 500),
  ('LeetCode Master', 'Solve 1000 problems', 'Practice', 1000),
  ('7 Day Streak', 'Study for 7 consecutive days', 'Streak', 100),
  ('30 Day Streak', 'Study for 30 consecutive days', 'Streak', 500),
  ('100 Day Streak', 'Study for 100 consecutive days', 'Streak', 2000),
  ('Project Builder', 'Complete your first project', 'Project', 150),
  ('Open Source', 'Make your first GitHub contribution', 'Project', 200),
  ('Research Reader', 'Read your first research paper', 'Research', 100),
  ('Note Taker', 'Write notes for 10 topics', 'Mastery', 100),
  ('Speedrunner', 'Solve a medium problem in under 15 minutes', 'Speed', 150)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

























-- Public read access for content tables








































