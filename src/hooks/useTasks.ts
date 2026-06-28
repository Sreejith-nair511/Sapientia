"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Task, TaskStatus, KanbanColumn } from "@/types/tasks";
import { useUser } from "@clerk/nextjs";

export function useTasks(filters?: { category?: string; status?: string; priority?: string; kanban_column?: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const supabase = createClient();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .is("parent_task_id", null) // top-level only
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.priority) query = query.eq("priority", filters.priority);
    if (filters?.kanban_column) query = query.eq("kanban_column", filters.kanban_column);

    const { data } = await query;
    setTasks(data || []);
    setLoading(false);
  }, [user, filters?.category, filters?.status, filters?.priority, filters?.kanban_column]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (taskData: Partial<Task>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...taskData, user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      setTasks(prev => [data, ...prev]);
    }
    return data;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setTasks(prev => prev.map(t => t.id === id ? data : t));
    }
    return data;
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = async (id: string, column: KanbanColumn) => {
    await updateTask(id, { kanban_column: column, status: column === 'completed' ? 'completed' : column === 'in_progress' ? 'in_progress' : 'not_started' });
  };

  const toggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    await updateTask(task.id, {
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined,
      kanban_column: newStatus === 'completed' ? 'completed' : task.kanban_column,
    });
  };

  return { tasks, loading, createTask, updateTask, deleteTask, moveTask, toggleComplete, refetch: fetchTasks };
}

export function useSubtasks(parentTaskId: string | undefined) {
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const supabase = createClient();
  const { user } = useUser();

  useEffect(() => {
    if (!parentTaskId) return;
    supabase.from("tasks").select("*").eq("parent_task_id", parentTaskId).order("order_index").then(({ data }) => {
      setSubtasks(data || []);
    });
  }, [parentTaskId]);

  const addSubtask = async (title: string) => {
    if (!user || !parentTaskId) return;
    const { data } = await supabase.from("tasks").insert({
      title, user_id: user.id, parent_task_id: parentTaskId, status: 'not_started', priority: 'medium', category: 'Study',
    }).select().single();
    if (data) setSubtasks(prev => [...prev, data]);
  };

  const toggleSubtask = async (id: string, current: TaskStatus) => {
    const newStatus: TaskStatus = current === 'completed' ? 'not_started' : 'completed';
    await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const deleteSubtask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  return { subtasks, addSubtask, toggleSubtask, deleteSubtask };
}
