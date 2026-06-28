"use client";

import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, GitBranch, Code2, Trophy, ExternalLink, Edit2, Save,
  Star, Zap, Link2, Loader2, CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useProfile, ProfileLinks } from "@/hooks/useProfile";
import { ShareProgressCard } from "@/components/profile/share-progress-card";

export default function ProfilePage() {
  const { user } = useUser();
  const { links, stats, loading, saving, saveLinks } = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileLinks>({ github: "", leetcode: "", codeforces: "", linkedin: "" });
  const [saved, setSaved] = useState(false);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const handleEdit = () => {
    setDraft({ ...links });
    setEditing(true);
  };

  const handleSave = async () => {
    await saveLinks(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const platforms = [
    { label: "GitHub", icon: GitBranch, key: "github" as keyof ProfileLinks, placeholder: "username", url: "https://github.com/" },
    { label: "LeetCode", icon: Code2, key: "leetcode" as keyof ProfileLinks, placeholder: "username", url: "https://leetcode.com/" },
    { label: "Codeforces", icon: Trophy, key: "codeforces" as keyof ProfileLinks, placeholder: "handle", url: "https://codeforces.com/profile/" },
    { label: "LinkedIn", icon: Link2, key: "linkedin" as keyof ProfileLinks, placeholder: "profile URL", url: "" },
  ];

  const levelLabel = (level: number) => {
    if (level < 3) return "Beginner";
    if (level < 7) return "Intermediate";
    if (level < 12) return "Advanced";
    return "Expert";
  };

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-4 sm:space-y-5">

        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
          <User className="size-6 sm:size-7 text-indigo-400 shrink-0" /> Profile
        </h1>
        {/* Share button row */}
        {!loading && (
          <div className="flex justify-end -mt-1">
            <ShareProgressCard
              stats={{
                name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Engineer",
                level: stats.level,
                levelLabel: levelLabel(stats.level),
                totalXp: stats.total_xp,
                problemsSolved: stats.problems_solved,
                streakDays: stats.streak_days,
                projectsCount: stats.projects_count,
                avatarUrl: user?.imageUrl,
              }}
            />
          </div>
        )}
        {/* Profile card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 sm:size-20 ring-2 ring-indigo-500/30 shrink-0">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-indigo-600 text-lg sm:text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 truncate">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">
                  <Star className="size-3 mr-1" /> Level {stats.level} · {levelLabel(stats.level)}
                </Badge>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs">
                  <Zap className="size-3 mr-1" /> {stats.total_xp.toLocaleString()} XP
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`border-zinc-700 gap-1.5 shrink-0 text-xs sm:text-sm transition-colors ${saved ? "border-green-600 text-green-400" : ""}`}
              onClick={editing ? handleSave : handleEdit}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : saved ? (
                <><CheckCircle2 className="size-3.5" /> <span className="hidden sm:inline">Saved</span></>
              ) : editing ? (
                <><Save className="size-3.5" /> <span className="hidden sm:inline">Save</span></>
              ) : (
                <><Edit2 className="size-3.5" /> <span className="hidden sm:inline">Edit</span></>
              )}
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="size-5 animate-spin text-zinc-600" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: "Solved", value: stats.problems_solved },
              { label: "Streak", value: `${stats.streak_days}d` },
              { label: "Projects", value: stats.projects_count },
              { label: "XP", value: stats.total_xp >= 1000 ? `${(stats.total_xp / 1000).toFixed(1)}k` : stats.total_xp },
            ].map(stat => (
              <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-zinc-100">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-zinc-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Platform links */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-zinc-200 text-sm sm:text-base">Platform Links</h3>
          {platforms.map(platform => {
            const value = editing ? draft[platform.key] : links[platform.key];
            return (
              <div key={platform.label} className="flex items-center gap-3">
                <div className="size-8 sm:size-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <platform.icon className="size-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-zinc-500 mb-1">{platform.label}</div>
                  {editing ? (
                    <Input
                      value={draft[platform.key]}
                      onChange={e => setDraft(d => ({ ...d, [platform.key]: e.target.value }))}
                      placeholder={platform.placeholder}
                      className="bg-zinc-800 border-zinc-700 h-8 text-xs sm:text-sm"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm text-zinc-300 truncate block">
                      {value || <span className="text-zinc-600">Not set</span>}
                    </span>
                  )}
                </div>
                {value && !editing && (
                  <a
                    href={platform.url ? platform.url + value : value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-zinc-500 hover:text-zinc-300 shrink-0" aria-label={`Open ${platform.label}`}>
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Account info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-3">
          <h3 className="font-semibold text-zinc-200 text-sm sm:text-base">Account</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-zinc-400">Member since</span>
            <span className="text-xs sm:text-sm text-zinc-300">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-zinc-400">Sign-in method</span>
            <span className="text-xs sm:text-sm text-zinc-300 capitalize">
              {user?.externalAccounts?.[0]?.provider ?? "Email"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-zinc-400">User ID</span>
            <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[160px]">{user?.id}</span>
          </div>
        </div>

        <div className="h-4 lg:h-0" />
      </div>
    </div>
  );
}
