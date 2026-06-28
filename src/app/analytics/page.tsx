"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2, Clock, Code2, Flame, Zap, Trophy, TrendingUp,
  Target, CheckCircle2, Calendar, Activity
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar
} from "recharts";
import { format, subDays, startOfDay, isToday } from "date-fns";

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="size-4" />
        </div>
        <div>
          <div className="text-xl font-bold text-zinc-100">{value}</div>
          <div className="text-xs text-zinc-500">{label}</div>
          <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setTasks(data || []);
        setLoading(false);
      });
  }, [user]);

  // Compute stats from real task data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedToday = tasks.filter(t =>
    t.completed_at && isToday(new Date(t.completed_at))
  ).length;

  const overdueTasks = tasks.filter(t =>
    t.due_date && new Date(t.due_date) < new Date() && t.status !== "completed"
  ).length;

  const totalEstimatedHours = Math.round(
    tasks.filter(t => t.estimated_minutes).reduce((a, t) => a + t.estimated_minutes, 0) / 60
  );

  const totalActualHours = Math.round(
    tasks.filter(t => t.actual_minutes).reduce((a, t) => a + t.actual_minutes, 0) / 60
  );

  // Category breakdown
  const categoryBreakdown = Object.entries(
    tasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([cat, count]) => ({ name: cat, count }));

  // Completion over last 14 days
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const completed = tasks.filter(t => {
      if (!t.completed_at) return false;
      return format(new Date(t.completed_at), "yyyy-MM-dd") === dateStr;
    }).length;
    return { day: format(date, "MMM d"), completed };
  });

  // Priority breakdown
  const priorityData = [
    { name: "Critical", count: tasks.filter(t => t.priority === "critical" && t.status !== "completed").length, color: "#ef4444" },
    { name: "High", count: tasks.filter(t => t.priority === "high" && t.status !== "completed").length, color: "#f97316" },
    { name: "Medium", count: tasks.filter(t => t.priority === "medium" && t.status !== "completed").length, color: "#f59e0b" },
    { name: "Low", count: tasks.filter(t => t.priority === "low" && t.status !== "completed").length, color: "#6b7280" },
  ].filter(p => p.count > 0);

  // Skill radar (based on task categories)
  const getCategoryCount = (name: string) => tasks.filter(t => t.category === name && t.status === "completed").length;
  const maxCount = Math.max(1, ...["DSA", "Machine Learning", "Full Stack", "Competitive Programming", "Core CS"].map(getCategoryCount));
  const radarData = [
    { subject: "DSA", A: Math.round((getCategoryCount("DSA") / maxCount) * 100) },
    { subject: "ML/AI", A: Math.round(((getCategoryCount("Machine Learning") + getCategoryCount("Deep Learning")) / maxCount) * 100) },
    { subject: "Full Stack", A: Math.round((getCategoryCount("Programming Language") / maxCount) * 100) },
    { subject: "Competitive", A: Math.round((getCategoryCount("Competitive Programming") / maxCount) * 100) },
    { subject: "Core CS", A: Math.round((getCategoryCount("Study") / maxCount) * 100) },
    { subject: "Projects", A: Math.round((getCategoryCount("Project") / maxCount) * 100) },
  ];

  // 30-day heatmap
  const heatmap = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const count = tasks.filter(t => {
      if (!t.completed_at) return false;
      return format(new Date(t.completed_at), "yyyy-MM-dd") === dateStr;
    }).length;
    return { date: dateStr, count };
  });

  const getHeatColor = (count: number) => {
    if (count === 0) return "bg-zinc-800";
    if (count === 1) return "bg-indigo-500/30";
    if (count <= 3) return "bg-indigo-500/60";
    return "bg-indigo-500";
  };

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100 p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart2 className="size-8 text-indigo-400" /> Analytics
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Your complete engineering journey in numbers.</p>
        </div>
        {loading && (
          <div className="size-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard label="Total Tasks" value={String(totalTasks)} sub="all time" icon={Target} color="bg-indigo-500/20 text-indigo-400" />
        <StatCard label="Completed" value={String(completedTasks)} sub={`${completionRate}% rate`} icon={CheckCircle2} color="bg-green-500/20 text-green-400" />
        <StatCard label="Done Today" value={String(completedToday)} sub="tasks" icon={Zap} color="bg-yellow-500/20 text-yellow-400" />
        <StatCard label="Overdue" value={String(overdueTasks)} sub="need attention" icon={Clock} color="bg-red-500/20 text-red-400" />
        <StatCard label="Estimated" value={`${totalEstimatedHours}h`} sub="planned work" icon={TrendingUp} color="bg-blue-500/20 text-blue-400" />
        <StatCard label="Logged" value={`${totalActualHours}h`} sub="actual time" icon={Activity} color="bg-purple-500/20 text-purple-400" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill radar */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
              <BarChart2 className="size-4 text-indigo-400" /> Skill Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#71717a" }} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 14-day completion trend */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
              <TrendingUp className="size-4 text-green-400" /> Tasks Completed (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last14Days}>
                <defs>
                  <linearGradient id="complGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#a1a1aa" }}
                />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#complGrad)" strokeWidth={2} name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
              <Code2 className="size-4 text-blue-400" /> Tasks by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                Create tasks to see category breakdown.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
              <Flame className="size-4 text-orange-400" /> Active Tasks by Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            {priorityData.length > 0 ? (
              <div className="space-y-4 pt-4">
                {priorityData.map(p => {
                  const maxVal = Math.max(...priorityData.map(x => x.count), 1);
                  return (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-16">{p.name}</span>
                      <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(p.count / maxVal) * 100}%`, background: p.color }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 font-mono w-6 text-right">{p.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                No active tasks by priority yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
            <Calendar className="size-4 text-indigo-400" /> Activity Heatmap (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {heatmap.map(day => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} task${day.count !== 1 ? "s" : ""}`}
                className={`w-6 h-6 rounded-md transition-colors ${getHeatColor(day.count)}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-600">
            <span>Less</span>
            <div className="flex gap-1">
              {["bg-zinc-800", "bg-indigo-500/30", "bg-indigo-500/60", "bg-indigo-500"].map(c => (
                <div key={c} className={`w-4 h-4 rounded ${c}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
