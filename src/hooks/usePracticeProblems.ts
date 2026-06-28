"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export interface PracticeProblem {
  id: string;
  topic_id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  url: string | null;
  status: "todo" | "solved" | "revise" | "skipped";
  time_minutes: number | null;
  notes: string | null;
  is_favorite: boolean;
  companies: string[];
}

export function usePracticeProblems(topicId: string | undefined) {
  const { user } = useUser();
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  const fetch = useCallback(async () => {
    if (!user || !topicId) return;
    const { data } = await supabase
      .from("practice_questions")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true });
    setProblems(data || []);
    setLoading(false);
  }, [user, topicId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addProblem = async (problem: Omit<PracticeProblem, "id">) => {
    if (!user || !topicId) return;
    const { data } = await supabase
      .from("practice_questions")
      .insert({ ...problem, user_id: user.id, topic_id: topicId })
      .select()
      .single();
    if (data) setProblems((prev) => [...prev, data]);
  };

  const updateProblem = async (id: string, updates: Partial<PracticeProblem>) => {
    await supabase.from("practice_questions").update(updates).eq("id", id);
    setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProblem = async (id: string) => {
    await supabase.from("practice_questions").delete().eq("id", id);
    setProblems((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    await updateProblem(id, { is_favorite: !current });
  };

  return { problems, loading, addProblem, updateProblem, deleteProblem, toggleFavorite, refetch: fetch };
}
