export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'recurring';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type KanbanColumn = 'backlog' | 'today' | 'in_progress' | 'review' | 'completed';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Task {
  id: string;
  user_id: string;
  parent_task_id?: string;
  title: string;
  description?: string;
  category: string;
  status: TaskStatus;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  estimated_minutes?: number;
  actual_minutes?: number;
  due_date?: string;
  reminder_at?: string;
  completed_at?: string;
  topic_id?: string;
  project_id?: string;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  order_index: number;
  kanban_column: KanbanColumn;
  created_at: string;
  updated_at: string;
  // Relations loaded separately
  subtasks?: Task[];
  tags?: string[];
}

export interface TaskCategory {
  name: string;
  color: string;
  icon: string;
}

export const TASK_CATEGORIES: Record<string, { color: string; icon: string }> = {
  'Study':                  { color: '#6366f1', icon: 'BookOpen' },
  'DSA':                    { color: '#10b981', icon: 'Code2' },
  'Competitive Programming':{ color: '#f59e0b', icon: 'Trophy' },
  'Programming Language':   { color: '#3b82f6', icon: 'Terminal' },
  'Machine Learning':       { color: '#8b5cf6', icon: 'Brain' },
  'Deep Learning':          { color: '#ec4899', icon: 'Layers' },
  'Computer Vision':        { color: '#14b8a6', icon: 'Eye' },
  'NLP':                    { color: '#f97316', icon: 'MessageSquare' },
  'Research':               { color: '#06b6d4', icon: 'FlaskConical' },
  'Open Source':            { color: '#84cc16', icon: 'GitBranch' },
  'Project':                { color: '#a855f7', icon: 'FolderKanban' },
  'Hackathon':              { color: '#ef4444', icon: 'Zap' },
  'Placement':              { color: '#0ea5e9', icon: 'Briefcase' },
  'GATE':                   { color: '#f43f5e', icon: 'GraduationCap' },
  'Resume':                 { color: '#d97706', icon: 'FileText' },
  'Interview':              { color: '#dc2626', icon: 'Users' },
  'Reading':                { color: '#65a30d', icon: 'BookMarked' },
  'Documentation':          { color: '#0891b2', icon: 'FileCode' },
  'Revision':               { color: '#7c3aed', icon: 'RefreshCw' },
  'Personal':               { color: '#6b7280', icon: 'User' },
};

export const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'bg-red-500/10 text-red-500', dot: 'bg-red-500' },
  high:     { label: 'High',     color: '#f97316', bg: 'bg-orange-500/10 text-orange-500', dot: 'bg-orange-500' },
  medium:   { label: 'Medium',   color: '#f59e0b', bg: 'bg-yellow-500/10 text-yellow-600', dot: 'bg-yellow-500' },
  low:      { label: 'Low',      color: '#6b7280', bg: 'bg-zinc-500/10 text-zinc-500', dot: 'bg-zinc-400' },
};

export const STATUS_CONFIG = {
  not_started: { label: 'Not Started', icon: '○', color: 'text-zinc-400' },
  in_progress: { label: 'In Progress', icon: '◐', color: 'text-blue-400' },
  completed:   { label: 'Completed',   icon: '✓', color: 'text-green-400' },
  paused:      { label: 'Paused',      icon: '⏸', color: 'text-yellow-400' },
  cancelled:   { label: 'Cancelled',   icon: '✕', color: 'text-red-400' },
  recurring:   { label: 'Recurring',   icon: '🔁', color: 'text-purple-400' },
};

export const KANBAN_COLUMNS: { id: KanbanColumn; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',     color: 'border-zinc-600' },
  { id: 'today',       label: 'Today',       color: 'border-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-yellow-500' },
  { id: 'review',      label: 'Review',      color: 'border-purple-500' },
  { id: 'completed',   label: 'Completed',   color: 'border-green-500' },
];
