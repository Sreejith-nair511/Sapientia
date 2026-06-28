-- ============================================================
-- ENGINEERING TASK MANAGER — SCHEMA MIGRATION
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- Task categories lookup
CREATE TABLE IF NOT EXISTS public.task_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL
);

INSERT INTO public.task_categories (name, color, icon) VALUES
  ('Study', '#6366f1', 'BookOpen'),
  ('DSA', '#10b981', 'Code2'),
  ('Competitive Programming', '#f59e0b', 'Trophy'),
  ('Programming Language', '#3b82f6', 'Terminal'),
  ('Machine Learning', '#8b5cf6', 'Brain'),
  ('Deep Learning', '#ec4899', 'Layers'),
  ('Computer Vision', '#14b8a6', 'Eye'),
  ('NLP', '#f97316', 'MessageSquare'),
  ('Research', '#06b6d4', 'FlaskConical'),
  ('Open Source', '#84cc16', 'GitBranch'),
  ('Project', '#a855f7', 'FolderKanban'),
  ('Hackathon', '#ef4444', 'Zap'),
  ('Placement', '#0ea5e9', 'Briefcase'),
  ('GATE', '#f43f5e', 'GraduationCap'),
  ('Resume', '#d97706', 'FileText'),
  ('Interview', '#dc2626', 'Users'),
  ('Reading', '#65a30d', 'BookMarked'),
  ('Documentation', '#0891b2', 'FileCode'),
  ('Revision', '#7c3aed', 'RefreshCw'),
  ('Personal', '#6b7280', 'User')
ON CONFLICT (name) DO NOTHING;

-- Main tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,  -- For subtasks
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Study',
    status TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'completed', 'paused', 'cancelled', 'recurring'
    priority TEXT DEFAULT 'medium',     -- 'critical', 'high', 'medium', 'low'
    difficulty TEXT DEFAULT 'medium',   -- 'easy', 'medium', 'hard', 'expert'
    estimated_minutes INTEGER,
    actual_minutes INTEGER,
    due_date TIMESTAMPTZ,
    reminder_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    -- Recurring config
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,  -- 'daily', 'weekly', 'monthly', 'custom'
    recurrence_days INTEGER[], -- e.g. [1,3,5] for Mon/Wed/Fri
    -- Ordering
    order_index INTEGER DEFAULT 0,
    kanban_column TEXT DEFAULT 'backlog',  -- 'backlog', 'today', 'in_progress', 'review', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task tags (many-to-many via join table)
CREATE TABLE IF NOT EXISTS public.task_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    UNIQUE(task_id, tag_name)
);

-- Task dependencies
CREATE TABLE IF NOT EXISTS public.task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prerequisite_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    dependent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    UNIQUE(prerequisite_task_id, dependent_task_id)
);

-- Task notes (separate from main description, richer)
CREATE TABLE IF NOT EXISTS public.task_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    content_md TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study sessions (Pomodoro timer logs)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    session_type TEXT DEFAULT 'focus',  -- 'focus', 'short_break', 'long_break'
    duration_minutes INTEGER NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    notes TEXT
);

-- Task history / audit log
CREATE TABLE IF NOT EXISTS public.task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    field_changed TEXT,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones for projects
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant anonymous access for dev (no RLS for now)
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_categories DISABLE ROW LEVEL SECURITY;
