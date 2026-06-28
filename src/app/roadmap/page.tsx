"use client";

import { useState } from "react";
import { ROADMAPS } from "@/data/roadmaps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Map, ChevronRight, ChevronDown, CalendarDays, Target,
  BookOpen, Code2, FolderKanban, Clock, CheckSquare
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Placement:       "bg-blue-500/10 text-blue-400 border-blue-500/20",
  GATE:            "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Machine Learning": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Full Stack":    "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function RoadmapPage() {
  const [activeRoadmap, setActiveRoadmap] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<Record<string, boolean>>({});

  const roadmap = ROADMAPS.find(r => r.id === activeRoadmap);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
          <Map className="size-8 text-emerald-400" />
          Engineering Roadmaps
        </h1>
        <p className="text-zinc-400 text-sm">Structured, week-by-week learning paths for every engineering goal.</p>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap selector */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Choose a Roadmap</h2>
          {ROADMAPS.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRoadmap(r.id === activeRoadmap ? null : r.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                activeRoadmap === r.id
                  ? "bg-zinc-800 border-zinc-600"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-zinc-100 text-sm leading-snug">{r.title}</h3>
                <Badge className={`text-xs shrink-0 ${CATEGORY_COLORS[r.category] || "bg-zinc-800 text-zinc-400"}`}>
                  {r.category}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{r.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-zinc-600">
                <span className="flex items-center gap-1"><Clock className="size-3" /> {r.totalWeeks} weeks</span>
                <span className="flex items-center gap-1"><Target className="size-3" /> {r.phases.length} phases</span>
              </div>
            </button>
          ))}
        </div>

        {/* Roadmap detail */}
        <div className="lg:col-span-2">
          {roadmap ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-zinc-100 mb-1">{roadmap.title}</h2>
                <p className="text-sm text-zinc-400">{roadmap.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" /> {roadmap.totalWeeks} weeks total
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="size-4" /> {roadmap.phases.length} phases
                  </span>
                  <Badge className={CATEGORY_COLORS[roadmap.category] || "bg-zinc-800 text-zinc-400"}>
                    {roadmap.category}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-zinc-800" />
                <div className="space-y-3">
                  {roadmap.phases.map((phase, i) => {
                    const key = `${roadmap.id}-${i}`;
                    const isOpen = expandedPhase[key];
                    return (
                      <div key={i} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-3.5 top-4 size-3.5 rounded-full bg-indigo-500 border-2 border-zinc-950 z-10" />

                        <button
                          onClick={() => setExpandedPhase(prev => ({ ...prev, [key]: !prev[key] }))}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            isOpen
                              ? "bg-zinc-800 border-zinc-700"
                              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                Week {phase.week}
                              </span>
                              <span className="font-bold text-zinc-100 text-sm">{phase.title}</span>
                            </div>
                            {isOpen ? <ChevronDown className="size-4 text-zinc-400" /> : <ChevronRight className="size-4 text-zinc-400" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-2 ml-0.5 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Target className="size-3 text-green-400" /> Goals
                              </h4>
                              <ul className="space-y-1.5">
                                {phase.goals.map(g => (
                                  <li key={g} className="flex items-start gap-1.5 text-xs text-zinc-400">
                                    <CheckSquare className="size-3 text-green-400 shrink-0 mt-0.5" /> {g}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <BookOpen className="size-3 text-blue-400" /> Topics
                              </h4>
                              <ul className="space-y-1.5">
                                {phase.topics.map(t => (
                                  <li key={t} className="flex items-center gap-1.5 text-xs text-zinc-400">
                                    <span className="size-1.5 rounded-full bg-blue-400 shrink-0" /> {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {phase.projects.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <FolderKanban className="size-3 text-violet-400" /> Projects
                                </h4>
                                <ul className="space-y-1.5">
                                  {phase.projects.map(p => (
                                    <li key={p} className="flex items-center gap-1.5 text-xs text-zinc-400">
                                      <Code2 className="size-3 text-violet-400 shrink-0" /> {p}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 mt-4">
                Start This Roadmap <ChevronRight className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-600">
              <Map className="size-12 mb-3 opacity-30" />
              <p className="text-sm">Select a roadmap to view your week-by-week plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
