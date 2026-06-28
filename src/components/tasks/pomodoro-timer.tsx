"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, Pause, RotateCcw, SkipForward, Timer,
  Brain, Coffee, Volume2, VolumeX, X, Minus, Square
} from "lucide-react";

type SessionType = "focus" | "short_break" | "long_break";

const SESSION_DURATIONS: Record<SessionType, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const SESSION_CONFIG: Record<SessionType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  focus:       { label: "Focus",       color: "text-indigo-400", bg: "bg-indigo-500/20 border-indigo-500/30", icon: <Brain className="size-3.5" /> },
  short_break: { label: "Short Break", color: "text-green-400",  bg: "bg-green-500/20 border-green-500/30",  icon: <Coffee className="size-3.5" /> },
  long_break:  { label: "Long Break",  color: "text-blue-400",   bg: "bg-blue-500/20 border-blue-500/30",    icon: <Coffee className="size-3.5" /> },
};

interface PomodoroTimerProps {
  compact?: boolean;
  onSessionComplete?: (type: SessionType, duration: number) => void;
}

export function PomodoroTimer({ compact = false, onSessionComplete }: PomodoroTimerProps) {
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const [totalFocusToday, setTotalFocusToday] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalDuration = SESSION_DURATIONS[sessionType];
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const cfg = SESSION_CONFIG[sessionType];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const playBeep = useCallback(() => {
    if (muted || typeof window === "undefined") return;
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.8);
    } catch (_) {}
  }, [muted]);

  const switchSession = useCallback((type: SessionType) => {
    setRunning(false);
    setSessionType(type);
    setTimeLeft(SESSION_DURATIONS[type]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleComplete = useCallback(() => {
    setRunning(false);
    playBeep();
    if (sessionType === "focus") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      setTotalFocusToday(prev => prev + 25);
      onSessionComplete?.("focus", 25);
      switchSession(newCount % 4 === 0 ? "long_break" : "short_break");
    } else {
      switchSession("focus");
    }
  }, [sessionType, sessionCount, switchSession, playBeep, onSessionComplete]);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, handleComplete]);

  // Compact floating version
  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
        <div className={`flex items-center gap-1.5 ${cfg.color}`}>
          {cfg.icon}
          <span className="font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon"
            className={`size-7 ${running ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}`}
            onClick={() => setRunning(v => !v)}
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </Button>
          <Button
            variant="ghost" size="icon"
            className="size-7 text-zinc-500 hover:text-zinc-300"
            onClick={() => { setRunning(false); setTimeLeft(SESSION_DURATIONS[sessionType]); }}
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  // Full Pomodoro Timer
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
      {/* Session Type Tabs */}
      <div className="flex gap-2">
        {(["focus", "short_break", "long_break"] as SessionType[]).map(type => {
          const c = SESSION_CONFIG[type];
          return (
            <button
              key={type}
              onClick={() => switchSession(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                sessionType === type ? `${c.bg} ${c.color}` : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              {c.icon} {c.label}
            </button>
          );
        })}
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-zinc-300" onClick={() => setMuted(v => !v)}>
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-36">
          <svg className="size-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#27272a" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={sessionType === "focus" ? "#6366f1" : sessionType === "short_break" ? "#22c55e" : "#3b82f6"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono text-3xl font-bold ${cfg.color}`}>{formatTime(timeLeft)}</span>
            <span className="text-xs text-zinc-500 mt-0.5">{cfg.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="size-10 border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl"
            onClick={() => { setRunning(false); setTimeLeft(SESSION_DURATIONS[sessionType]); }}
          >
            <RotateCcw className="size-4" />
          </Button>

          <Button
            size="icon"
            className={`size-14 rounded-2xl shadow-lg transition-all ${running ? "bg-yellow-500 hover:bg-yellow-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
            onClick={() => setRunning(v => !v)}
          >
            {running ? <Pause className="size-6" /> : <Play className="size-6 ml-0.5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-10 border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl"
            onClick={() => switchSession(sessionType === "focus" ? "short_break" : "focus")}
          >
            <SkipForward className="size-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-400">{sessionCount}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Sessions Today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{totalFocusToday}m</p>
          <p className="text-xs text-zinc-500 mt-0.5">Focus Time</p>
        </div>
      </div>
    </div>
  );
}
