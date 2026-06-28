"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, TASK_CATEGORIES, PRIORITY_CONFIG, STATUS_CONFIG, KanbanColumn } from "@/types/tasks";
import { useSubtasks } from "@/hooks/useTasks";
import {
  CalendarDays, Clock, Tag, X, Plus, CheckCircle2, Circle,
  Trash2, Save, AlignLeft, List, Settings, Timer
} from "lucide-react";

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Task>) => Promise<any>;
  onDelete: (id: string) => void;
}

export function TaskDetailModal({ task, open, onClose, onSave, onDelete }: TaskDetailModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [difficulty, setDifficulty] = useState<Task["difficulty"]>("medium");
  const [status, setStatus] = useState<Task["status"]>("not_started");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [actualMinutes, setActualMinutes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [saving, setSaving] = useState(false);

  const { subtasks, addSubtask, toggleSubtask, deleteSubtask } = useSubtasks(task?.id);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategory(task.category);
      setPriority(task.priority);
      setDifficulty(task.difficulty);
      setStatus(task.status);
      setEstimatedMinutes(task.estimated_minutes?.toString() || "");
      setActualMinutes(task.actual_minutes?.toString() || "");
      setDueDate(task.due_date ? task.due_date.slice(0, 16) : "");
    }
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(task.id, {
      title,
      description,
      category,
      priority,
      difficulty,
      status,
      estimated_minutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
      actual_minutes: actualMinutes ? parseInt(actualMinutes) : undefined,
      due_date: dueDate || undefined,
      completed_at: status === "completed" ? new Date().toISOString() : undefined,
    });
    setSaving(false);
    onClose();
  };

  const completedSubtasks = subtasks.filter(s => s.status === "completed").length;
  const progress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 gap-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="p-5 pb-0 border-b border-zinc-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full" style={{ background: TASK_CATEGORIES[task.category]?.color || "#6366f1" }} />
            <span className="text-xs text-zinc-500">{task.category}</span>
          </div>
          <DialogTitle className="sr-only">Task Details</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full rounded-none border-b border-zinc-800 bg-zinc-950 p-0 h-10">
              {[
                { id: "details", label: "Details", icon: <Settings className="size-3" /> },
                { id: "subtasks", label: `Subtasks (${subtasks.length})`, icon: <List className="size-3" /> },
                { id: "notes", label: "Notes", icon: <AlignLeft className="size-3" /> },
              ].map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 rounded-none h-10 text-xs data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100 text-zinc-500 gap-1.5"
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Details tab */}
            <TabsContent value="details" className="p-5 space-y-4 mt-0">
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="text-lg font-bold bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 focus-visible:ring-0 focus-visible:border-indigo-500"
              />

              <Textarea
                placeholder="Add description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 resize-none text-sm min-h-[80px]"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-medium">Category</label>
                  <Select value={category} onValueChange={(v: string | null) => setCategory(v ?? "Study")}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                      {Object.entries(TASK_CATEGORIES).map(([name, cfg]) => (
                        <SelectItem key={name} value={name} className="text-zinc-300 focus:bg-zinc-800 text-xs">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full" style={{ background: cfg.color }} />
                            {name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-medium">Status</label>
                  <Select value={status} onValueChange={v => setStatus(v as Task["status"])}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <SelectItem key={key} value={key} className="text-zinc-300 focus:bg-zinc-800 text-xs">
                          {cfg.icon} {cfg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-medium">Priority</label>
                  <Select value={priority} onValueChange={v => setPriority(v as Task["priority"])}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                        <SelectItem key={key} value={key} className="text-zinc-300 focus:bg-zinc-800 text-xs">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full" style={{ background: cfg.color }} />
                            {cfg.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-medium">Difficulty</label>
                  <Select value={difficulty} onValueChange={v => setDifficulty(v as Task["difficulty"])}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {["easy", "medium", "hard", "expert"].map(d => (
                        <SelectItem key={d} value={d} className="text-zinc-300 focus:bg-zinc-800 text-xs capitalize">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-medium flex items-center gap-1"><Clock className="size-3" /> Estimated (min)</label>
                  <Input
                    type="number"
                    value={estimatedMinutes}
                    onChange={e => setEstimatedMinutes(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 h-8 text-xs"
                    placeholder="e.g. 60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-medium flex items-center gap-1"><Timer className="size-3" /> Actual (min)</label>
                  <Input
                    type="number"
                    value={actualMinutes}
                    onChange={e => setActualMinutes(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 h-8 text-xs"
                    placeholder="tracked"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium flex items-center gap-1"><CalendarDays className="size-3" /> Due Date</label>
                <Input
                  type="datetime-local"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 h-8 text-xs"
                />
              </div>
            </TabsContent>

            {/* Subtasks tab */}
            <TabsContent value="subtasks" className="p-5 space-y-3 mt-0">
              {/* Progress bar */}
              {subtasks.length > 0 && (
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">{completedSubtasks}/{subtasks.length}</span>
                </div>
              )}

              {/* Add subtask */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add subtask..."
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newSubtask.trim()) {
                      addSubtask(newSubtask.trim());
                      setNewSubtask("");
                    }
                  }}
                  className="bg-zinc-900 border-zinc-800 text-sm flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="border-zinc-700"
                  onClick={() => { if (newSubtask.trim()) { addSubtask(newSubtask.trim()); setNewSubtask(""); } }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              {/* Subtask list */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2.5 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg group">
                    <button onClick={() => toggleSubtask(sub.id, sub.status)}>
                      {sub.status === "completed"
                        ? <CheckCircle2 className="size-4 text-green-400" />
                        : <Circle className="size-4 text-zinc-600 hover:text-indigo-400 transition-colors" />
                      }
                    </button>
                    <span className={`flex-1 text-sm ${sub.status === "completed" ? "line-through text-zinc-500" : "text-zinc-300"}`}>
                      {sub.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(sub.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <p className="text-center text-zinc-600 text-sm py-8">No subtasks yet. Break this task down.</p>
                )}
              </div>
            </TabsContent>

            {/* Notes tab */}
            <TabsContent value="notes" className="p-5 mt-0">
              <Textarea
                placeholder={`Add notes, resources, or code snippets for this task...\n\nTip: Use markdown formatting.`}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 resize-none min-h-[200px] text-sm font-mono"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { onDelete(task.id); onClose(); }}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5"
          >
            <Trash2 className="size-3.5" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-400">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
            >
              <Save className="size-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
