"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitMerge, Lock, CheckCircle2, Circle, ChevronRight, Loader2, Filter } from "lucide-react";
import Link from "next/link";
import { DSA_TOPICS } from "@/data/dsa";

interface TopicStatus {
  [slug: string]: "completed" | "in_progress" | "unlocked" | "locked";
}

// Dependency map: topicId -> array of prerequisite topicIds
const PREREQ_MAP: Record<string, string[]> = DSA_TOPICS.reduce((acc, t) => {
  acc[t.slug] = t.prerequisites ?? [];
  return acc;
}, {} as Record<string, string[]>);

// Node positions for a nice graph layout (% of container)
const POSITIONS: Record<string, { x: number; y: number }> = {
  "arrays-hashing":    { x: 50, y: 8 },
  "two-pointers":      { x: 22, y: 24 },
  "sliding-window":    { x: 76, y: 24 },
  "stack":             { x: 50, y: 40 },
  "binary-search":     { x: 14, y: 56 },
  "linked-list":       { x: 38, y: 56 },
  "trees":             { x: 62, y: 56 },
  "heap":              { x: 86, y: 56 },
  "graphs":            { x: 38, y: 74 },
  "dynamic-programming":{ x: 62, y: 74 },
  "backtracking":      { x: 50, y: 90 },
};

// Edges: [from, to]
const EDGES: [string, string][] = [
  ["arrays-hashing", "two-pointers"],
  ["arrays-hashing", "sliding-window"],
  ["arrays-hashing", "stack"],
  ["arrays-hashing", "binary-search"],
  ["arrays-hashing", "linked-list"],
  ["stack", "trees"],
  ["trees", "heap"],
  ["trees", "graphs"],
  ["trees", "dynamic-programming"],
  ["graphs", "backtracking"],
  ["dynamic-programming", "backtracking"],
];

const STATUS_COLORS = {
  completed:   { node: "border-green-400 bg-green-500/10 text-green-300",  dot: "bg-green-400" },
  in_progress: { node: "border-indigo-400 bg-indigo-500/10 text-indigo-300", dot: "bg-indigo-400 animate-pulse" },
  unlocked:    { node: "border-zinc-500 bg-zinc-900 text-zinc-300 hover:border-indigo-400 cursor-pointer", dot: "bg-zinc-500" },
  locked:      { node: "border-zinc-800 bg-zinc-950 text-zinc-600 opacity-60", dot: "bg-zinc-700" },
};

export default function KnowledgeGraphPage() {
  const { user } = useUser();
  const [statuses, setStatuses] = useState<TopicStatus>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "completed">("all");

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    supabase
      .from("checklists")
      .select("topic_id, mastered")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const progressMap: Record<string, number> = {};
        (data || []).forEach((row: any) => {
          if (!progressMap[row.topic_id]) progressMap[row.topic_id] = 0;
          if (row.mastered) progressMap[row.topic_id]++;
        });

        // Determine status for each topic
        const result: TopicStatus = {};
        DSA_TOPICS.forEach(topic => {
          const prereqsMet = (PREREQ_MAP[topic.slug] || []).every(prereq => {
            const prereqTopic = DSA_TOPICS.find(t => t.slug === prereq);
            return prereqTopic && (result[prereq] === "completed" || result[prereq] === "in_progress");
          });

          if (progressMap[topic.id]) {
            result[topic.slug] = "completed";
          } else if (PREREQ_MAP[topic.slug].length === 0 || prereqsMet) {
            result[topic.slug] = "unlocked";
          } else {
            result[topic.slug] = "locked";
          }
        });

        setStatuses(result);
        setLoading(false);
      });
  }, [user]);

  const selectedTopic = DSA_TOPICS.find(t => t.slug === selected);

  const filteredTopics = DSA_TOPICS.filter(t => {
    if (filter === "completed") return statuses[t.slug] === "completed";
    if (filter === "available") return statuses[t.slug] === "unlocked" || statuses[t.slug] === "in_progress";
    return true;
  });

  const completedCount = Object.values(statuses).filter(s => s === "completed").length;
  const totalCount = DSA_TOPICS.length;

  return (
    <div className="min-h-full bg-zinc-950 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <GitMerge className="size-7 text-indigo-400 shrink-0" /> Knowledge Graph
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Visualize DSA topic dependencies · {completedCount}/{totalCount} completed
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "available", "completed"] as const).map(f => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={`text-xs capitalize border-zinc-700 ${filter === f ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-600" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-zinc-400 shrink-0 font-mono">{completedCount}/{totalCount}</span>
        <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0 hidden sm:flex">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-400 inline-block" /> Done</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-indigo-400 inline-block" /> Unlocked</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-zinc-600 inline-block" /> Locked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Graph canvas */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative" style={{ minHeight: 520 }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-8 animate-spin text-zinc-600" />
            </div>
          ) : (
            <>
              {/* Dot grid bg */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)", backgroundSize: "28px 28px" }} />

              {/* SVG edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
                {EDGES.map(([from, to]) => {
                  const f = POSITIONS[from];
                  const t = POSITIONS[to];
                  if (!f || !t) return null;
                  const isActive = statuses[from] === "completed" && statuses[to] !== "locked";
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={`${f.x}%`} y1={`${f.y}%`}
                      x2={`${t.x}%`} y2={`${t.y}%`}
                      stroke={isActive ? "#6366f1" : "#27272a"}
                      strokeWidth={isActive ? 2 : 1.5}
                      strokeDasharray={isActive ? "none" : "4 3"}
                      opacity={isActive ? 0.7 : 0.4}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {DSA_TOPICS.map(topic => {
                const pos = POSITIONS[topic.slug];
                if (!pos) return null;
                const status = statuses[topic.slug] ?? "locked";
                const isHidden = filter === "completed" && status !== "completed";
                const isSelected = selected === topic.slug;
                const colors = STATUS_COLORS[status];

                return (
                  <button
                    key={topic.slug}
                    onClick={() => setSelected(prev => prev === topic.slug ? null : topic.slug)}
                    disabled={status === "locked"}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all ${colors.node} ${isSelected ? "ring-2 ring-indigo-400 scale-105 shadow-lg shadow-indigo-500/20" : ""} ${isHidden ? "opacity-20" : ""}`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, minWidth: 110 }}
                    aria-label={topic.title}
                  >
                    <div className="flex items-center gap-1.5">
                      {status === "completed" ? (
                        <CheckCircle2 className="size-3.5 text-green-400 shrink-0" />
                      ) : status === "locked" ? (
                        <Lock className="size-3 shrink-0" />
                      ) : (
                        <Circle className="size-3 shrink-0" />
                      )}
                      <span className="font-semibold text-xs whitespace-nowrap">{topic.title}</span>
                    </div>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 border-0 ${
                        topic.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                        topic.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {topic.difficulty}
                    </Badge>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {selected && selectedTopic ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-zinc-100 text-lg">{selectedTopic.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge className={`text-xs ${
                      selectedTopic.difficulty === "Easy" ? "bg-green-500/20 text-green-400 border-0" :
                      selectedTopic.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-0" :
                      "bg-red-500/20 text-red-400 border-0"
                    }`}>{selectedTopic.difficulty}</Badge>
                    <Badge className="bg-indigo-500/20 text-indigo-400 border-0 text-xs">{selectedTopic.importance}</Badge>
                  </div>
                </div>
                <div className={`size-3 rounded-full mt-1.5 shrink-0 ${STATUS_COLORS[statuses[selected] ?? "locked"].dot}`} />
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed">{selectedTopic.description}</p>

              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Subtopics</p>
                <div className="space-y-1">
                  {selectedTopic.subtopics.slice(0, 5).map(s => (
                    <div key={s} className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="size-1 rounded-full bg-zinc-600 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Companies</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopic.companies.map(c => (
                    <Badge key={c} className="text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">{c}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-800">
                <span>{selectedTopic.estimatedHours}h estimated</span>
                <span>{selectedTopic.leetcodeProblems.length} LeetCode problems</span>
              </div>

              <Link href={`/workspace/${selectedTopic.slug}`}>
                <Button
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                  disabled={statuses[selected] === "locked"}
                  size="sm"
                >
                  Open Workspace <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-zinc-300 text-sm">Topic Summary</h3>
              <div className="space-y-2">
                {DSA_TOPICS.map(topic => {
                  const status = statuses[topic.slug] ?? "locked";
                  return (
                    <button
                      key={topic.slug}
                      onClick={() => status !== "locked" && setSelected(topic.slug)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
                        status === "locked" ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-800 cursor-pointer"
                      }`}
                    >
                      <div className={`size-2 rounded-full shrink-0 ${STATUS_COLORS[status].dot}`} />
                      <span className="text-xs text-zinc-300 flex-1">{topic.title}</span>
                      <Badge className={`text-[9px] px-1.5 border-0 shrink-0 ${
                        topic.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                        topic.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>{topic.difficulty}</Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Legend</p>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-green-400 inline-block" /> Completed</div>
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-indigo-400 inline-block" /> Unlocked — ready to start</div>
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-zinc-600 inline-block" /> Locked — complete prerequisites first</div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
                <span className="text-zinc-500">Solid lines = active path, dashed = locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
