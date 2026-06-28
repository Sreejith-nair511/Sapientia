"use client";

import { useState } from "react";
import Link from "next/link";
import { DSA_TOPICS, DSA_CATEGORIES } from "@/data/dsa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Network, Search, Code2, Clock, Building2, ChevronRight,
  Flame, Star, TrendingUp, BookOpen, CheckCircle2, Filter
} from "lucide-react";

const DIFFICULTY_CONFIG = {
  Easy:   { color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  Hard:   { color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
  Expert: { color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
};

const IMPORTANCE_CONFIG = {
  Critical: { color: "text-red-400",    icon: <Flame className="size-3" /> },
  High:     { color: "text-orange-400", icon: <TrendingUp className="size-3" /> },
  Medium:   { color: "text-yellow-400", icon: <Star className="size-3" /> },
  Low:      { color: "text-zinc-400",   icon: <BookOpen className="size-3" /> },
};

export default function DSAPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const filtered = DSA_TOPICS.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchDiff = activeDifficulty === "All" || t.difficulty === activeDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const totalProblems = DSA_TOPICS.reduce((acc, t) => acc + t.leetcodeProblems.length, 0);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
              <Network className="size-7 sm:size-8 text-blue-400 shrink-0" />
              Data Structures & Algorithms
            </h1>
            <p className="text-zinc-400 text-sm">Striver A2Z + NeetCode roadmap. Master every pattern.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500 flex-wrap">
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs">
              <Code2 className="size-3.5 text-blue-400" />
              <span className="font-bold text-zinc-200">{DSA_TOPICS.length}</span> topics
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs">
              <CheckCircle2 className="size-3.5 text-green-400" />
              <span className="font-bold text-zinc-200">{totalProblems}</span> problems
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs">
              <Clock className="size-3.5 text-purple-400" />
              <span className="font-bold text-zinc-200">{DSA_TOPICS.reduce((a, t) => a + t.estimatedHours, 0)}h</span> total
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <Input
              placeholder="Search topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 w-56 bg-zinc-900 border-zinc-800 text-zinc-300 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", ...DSA_CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium ${
                  activeCategory === cat
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {["All", "Easy", "Medium", "Hard"].map(d => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium ${
                  activeDifficulty === d
                    ? "bg-zinc-700 border-zinc-600 text-zinc-200"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic grid */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((topic, i) => {
            const diffCfg = DIFFICULTY_CONFIG[topic.difficulty];
            const impCfg = IMPORTANCE_CONFIG[topic.importance];
            return (
              <div key={topic.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 flex flex-col gap-3">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${diffCfg.bg} ${diffCfg.color}`}>
                        {topic.difficulty}
                      </span>
                      <span className={`flex items-center gap-1 text-xs font-medium ${impCfg.color}`}>
                        {impCfg.icon} {topic.importance}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-100 text-base leading-tight">{topic.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{topic.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                    <Clock className="size-3" />
                    {topic.estimatedHours}h
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{topic.description}</p>

                {/* Complexity */}
                <div className="bg-zinc-950 rounded-lg p-2.5 font-mono text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span className="text-zinc-400">Time:</span>
                    <span className="text-blue-400">{topic.complexity.time.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 mt-1">
                    <span className="text-zinc-400">Space:</span>
                    <span className="text-purple-400">{topic.complexity.space}</span>
                  </div>
                </div>

                {/* Key subtopics */}
                <div className="flex flex-wrap gap-1">
                  {topic.subtopics.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-2 py-0.5">{s}</span>
                  ))}
                  {topic.subtopics.length > 3 && (
                    <span className="text-xs text-zinc-600">+{topic.subtopics.length - 3} more</span>
                  )}
                </div>

                {/* LeetCode problems */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-zinc-500">Problems</span>
                    <span className="text-xs text-zinc-600">{topic.leetcodeProblems.length} total</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {topic.leetcodeProblems.slice(0, 3).map(p => (
                      <a
                        key={p.name}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs px-1.5 py-0.5 rounded border transition-colors hover:underline ${
                          p.difficulty === "Easy" ? "text-green-400 border-green-500/20 bg-green-500/5 hover:bg-green-500/10" :
                          p.difficulty === "Medium" ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10" :
                          "text-red-400 border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                        }`}
                      >
                        {p.name}
                      </a>
                    ))}
                    {topic.leetcodeProblems.length > 3 && (
                      <span className="text-xs text-zinc-600">+{topic.leetcodeProblems.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Companies */}
                <div className="flex items-center gap-1.5 mt-auto">
                  <Building2 className="size-3 text-zinc-600 shrink-0" />
                  <span className="text-xs text-zinc-600 truncate">{topic.companies.slice(0, 3).join(", ")}</span>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    {topic.prerequisites.length > 0 ? `Requires: ${topic.prerequisites.length} topic${topic.prerequisites.length > 1 ? "s" : ""}` : "No prerequisites"}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 gap-1">
                    Study <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-600">
            <Network className="size-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No topics match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
