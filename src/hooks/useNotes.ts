"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export interface Note {
  id: string;
  topic_id: string;
  note_type: string;
  content: string;
  updated_at: string;
}

export function useNotes(topicId: string | undefined, noteType: string) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const supabase = getSupabaseBrowser();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load note
  useEffect(() => {
    if (!user || !topicId) return;
    supabase
      .from("markdown_documents")
      .select("content")
      .eq("user_id", user.id)
      .eq("topic_id", topicId)
      .eq("doc_type", noteType)
      .single()
      .then(({ data }) => {
        if (data?.content) setContent(data.content);
      });
  }, [user, topicId, noteType]);

  // Auto-save with debounce
  const saveNote = useCallback(
    async (newContent: string) => {
      if (!user || !topicId) return;
      setSaving(true);
      await supabase.from("markdown_documents").upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          doc_type: noteType,
          content: newContent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,topic_id,doc_type" }
      );
      setSaving(false);
      setLastSaved(new Date());
    },
    [user, topicId, noteType]
  );

  const handleChange = (newContent: string) => {
    setContent(newContent);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveNote(newContent), 1500);
  };

  return { content, setContent: handleChange, saving, lastSaved };
}
