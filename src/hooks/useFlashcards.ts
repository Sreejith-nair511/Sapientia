"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export interface Flashcard {
  id: string;
  topic_id: string;
  front: string;
  back: string;
  difficulty: "easy" | "okay" | "hard" | null;
  next_review: string | null;
  review_count: number;
}

// Spaced repetition intervals in days
const SR_INTERVALS: Record<string, number[]> = {
  hard: [1, 2, 4, 8, 15, 30, 60],
  okay: [1, 3, 7, 14, 30, 60, 90],
  easy: [3, 7, 14, 30, 60, 90, 180],
};

export function useFlashcards(topicId: string | undefined) {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  const fetch = useCallback(async () => {
    if (!user || !topicId) return;
    const { data } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true });
    setFlashcards(data || []);
    setLoading(false);
  }, [user, topicId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addFlashcard = async (front: string, back: string) => {
    if (!user || !topicId) return;
    const { data } = await supabase
      .from("flashcards")
      .insert({ user_id: user.id, topic_id: topicId, front, back, review_count: 0 })
      .select()
      .single();
    if (data) setFlashcards((prev) => [...prev, data]);
  };

  const rateCard = async (id: string, difficulty: "easy" | "okay" | "hard") => {
    const card = flashcards.find((c) => c.id === id);
    if (!card) return;
    const intervals = SR_INTERVALS[difficulty];
    const reviewCount = Math.min(card.review_count, intervals.length - 1);
    const days = intervals[reviewCount];
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + days);

    const updates = {
      difficulty,
      next_review: nextReview.toISOString(),
      review_count: card.review_count + 1,
    };
    await supabase.from("flashcards").update(updates).eq("id", id);
    setFlashcards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteFlashcard = async (id: string) => {
    await supabase.from("flashcards").delete().eq("id", id);
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
  };

  return { flashcards, loading, addFlashcard, rateCard, deleteFlashcard, refetch: fetch };
}
