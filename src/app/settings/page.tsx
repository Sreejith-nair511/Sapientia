"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Palette, Code2, Bell, Database, Download, Upload,
  Keyboard, Monitor, Moon, Sun, Check, Loader2, CheckCircle2
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

const ACCENT_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Rose", value: "#f43f5e" },
];

const SHORTCUTS = [
  { key: "Ctrl + K", desc: "Global Search" },
  { key: "Ctrl + /", desc: "Toggle Notes" },
  { key: "Ctrl + E", desc: "Open Code Editor" },
  { key: "Ctrl + R", desc: "Start Revision" },
  { key: "Ctrl + T", desc: "Start Study Timer" },
  { key: "Ctrl + D", desc: "Go to Dashboard" },
];

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const { settings, loading, saving, saveSettings } = useSettings();
  const [saved, setSaved] = useState(false);

  // Draft state for local edits before saving
  const [draft, setDraft] = useState(settings);
  useEffect(() => { setDraft(settings); }, [settings]);

  const handleSave = async () => {
    await saveSettings(draft);
    setTheme(draft.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-7 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
          <Settings className="size-7 sm:size-8 text-indigo-400" />
          Settings
        </h1>
        <p className="text-zinc-500 text-sm">Customize your Engineering OS experience. Changes are saved to your account.</p>
      </div>

      {/* APPEARANCE */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-200">
            <Palette className="size-5 text-indigo-400" /> Appearance
          </CardTitle>
          <CardDescription className="text-zinc-500">Control the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div>
            <p className="text-sm font-medium mb-3 text-zinc-300">Theme</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "dark", label: "Dark", icon: Moon },
                { value: "light", label: "Light", icon: Sun },
                { value: "system", label: "System", icon: Monitor },
              ].map(t => (
                <Button
                  key={t.value}
                  variant={draft.theme === t.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDraft(d => ({ ...d, theme: t.value as "dark" | "light" | "system" }))}
                  className={`gap-2 border-zinc-700 ${draft.theme === t.value ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-600" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  <t.icon className="size-4" /> {t.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <p className="text-sm font-medium mb-3 text-zinc-300">Accent Color</p>
            <div className="flex gap-4 flex-wrap">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setDraft(d => ({ ...d, accent_color: c.value }))}
                  className="flex flex-col items-center gap-1.5 group"
                  title={c.name}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      borderColor: draft.accent_color === c.value ? "white" : "transparent",
                      boxShadow: draft.accent_color === c.value ? `0 0 0 2px #18181b, 0 0 0 4px ${c.value}` : "none",
                    }}
                  >
                    {draft.accent_color === c.value && <Check className="size-4 text-white" />}
                  </div>
                  <span className="text-[10px] text-zinc-500">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CODE EDITOR */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-200">
            <Code2 className="size-5 text-indigo-400" /> Code Editor
          </CardTitle>
          <CardDescription className="text-zinc-500">Configure the integrated Monaco editor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">Editor Theme</p>
              <p className="text-xs text-zinc-500">Choose your preferred Monaco editor theme.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["vs-dark", "light", "hc-black"].map(t => (
                <Button
                  key={t}
                  size="sm"
                  variant={draft.editor_theme === t ? "default" : "outline"}
                  onClick={() => setDraft(d => ({ ...d, editor_theme: t }))}
                  className={`text-xs border-zinc-700 ${draft.editor_theme === t ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-600" : "text-zinc-400"}`}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">Font Size</p>
              <p className="text-xs text-zinc-500">Editor font size in pixels (10–24).</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm" variant="outline"
                className="border-zinc-700 text-zinc-400 h-8 w-8 p-0"
                onClick={() => setDraft(d => ({ ...d, editor_font_size: Math.max(10, d.editor_font_size - 1) }))}
              >
                −
              </Button>
              <span className="font-mono font-bold w-8 text-center text-zinc-200">{draft.editor_font_size}</span>
              <Button
                size="sm" variant="outline"
                className="border-zinc-700 text-zinc-400 h-8 w-8 p-0"
                onClick={() => setDraft(d => ({ ...d, editor_font_size: Math.min(24, d.editor_font_size + 1) }))}
              >
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GOALS */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-200">
            <Bell className="size-5 text-indigo-400" /> Study Goals
          </CardTitle>
          <CardDescription className="text-zinc-500">Set your daily and weekly learning targets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">Daily Study Goal</p>
              <p className="text-xs text-zinc-500">Target minutes per day (15–480).</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm" variant="outline"
                className="border-zinc-700 text-zinc-400 h-8 w-8 p-0"
                onClick={() => setDraft(d => ({ ...d, daily_goal_minutes: Math.max(15, d.daily_goal_minutes - 15) }))}
              >
                −
              </Button>
              <span className="font-bold w-20 text-center text-zinc-200 text-sm">{draft.daily_goal_minutes} min</span>
              <Button
                size="sm" variant="outline"
                className="border-zinc-700 text-zinc-400 h-8 w-8 p-0"
                onClick={() => setDraft(d => ({ ...d, daily_goal_minutes: Math.min(480, d.daily_goal_minutes + 15) }))}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">Weekly Study Goal</p>
              <p className="text-xs text-zinc-500">Target hours per week (1–60).</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm" variant="outline"
                className="border-zinc-700 text-zinc-400 h-8 w-8 p-0"
                onClick={() => setDraft(d => ({ ...d, weekly_goal_hours: Math.max(1, d.weekly_goal_hours - 1) }))}
              >
                −
              </Button>
              <span className="font-bold w-20 text-center text-zinc-200 text-sm">{draft.weekly_goal_hours} hrs</span>
              <Button
                size="sm" variant="outline"
                className="border-zinc-700 text-zinc-400 h-8 w-8 p-0"
                onClick={() => setDraft(d => ({ ...d, weekly_goal_hours: Math.min(60, d.weekly_goal_hours + 1) }))}
              >
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KEYBOARD SHORTCUTS */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-200">
            <Keyboard className="size-5 text-indigo-400" /> Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SHORTCUTS.map(s => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{s.desc}</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DATA MANAGEMENT */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-200">
            <Database className="size-5 text-indigo-400" /> Data Management
          </CardTitle>
          <CardDescription className="text-zinc-500">Export or import your Engineering OS data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2 border-zinc-700 text-zinc-400 hover:text-zinc-200">
            <Download className="size-4" /> Export All Data
          </Button>
          <Button variant="outline" className="gap-2 border-zinc-700 text-zinc-400 hover:text-zinc-200">
            <Upload className="size-4" /> Import Data
          </Button>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end pb-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 gap-2 ${saved ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {saving ? (
            <><Loader2 className="size-4 animate-spin" /> Saving…</>
          ) : saved ? (
            <><CheckCircle2 className="size-4" /> Saved!</>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
