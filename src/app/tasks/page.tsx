"use client";

import { useState, useEffect, useCallback } from "react";
import { useTasks } from "@/hooks/useTasks";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { PomodoroTimer } from "@/components/tasks/pomodoro-timer";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Task, TASK_CATEGORIES, KanbanColumn, PRIORITY_CONFIG } from "@/types/tasks";
import {
  Kanban, List, Calendar, Timer, Plus, SlidersHorizontal,
  CheckCircle2, Clock, Flame, TrendingUp, Target, Zap, Filter, X,
  BookOpen, Code2, Trophy, Brain, GitBranch, Briefcase, Star, RotateCcw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isToday, startOfDay } from "date-fns";

type View = "kanban" | "list" | "timer";

const QUICK_FILTERS = [
  { label: "All",       value: "",          icon: <List className="size-3" /> },
  { label: "Today",     value: "today",     icon: <Zap className="size-3" /> },
  { label: "DSA",       value: "DSA",       icon: <Code2 className="size-3" /> },
  { label: "Study",     value: "Study",     icon: <BookOpen className="size-3" /> },
  { label: "ML",        value: "Machine Learning", icon: <Brain className="size-3" /> },
  { label: "CP",        value: "Competitive Programming", icon: <Trophy className="size-3" /> },
  { label: "Project",   value: "Project",   icon: <GitBranch className="size-3" /> },
  { label: "Placement", value: "Placement", icon: <Briefcase className="size-3" /> },
];

export default function TasksPage() {
  const [view, setView] = useState<View>("kanban");
  const [createOpen, setCreateOpen] = useState(false);
  const [createColumn, setCreateColumn] = useState<KanbanColumn>("backlog");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [quickFilter, setQuickFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showTimer, setShowTimer] = useState(false);

  const filterArg = quickFilter && quickFilter !== "today"
    ? { category: quickFilter }
    : quickFilter === "today"
    ? { kanban_column: "today" }
    : {};

  const { tasks, loading, createTask, updateTask, deleteTask, moveTask, toggleComplete } = useTasks(filterArg as any);

  // Keyboard shortcut: Ctrl+K to create
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCreateOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAddTask = (col: KanbanColumn = "backlog") => {
    setCreateColumn(col);
    setCreateOpen(true);
  };

  // Stats
  const totalTasks = tasks.length;
  const completedToday = tasks.filter(t => t.completed_at && isToday(new Date(t.completed_at))).length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "completed").length;
  const critical = tasks.filter(t => t.priority === "critical" && t.status !== "completed").length;

  const filteredTasks = priorityFilter
    ? tasks.filter(t => t.priority === priorityFilter)
    : tasks;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 tracking-tight">Task Manager</h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 hidden sm:block">Your Engineering Command Center</p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant={showTimer ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTimer(v => !v)}
              className={`gap-1.5 border-zinc-700 h-8 ${showTimer ? "bg-indigo-600 hover:bg-indigo-700 border-transparent" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Timer className="size-3.5" />
              <span className="hidden sm:block">Pomodoro</span>
            </Button>
            <Button
              size="sm"
              onClick={() => handleAddTask("backlog")}
              className="bg-indigo-600 hover:bg-indigo-700 gap-1.5 h-8"
            >
              <Plus className="size-3.5" />
              <span className="hidden xs:inline">New Task</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* ── STAT PILLS — scrollable on mobile ─────────────────── */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { label: "Total",   value: totalTasks,     icon: <List className="size-3" />,        color: "text-zinc-400" },
            { label: "Done",    value: completedToday,  icon: <CheckCircle2 className="size-3" />, color: "text-green-400" },
            { label: "Active",  value: inProgress,     icon: <TrendingUp className="size-3" />,   color: "text-blue-400" },
            { label: "Overdue", value: overdue,         icon: <Clock className="size-3" />,        color: "text-red-400" },
            { label: "Critical",value: critical,        icon: <Flame className="size-3" />,        color: "text-orange-400" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 shrink-0">
              <span className={s.color}>{s.icon}</span>
              <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-zinc-600 hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── FILTERS ROW ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {/* Quick filter pills — horizontal scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
            {QUICK_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setQuickFilter(f.value === quickFilter ? "" : f.value)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium shrink-0 ${
                  quickFilter === f.value
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Select value={priorityFilter} onValueChange={(v: string | null) => setPriorityFilter(v ?? "")}>
              <SelectTrigger className="h-8 w-32 sm:w-36 bg-zinc-900 border-zinc-800 text-zinc-400 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="" className="text-zinc-300 focus:bg-zinc-800 text-xs">All Priorities</SelectItem>
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <SelectItem key={key} value={key} className="text-zinc-300 focus:bg-zinc-800 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              {([
                { id: "kanban", icon: <Kanban className="size-3.5" />,  label: "Kanban" },
                { id: "list",   icon: <List className="size-3.5" />,    label: "List" },
                { id: "timer",  icon: <Timer className="size-3.5" />,   label: "Focus" },
              ] as const).map(v => (
                <Button
                  key={v.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setView(v.id)}
                  className={`h-7 px-2 sm:px-2.5 gap-1.5 text-xs rounded-md transition-all ${
                    view === v.id ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {v.icon}
                  <span className="hidden md:block">{v.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-3 text-zinc-600">
              <div className="size-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p>Loading tasks...</p>
            </div>
          ) : view === "kanban" ? (
            <KanbanBoard
              tasks={filteredTasks}
              onMoveTask={moveTask}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onAddTask={handleAddTask}
              onEditTask={setEditTask}
            />
          ) : view === "list" ? (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onEditTask={setEditTask}
              onAddTask={() => handleAddTask("backlog")}
            />
          ) : (
            /* Focus / Timer View */
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <PomodoroTimer />
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Today's Tasks</h3>
                <div className="space-y-2">
                  {tasks.filter(t => t.kanban_column === "today").map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <button onClick={() => toggleComplete(task)}>
                        {task.status === "completed"
                          ? <CheckCircle2 className="size-4 text-green-400" />
                          : <div className="size-4 rounded-full border-2 border-zinc-600 hover:border-indigo-400 transition-colors" />
                        }
                      </button>
                      <span className={`flex-1 text-sm ${task.status === "completed" ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                        {task.title}
                      </span>
                      {task.estimated_minutes && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="size-3" />
                          {task.estimated_minutes}m
                        </span>
                      )}
                    </div>
                  ))}
                  {tasks.filter(t => t.kanban_column === "today").length === 0 && (
                    <div className="text-center py-8 text-zinc-600 text-sm">
                      No tasks for today. Add some from the Kanban view!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Pomodoro Sidebar — drawer on mobile, panel on desktop */}
        {showTimer && view !== "timer" && (
          <>
            {/* Mobile: bottom sheet overlay */}
            <div className="fixed inset-0 z-50 sm:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowTimer(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4 rounded-t-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Timer className="size-4 text-indigo-400" /> Focus Timer
                  </h3>
                  <Button variant="ghost" size="icon" className="size-7 text-zinc-500" onClick={() => setShowTimer(false)}>
                    <X className="size-3.5" />
                  </Button>
                </div>
                <PomodoroTimer />
              </div>
            </div>
            {/* Desktop: side panel */}
            <div className="hidden sm:flex w-72 border-l border-zinc-800 p-4 bg-zinc-950 overflow-y-auto shrink-0 flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <Timer className="size-4 text-indigo-400" /> Focus Timer
                </h3>
                <Button variant="ghost" size="icon" className="size-6 text-zinc-500" onClick={() => setShowTimer(false)}>
                  <X className="size-3.5" />
                </Button>
              </div>
              <PomodoroTimer />
            </div>
          </>
        )}
      </div>

      {/* ── CREATE TASK MODAL ─────────────────────────────────────── */}
      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createTask}
        defaultColumn={createColumn}
      />

      {/* ── EDIT/DETAIL TASK MODAL ────────────────────────────────── */}
      <TaskDetailModal
        task={editTask}
        open={!!editTask}
        onClose={() => setEditTask(null)}
        onSave={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
