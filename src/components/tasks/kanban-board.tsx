"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task, KANBAN_COLUMNS, TASK_CATEGORIES, PRIORITY_CONFIG, STATUS_CONFIG, KanbanColumn } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Clock, CalendarDays, CheckCircle2, Circle, GripVertical,
  Flame, AlertTriangle, ArrowUp, Minus, MoreHorizontal, Trash2, Pencil
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (id: string, col: KanbanColumn) => void;
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (col: KanbanColumn) => void;
  onEditTask: (task: Task) => void;
}

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  critical: <Flame className="size-3 text-red-400" />,
  high:     <ArrowUp className="size-3 text-orange-400" />,
  medium:   <Minus className="size-3 text-yellow-400" />,
  low:      <Minus className="size-3 text-zinc-500 rotate-90" />,
};

function TaskCard({ task, index, onToggle, onDelete, onEdit }: {
  task: Task; index: number;
  onToggle: (t: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (t: Task) => void;
}) {
  const catCfg = TASK_CATEGORIES[task.category] || TASK_CATEGORIES["Study"];
  const priCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isCompleted = task.status === "completed";
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isCompleted;
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative bg-zinc-900 border rounded-xl p-3.5 mb-2.5 transition-all duration-200
            ${snapshot.isDragging ? "border-indigo-500 shadow-xl shadow-indigo-500/20 rotate-1" : "border-zinc-800 hover:border-zinc-700"}
            ${isCompleted ? "opacity-60" : ""}
          `}
        >
          {/* Top row */}
          <div className="flex items-start gap-2 mb-2">
            {/* Drag handle */}
            <div {...provided.dragHandleProps} className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripVertical className="size-3.5 text-zinc-600" />
            </div>

            {/* Complete toggle */}
            <button onClick={() => onToggle(task)} className="mt-0.5 shrink-0 transition-colors">
              {isCompleted
                ? <CheckCircle2 className="size-4 text-green-400" />
                : <Circle className="size-4 text-zinc-600 hover:text-indigo-400" />
              }
            </button>

            {/* Title */}
            <p className={`flex-1 text-sm font-medium leading-snug ${isCompleted ? "line-through text-zinc-500" : "text-zinc-200"}`}>
              {task.title}
            </p>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center size-6 opacity-0 group-hover:opacity-100 shrink-0 text-zinc-500 hover:text-zinc-200 rounded hover:bg-zinc-800 transition-all">
                  <MoreHorizontal className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 w-36">
                <DropdownMenuItem onClick={() => onEdit(task)} className="text-zinc-300 focus:bg-zinc-800 gap-2">
                  <Pencil className="size-3" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-400 focus:bg-zinc-800 gap-2">
                  <Trash2 className="size-3" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-zinc-500 mb-2.5 ml-[52px] line-clamp-2">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-1.5 ml-[52px] flex-wrap">
            {/* Category dot */}
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <span className="size-1.5 rounded-full shrink-0" style={{ background: catCfg.color }} />
              {task.category}
            </span>

            {/* Priority */}
            <span className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded ${priCfg.bg}`}>
              {PRIORITY_ICONS[task.priority]}
              {priCfg.label}
            </span>

            {/* Due date */}
            {task.due_date && (
              <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${isOverdue ? "text-red-400 bg-red-500/10" : isDueToday ? "text-yellow-400 bg-yellow-500/10" : "text-zinc-500"}`}>
                {isOverdue && <AlertTriangle className="size-3" />}
                <CalendarDays className="size-3" />
                {format(new Date(task.due_date), "MMM d")}
              </span>
            )}

            {/* Est time */}
            {task.estimated_minutes && (
              <span className="flex items-center gap-1 text-xs text-zinc-600">
                <Clock className="size-3" />
                {task.estimated_minutes >= 60
                  ? `${Math.floor(task.estimated_minutes / 60)}h${task.estimated_minutes % 60 > 0 ? ` ${task.estimated_minutes % 60}m` : ""}`
                  : `${task.estimated_minutes}m`}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function KanbanBoard({ tasks, onMoveTask, onToggleComplete, onDeleteTask, onAddTask, onEditTask }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    onMoveTask(draggableId, destination.droppableId as KanbanColumn);
  };

  const getColumnTasks = (col: KanbanColumn) => tasks.filter(t => t.kanban_column === col);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[500px] snap-x snap-mandatory sm:snap-none">
        {KANBAN_COLUMNS.map(col => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-[280px] sm:w-72 snap-start">
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-3 pb-2.5 border-b-2 ${col.color}`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-zinc-200">{col.label}</h3>
                  <span className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5 font-mono">
                    {colTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-zinc-500 hover:text-zinc-200"
                  onClick={() => onAddTask(col.id)}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] sm:min-h-[500px] rounded-xl p-2 transition-colors ${snapshot.isDraggingOver ? "bg-indigo-500/5 border border-dashed border-indigo-500/30" : "bg-transparent"}`}
                  >
                    {colTasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onToggle={onToggleComplete}
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                      />
                    ))}
                    {provided.placeholder}

                    {/* Empty state */}
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <button
                        onClick={() => onAddTask(col.id)}
                        className="w-full mt-2 p-4 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="size-3.5" /> Add task
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
