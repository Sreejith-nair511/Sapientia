"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TASK_CATEGORIES, PRIORITY_CONFIG, KanbanColumn } from "@/types/tasks";
import { CalendarDays, Clock, Flag, Tag, X, Plus } from "lucide-react";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => Promise<any>;
  defaultColumn?: KanbanColumn;
}

export function CreateTaskModal({ open, onClose, onSubmit, defaultColumn = 'backlog' }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [difficulty, setDifficulty] = useState<Task["difficulty"]>("medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    await onSubmit({
      title: title.trim(),
      description,
      category,
      priority,
      difficulty,
      estimated_minutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
      due_date: dueDate || undefined,
      kanban_column: defaultColumn,
      status: 'not_started',
      is_recurring: false,
      order_index: 0,
    });
    // Reset
    setTitle(""); setDescription(""); setCategory("Study"); setPriority("medium");
    setDifficulty("medium"); setEstimatedMinutes(""); setDueDate(""); setTags([]);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-800">
          <DialogTitle className="text-lg font-semibold text-zinc-100">Create New Task</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <Input
            autoFocus
            placeholder="Task title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            className="text-lg font-medium bg-transparent border-0 border-b border-zinc-700 rounded-none px-0 focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-zinc-600"
          />

          {/* Description */}
          <Textarea
            placeholder="Add description... (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-300 resize-none min-h-[80px] focus-visible:ring-indigo-500"
          />

          {/* Category + Priority + Difficulty */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</label>
              <Select value={category} onValueChange={(v: string | null) => setCategory(v ?? "Study")}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                  {Object.entries(TASK_CATEGORIES).map(([name, cfg]) => (
                    <SelectItem key={name} value={name} className="text-zinc-300 focus:bg-zinc-800">
                      <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: cfg.color }} />
                        {name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Priority</label>
              <Select value={priority} onValueChange={v => setPriority(v as Task["priority"])}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key} className="text-zinc-300 focus:bg-zinc-800">
                      <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: cfg.color }} />
                        {cfg.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Difficulty</label>
              <Select value={difficulty} onValueChange={v => setDifficulty(v as Task["difficulty"])}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {["easy", "medium", "hard", "expert"].map(d => (
                    <SelectItem key={d} value={d} className="text-zinc-300 focus:bg-zinc-800 capitalize">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="size-3" /> Estimated Time (minutes)
              </label>
              <Input
                type="number"
                placeholder="e.g. 60"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="size-3" /> Due Date
              </label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="size-3" /> Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(t => (
                <Badge key={t} className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 gap-1">
                  {t}
                  <button onClick={() => setTags(prev => prev.filter(x => x !== t))}>
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 h-8 text-sm focus-visible:ring-indigo-500"
              />
              <Button size="sm" variant="outline" onClick={addTag} className="border-zinc-700 h-8 px-2">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center">
          <p className="text-xs text-zinc-600">Press Enter to create quickly</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!title.trim() || submitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {submitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
