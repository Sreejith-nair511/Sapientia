"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export interface UserSettings {
  theme: "dark" | "light" | "system";
  accent_color: string;
  editor_theme: string;
  editor_font_size: number;
  daily_goal_minutes: number;
  weekly_goal_hours: number;
}

const DEFAULTS: UserSettings = {
  theme: "dark",
  accent_color: "#6366f1",
  editor_theme: "vs-dark",
  editor_font_size: 14,
  daily_goal_minutes: 120,
  weekly_goal_hours: 20,
};

export function useSettings() {
  const { user } = useUser();
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = getSupabaseBrowser();

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setSettings({
        theme: data.theme ?? DEFAULTS.theme,
        accent_color: data.accent_color ?? DEFAULTS.accent_color,
        editor_theme: data.editor_theme ?? DEFAULTS.editor_theme,
        editor_font_size: data.editor_font_size ?? DEFAULTS.editor_font_size,
        daily_goal_minutes: data.daily_goal_minutes ?? DEFAULTS.daily_goal_minutes,
        weekly_goal_hours: data.weekly_goal_hours ?? DEFAULTS.weekly_goal_hours,
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const saveSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    setSaving(true);
    const merged = { ...settings, ...updates };
    setSettings(merged);
    await supabase.from("user_settings").upsert({
      user_id: user.id,
      ...merged,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
  };

  return { settings, loading, saving, saveSettings };
}
