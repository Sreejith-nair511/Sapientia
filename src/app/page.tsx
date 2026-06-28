"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain, Target, BookOpen, ChevronRight, Activity, Flame, Clock,
  Zap, Code2, GitMerge, TrendingUp, CheckCircle2, BarChart2,
  Play, Pause, RotateCcw, Bell, Network, Layers, FolderKanban,
  Map, Library, Plus, AlertTriangle, ArrowRight
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, Tooltip, XAxis
} from "recharts";
import { isToday, isPast, format, subDays } from "date-fns";

export default function Dashboard() {
  const { user } = useUser();
  const supabase = createClient();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("tasks").select("*").eq("user_id", user.id)
      .then(({ data }) => { setTasks(data || []); setLoading(false); });
  }, [user]);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (isRunning) id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const todayTasks = tasks.filter(t =>
    t.kanban_column === "today" || (t.due_date && isToday(new Date(t.due_date)))
  );
  const completedToday = tasks.filter(t => t.completed_at && isToday(new Date(t.completed_at)));
  const inProgress = tasks.filter(t => t.status === "in_progress");
  const overdue = tasks.filter(t =>
    t.due_date && isPast(new Date(t.due_date)) && t.status !== "completed"
  );
  const critical = tasks.filter(t => t.priority === "critical" && t.status !== "completed");

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const done = tasks.filter(t =>
      t.completed_at && format(new Date(t.completed_at), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    ).length;
    return { day: format(date, "EEE"), tasks: done };
  });

  const getCat = (name: string) =>
    tasks.filter(t => t.category === name && t.status === "completed").length;
  const maxCat = Math.max(1,
    getCat("DSA"), getCat("Machine Learning"), getCat("Programming Language"),
    getCat("Competitive Programming"), getCat("Study"), getCat("Project")
  );
  const radarData = [
    { subject: "DSA",     A: Math.round((getCat("DSA") / maxCat) * 100) },
    { subject: "ML/AI",   A: Math.round(((getCat("Machine Learning") + getCat("Deep Learning")) / maxCat) * 100) },
    { subject: "Coding",  A: Math.round((getCat("Programming Language") / maxCat) * 100) },
    { subject: "CP",      A: Math.round((getCat("Competitive Programming") / maxCat) * 100) },
    { subject: "Study",   A: Math.round((getCat("Study") / maxCat) * 100) },
    { subject: "Project", A: Math.round((getCat("Project") / maxCat) * 100) },
  ];

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.firstName || "Engineer";

  const quickLinks = [
    { label: "DSA",       icon: Network,      href: "/dsa",       desc: `${tasks.filter(t => t.category === "DSA").length} tasks` },
    { label: "AI / ML",   icon: Brain,        href: "/ai",        desc: "Full curriculum" },
    { label: "Full Stack",icon: Layers,        href: "/full-stack",desc: "9 modules" },
    { label: "Tasks",     icon: FolderKanban, href: "/tasks",     desc: `${tasks.filter(t => t.status !== "completed").length} open` },
    { label: "Roadmaps",  icon: Map,          href: "/roadmap",   desc: "4 plans" },
    { label: "Resources", icon: Library,      href: "/resources", desc: "24 curated" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">{greeting}, {firstName} 👋</h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            {format(new Date(), "EEEE, MMMM d")} · Make every minute count.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {overdue.length > 0 && (
            <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 gap-1 text-xs">
              <AlertTriangle className="size-3" /> {overdue.length} overdue
            </Badge>
          )}
          {critical.length > 0 && (
            <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 gap-1 text-xs">
              <Flame className="size-3" /> {critical.length} critical
            </Badge>
          )}
        </div>
      </div>

      {/* Stat pills — 2×2 on mobile, 4 columns on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Today", value: todayTasks.length,      icon: Target,      color: "text-blue-400",   bg: "bg-blue-500/10"   },
          { label: "Done",  value: completedToday.length,  icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10"  },
          { label: "Active",value: inProgress.length,      icon: TrendingUp,  color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Total", value: tasks.length,           icon: Activity,    color: "text-indigo-400", bg: "bg-indigo-500/10" },
        ].map(stat => (
          <div key={stat.label} className={`flex items-center gap-3 ${stat.bg} border border-white/5 rounded-xl p-3 sm:p-4`}>
            <stat.icon className={`size-5 sm:size-5 ${stat.color} shrink-0`} />
            <div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-zinc-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1: Today tasks + study timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's tasks */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-800">
            <h2 className="font-bold text-zinc-200 flex items-center gap-2 text-sm">
              <Target className="size-4 text-indigo-400 shrink-0" /> Today's Focus
            </h2>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-300 gap-1">
                All <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
          <div className="p-4 sm:p-5 space-y-2 max-h-56 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-zinc-600 text-sm">Loading...</div>
            ) : todayTasks.length > 0 ? (
              todayTasks.slice(0, 8).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2.5 sm:p-3 bg-zinc-800/60 rounded-xl">
                  <div className={`size-3.5 rounded-full border-2 shrink-0 ${task.status === "completed" ? "border-green-400 bg-green-400" : "border-zinc-600"}`} />
                  <span className={`flex-1 text-xs sm:text-sm min-w-0 truncate ${task.status === "completed" ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                    {task.title}
                  </span>
                  {task.priority === "critical" && <Flame className="size-3.5 text-red-400 shrink-0" />}
                  {task.estimated_minutes && (
                    <span className="text-xs text-zinc-600 items-center gap-1 hidden sm:flex shrink-0">
                      <Clock className="size-3" />{task.estimated_minutes}m
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="size-10 text-zinc-700 mx-auto" />
                <p className="text-zinc-500 text-sm">No tasks for today.</p>
                <Link href="/tasks">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="size-3.5" /> Add Tasks
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Study timer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <h2 className="font-bold text-zinc-200 flex items-center gap-2 mb-4 text-sm">
            <Clock className="size-4 text-indigo-400" /> Study Timer
          </h2>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-mono font-bold text-zinc-100 mb-4 tabular-nums">
              {fmtTime(timer)}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 gap-2 text-sm ${isRunning ? "bg-yellow-600 hover:bg-yellow-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                size="sm"
              >
                {isRunning ? <><Pause className="size-3.5" />Pause</> : <><Play className="size-3.5" />Start</>}
              </Button>
              <Button
                onClick={() => { setTimer(0); setIsRunning(false); }}
                variant="outline" size="sm"
                className="border-zinc-700"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-xs text-zinc-500">
            <span>Session</span>
            <span className="font-mono text-zinc-300">{Math.floor(timer / 60)} min</span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>Open tasks</span>
            <span className="text-zinc-300">{tasks.filter(t => t.status !== "completed").length}</span>
          </div>
        </div>
      </div>

      {/* Charts row — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Skill radar */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
              <BarChart2 className="size-4 text-indigo-400" /> Mastery Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[180px] sm:h-[200px] px-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#71717a" }} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly activity */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
              <TrendingUp className="size-4 text-green-400" /> Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[130px] sm:h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="tasks" stroke="#6366f1" fill="url(#weekGrad)" strokeWidth={2} name="Done" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* 30-day heatmap */}
            <div className="mt-3 pt-3 border-t border-zinc-800 px-2 sm:px-4">
              <p className="text-xs text-zinc-600 mb-1.5">30-day heatmap</p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = subDays(new Date(), 29 - i);
                  const count = tasks.filter(t =>
                    t.completed_at && format(new Date(t.completed_at), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                  ).length;
                  return (
                    <div
                      key={i}
                      title={`${format(date, "MMM d")}: ${count}`}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${
                        count === 0 ? "bg-zinc-800" :
                        count === 1 ? "bg-indigo-500/30" :
                        count <= 3 ? "bg-indigo-500/60" : "bg-indigo-500"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links — 2 cols on mobile, 3 on sm, 6 on lg */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {quickLinks.map(item => (
            <Link key={item.label} href={item.href}>
              <div className="group bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center transition-all cursor-pointer hover:bg-zinc-800/80">
                <item.icon className="size-5 sm:size-6 text-zinc-500 group-hover:text-indigo-400 transition-colors mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xs font-medium text-zinc-300 leading-tight">{item.label}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5 hidden sm:block">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
