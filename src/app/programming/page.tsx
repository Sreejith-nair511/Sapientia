"use client";

import { useState } from "react";
import { LANGUAGE_TRACKS } from "@/data/languages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Code2, Clock, BookOpen, ChevronDown, ChevronRight,
  CheckCircle2, Play, Layers, ArrowRight
} from "lucide-react";

const LANG_COLORS: Record<string, string> = {
  cpp: "from-blue-600/20 to-cyan-600/20 border-blue-500/30",
  python: "from-yellow-600/20 to-green-600/20 border-yellow-500/30",
  java: "from-orange-600/20 to-red-600/20 border-orange-500/30",
  javascript: "from-yellow-500/20 to-amber-600/20 border-yellow-400/30",
  typescript: "from-blue-500/20 to-indigo-600/20 border-blue-400/30",
};

export default function ProgrammingPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<Record<string, string>>({});

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
          <Code2 className="size-8 text-indigo-400" />
          Programming Languages
        </h1>
        <p className="text-zinc-400 text-sm">Deep-dive learning tracks with 50–70 lessons per language.</p>
      </div>

      <div className="p-4 sm:p-8 space-y-4">
        {LANGUAGE_TRACKS.map(lang => {
          const isExpanded = expanded === lang.id;
          const colorClass = LANG_COLORS[lang.id] || "from-indigo-600/20 to-purple-600/20 border-indigo-500/30";
          const currentModule = activeModule[lang.id] || lang.modules[0]?.id;
          const module = lang.modules.find(m => m.id === currentModule) || lang.modules[0];

          return (
            <div key={lang.id} className={`bg-gradient-to-br ${colorClass} border rounded-2xl overflow-hidden transition-all duration-300`}>
              {/* Language header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : lang.id)}
                className="w-full flex items-start justify-between p-6 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-zinc-900/60 flex items-center justify-center text-xl font-black text-zinc-100 shrink-0">
                    {lang.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-zinc-100">{lang.name}</h2>
                      <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs">{lang.useCase.split(',')[0].trim()}</Badge>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium mb-1">{lang.tagline}</p>
                    <p className="text-xs text-zinc-500 max-w-lg line-clamp-1">{lang.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-zinc-200">{lang.totalLessons} lessons</div>
                    <div className="text-xs text-zinc-500">{lang.estimatedHours}h estimated</div>
                  </div>
                  <div className="size-8 rounded-lg bg-zinc-900/60 flex items-center justify-center">
                    {isExpanded ? <ChevronDown className="size-4 text-zinc-400" /> : <ChevronRight className="size-4 text-zinc-400" />}
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-white/10 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Module list */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Modules</h3>
                    {lang.modules.map((mod, i) => (
                      <button
                        key={mod.id}
                        onClick={() => setActiveModule(prev => ({ ...prev, [lang.id]: mod.id }))}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          currentModule === mod.id
                            ? "bg-zinc-800 border-zinc-600"
                            : "bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700"
                        }`}
                      >
                        <div className="size-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-200">{mod.title}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{mod.lessons.length} lessons</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Lesson list */}
                  {module && (
                    <div className="lg:col-span-2 space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{module.title} — Lessons</h3>
                        <span className="text-xs text-zinc-600">{module.lessons.length} lessons</span>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {module.lessons.map((lesson, i) => (
                          <div key={lesson.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-all group cursor-pointer">
                            <div className="size-6 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-500 shrink-0">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-zinc-200 truncate">{lesson.title}</div>
                              <div className="text-xs text-zinc-500 truncate">{lesson.description}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                lesson.difficulty === "Beginner" ? "text-green-400 bg-green-500/10" :
                                lesson.difficulty === "Intermediate" ? "text-yellow-400 bg-yellow-500/10" :
                                lesson.difficulty === "Advanced" ? "text-orange-400 bg-orange-500/10" :
                                "text-red-400 bg-red-500/10"
                              }`}>{lesson.difficulty}</span>
                              <span className="text-xs text-zinc-600 flex items-center gap-1">
                                <Clock className="size-3" />{lesson.duration}
                              </span>
                              <Play className="size-3.5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 gap-2">
                        Start {lang.name} Track <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
