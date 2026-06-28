"use client";

import { useState } from "react";
import { PROJECT_IDEAS, PROJECT_CATEGORIES } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban, Clock, Code2, ChevronRight, Plus,
  Star, Zap, BookOpen, CheckSquare, GitBranch
} from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner:     "text-green-400 bg-green-500/10 border-green-500/20",
  Intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Advanced:     "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Expert:       "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? PROJECT_IDEAS
    : PROJECT_IDEAS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
              <FolderKanban className="size-8 text-violet-400" />
              Engineering Projects
            </h1>
            <p className="text-zinc-400 text-sm">Build production-grade systems. Every project maps to real engineering skills.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 shrink-0">
            <Plus className="size-4" /> Add Project
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                activeCategory === cat
                  ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(project => {
          const isExpanded = expanded === project.id;
          return (
            <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200">
              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${DIFFICULTY_COLORS[project.difficulty] || "text-zinc-400"}`}>
                        {project.difficulty}
                      </span>
                      <span className="text-xs text-zinc-500 bg-zinc-800 rounded-md px-1.5 py-0.5">{project.category}</span>
                    </div>
                    <h3 className="font-bold text-zinc-100 leading-tight">{project.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                    <Clock className="size-3" />
                    {project.estimatedDays}d
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">{project.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-1.5 py-0.5 font-mono">{tech}</span>
                  ))}
                </div>

                {/* Key features (collapsed) */}
                {!isExpanded && (
                  <div className="flex flex-wrap gap-1">
                    {project.features.slice(0, 2).map(f => (
                      <span key={f} className="text-xs text-zinc-500 bg-zinc-800/60 rounded px-1.5 py-0.5">• {f}</span>
                    ))}
                    {project.features.length > 2 && (
                      <span className="text-xs text-zinc-600">+{project.features.length - 2} more</span>
                    )}
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="space-y-3 mt-2">
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Features</div>
                      <ul className="space-y-1">
                        {project.features.map(f => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Zap className="size-3 text-yellow-400 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">What You'll Learn</div>
                      <ul className="space-y-1">
                        {project.learningOutcomes.map(l => (
                          <li key={l} className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <CheckSquare className="size-3 text-green-400 shrink-0" /> {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs text-zinc-500 hover:text-zinc-300"
                  onClick={() => setExpanded(isExpanded ? null : project.id)}
                >
                  {isExpanded ? "Less" : "Details"} <ChevronRight className={`size-3 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </Button>
                <Button size="sm" className="ml-auto h-7 bg-violet-600 hover:bg-violet-700 text-xs gap-1.5">
                  <GitBranch className="size-3" /> Start Building
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
