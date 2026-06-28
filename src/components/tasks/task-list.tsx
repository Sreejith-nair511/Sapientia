"use client";

import { useState } from "react";
import { Task, TASK_CATEGORIES, PRIORITY_CONFIG, STATUS_CONFIG } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2, Circle, Clock, CalendarDays, ChevronDown, ChevronRight,
  Plus, Search, AlertTriangle, Trash2, Pencil, MoreHorizontal, Tag
} from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onAddTask: () => void;
}

function formatDue(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return { label: "Today", color: "text-yellow-400" };
  if (isTomorrow(d)) return { label: "Tomorrow", color: "text-blue-400" };
  if (isPast(d)) return { label: `${format(d, "MMM d")} (Overdue)`, color: "text-red-400" };
  return { label: format(d, "MMM d"), color: "text-zinc-400" };
}

function TaskRow({ task, onToggle, onDelete, onEdit, depth = 0 }: {
  task: Task; depth?: number;
  onToggle: (t: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (t: Task) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const catCfg = TASK_CATEGORIES[task.category] || TASK_CATEGORIES["Study"];
  const priCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isCompleted = task.status === "completed";
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isCompleted;
  const dueInfo = task.due_date ? formatDue(task.due_date) : null;

  return (
    <>
      <div
        className={`group flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors ${isCompleted ? "opacity-60" : ""}`}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
        {/* Expand toggle for subtasks */}
        {hasSubtasks ? (
          <button onClick={() => setExpanded(v => !v)} className="text-zinc-500 hover:text-zinc-300 shrink-0">
            {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        ) : (
          <span className="size-3.5 shrink-0" />
        )}

        {/* Complete toggle */}
        <button onClick={() => onToggle(task)} className="shrink-0">
          {isCompleted
            ? <CheckCircle2 className="size-4 text-green-400" />
            : <Circle className="size-4 text-zinc-600 hover:text-indigo-400 transition-colors" />
          }
        </button>

        {/* Category dot */}
        <span className="size-2 rounded-full shrink-0" style={{ background: catCfg.color }} />

        {/* Title */}
        <span className={`flex-1 text-sm font-medium ${isCompleted ? "line-through text-zinc-500" : "text-zinc-200"}`}>
          {task.title}
        </span>

        {/* Meta: only show on hover or always */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {/* Overdue indicator */}
          {isOverdue && <AlertTriangle className="size-3.5 text-red-400" />}

          {/* Category */}
          <span className="text-xs text-zinc-500 hidden md:block">{task.category}</span>

          {/* Priority badge */}
          <span className={`text-xs px-1.5 py-0.5 rounded ${priCfg.bg} hidden sm:block`}>
            {priCfg.label}
          </span>

          {/* Due date */}
          {dueInfo && (
            <span className={`flex items-center gap-1 text-xs ${dueInfo.color}`}>
              <CalendarDays className="size-3" />
              {dueInfo.label}
            </span>
          )}

          {/* Estimated time */}
          {task.estimated_minutes && (
            <span className="flex items-center gap-1 text-xs text-zinc-500 hidden md:flex">
              <Clock className="size-3" />
              {task.estimated_minutes >= 60
                ? `${Math.floor(task.estimated_minutes / 60)}h`
                : `${task.estimated_minutes}m`}
            </span>
          )}

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center size-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-800 transition-all">
              <MoreHorizontal className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 w-36">
              <DropdownMenuItem onClick={() => onEdit(task)} className="text-zinc-300 focus:bg-zinc-800 gap-2">
                <Pencil className="size-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-400 focus:bg-zinc-800 gap-2">
                <Trash2 className="size-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Subtasks */}
      {expanded && hasSubtasks && task.subtasks!.map(sub => (
        <TaskRow key={sub.id} task={sub} depth={depth + 1} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </>
  );
}

export function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask, onAddTask }: TaskListProps) {
  const [search, setSearch] = useState("");

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filtered.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
      {/* Search + Add row */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-8 bg-zinc-900 border-zinc-800 text-zinc-300 text-sm focus-visible:ring-indigo-500"
          />
        </div>
        <Button size="sm" onClick={onAddTask} className="bg-indigo-600 hover:bg-indigo-700 h-8 gap-1.5">
          <Plus className="size-3.5" /> New Task
        </Button>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900/30">
        <span className="size-3.5 shrink-0" />
        <span className="size-4 shrink-0" />
        <span className="size-2 shrink-0" />
        <span className="flex-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">Task</span>
        <div className="flex items-center gap-3 ml-auto shrink-0 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <span className="hidden md:block w-20 text-right">Category</span>
          <span className="hidden sm:block w-16 text-right">Priority</span>
          <span className="w-20 text-right">Due</span>
          <span className="hidden md:flex w-12 text-right">Time</span>
          <span className="w-6" />
        </div>
      </div>

      {/* Tasks by category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-600">
          <CheckCircle2 className="size-10 opacity-30" />
          <p className="text-sm">No tasks yet</p>
          <Button size="sm" onClick={onAddTask} variant="outline" className="border-zinc-700 text-zinc-400 h-8 gap-1.5">
            <Plus className="size-3.5" /> Add your first task
          </Button>
        </div>
      ) : (
        Object.entries(grouped).map(([category, catTasks]) => {
          const catCfg = TASK_CATEGORIES[category] || TASK_CATEGORIES["Study"];
          const completedCount = catTasks.filter(t => t.status === "completed").length;
          return (
            <div key={category}>
              {/* Group header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 border-b border-zinc-800">
                <span className="size-2 rounded-full" style={{ background: catCfg.color }} />
                <span className="text-xs font-semibold text-zinc-400">{category}</span>
                <span className="text-xs text-zinc-600 font-mono">{completedCount}/{catTasks.length}</span>
              </div>
              {catTasks.map(task => (
                <TaskRow key={task.id} task={task} onToggle={onToggleComplete} onDelete={onDeleteTask} onEdit={onEditTask} />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
