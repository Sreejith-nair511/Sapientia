"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export interface ProfileLinks {
  github: string;
  leetcode: string;
  codeforces: string;
  linkedin: string;
}

export interface ProfileStats {
  problems_solved: number;
  streak_days: number;
  projects_count: number;
  total_xp: number;
  level: number;
}

export function useProfile() {
  const { user } = useUser();
  const [links, setLinks] = useState<ProfileLinks>({ github: "", leetcode: "", codeforces: "", linkedin: "" });
  const [stats, setStats] = useState<ProfileStats>({ problems_solved: 0, streak_days: 0, projects_count: 0, total_xp: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = getSupabaseBrowser();

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    // Upsert user row (ensure it exists)
    await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        avatar_url: user.imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    // Fetch settings / platform links
    const { data: settingsData } = await supabase
      .from("user_settings")
      .select("github_username, leetcode_username, codeforces_handle, linkedin_url")
      .eq("user_id", user.id)
      .single();

    if (settingsData) {
      setLinks({
        github: settingsData.github_username ?? "",
        leetcode: settingsData.leetcode_username ?? "",
        codeforces: settingsData.codeforces_handle ?? "",
        linkedin: settingsData.linkedin_url ?? "",
      });
    }

    // Fetch XP
    const { data: xpData } = await supabase
      .from("user_xp")
      .select("total_xp, level")
      .eq("user_id", user.id)
      .single();

    // Count solved problems
    const { count: solvedCount } = await supabase
      .from("practice_questions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "solved");

    // Streak
    const { data: streakData } = await supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .single();

    // Projects
    const { count: projectCount } = await supabase
      .from("project_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    setStats({
      problems_solved: solvedCount ?? 0,
      streak_days: streakData?.current_streak ?? 0,
      projects_count: projectCount ?? 0,
      total_xp: xpData?.total_xp ?? 0,
      level: xpData?.level ?? 1,
    });

    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveLinks = async (newLinks: ProfileLinks) => {
    if (!user) return;
    setSaving(true);
    await supabase.from("user_settings").upsert(
      {
        user_id: user.id,
        github_username: newLinks.github,
        leetcode_username: newLinks.leetcode,
        codeforces_handle: newLinks.codeforces,
        linkedin_url: newLinks.linkedin,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    setLinks(newLinks);
    setSaving(false);
  };

  return { links, stats, loading, saving, saveLinks, refetch: fetchProfile };
}
