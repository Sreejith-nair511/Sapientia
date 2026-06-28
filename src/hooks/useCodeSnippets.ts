"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export interface CodeSnippet {
  id: string;
  topic_id: string;
  language: string;
  title: string;
  code: string;
  created_at: string;
}

export function useCodeSnippets(topicId: string | undefined) {
  const { user } = useUser();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    if (!user || !topicId) return;
    supabase
      .from("code_snippets")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic_id", topicId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setSnippets(data || []));
  }, [user, topicId]);

  const saveSnippet = async (language: string, code: string, title?: string) => {
    if (!user || !topicId) return;
    const { data } = await supabase
      .from("code_snippets")
      .insert({
        user_id: user.id,
        topic_id: topicId,
        language,
        code,
        title: title || `${language} snippet`,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (data) setSnippets((prev) => [data, ...prev]);
    return data;
  };

  const deleteSnippet = async (id: string) => {
    await supabase.from("code_snippets").delete().eq("id", id);
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  return { snippets, saveSnippet, deleteSnippet };
}
