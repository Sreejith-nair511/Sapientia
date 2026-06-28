"use client";

import { useState } from "react";
import { AI_MODULES } from "@/data/ai-ml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit, ChevronDown, ChevronRight, Code2, BookOpen,
  ExternalLink, Layers, ArrowRight, Lightbulb
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  FunctionSquare: <span className="text-lg">∑</span>,
  BrainCircuit: <BrainCircuit className="size-5" />,
  Network: <Layers className="size-5" />,
  Sparkles: <span className="text-lg">✦</span>,
  Eye: <span className="text-lg">👁</span>,
  MessageSquare: <span className="text-lg">💬</span>,
};

export default function AIPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<Record<string, number>>({});

  const totalTopics = AI_MODULES.reduce((a, m) => a + m.topics.length, 0);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
              <BrainCircuit className="size-8 text-purple-400" />
              AI & Machine Learning
            </h1>
            <p className="text-zinc-400 text-sm">From mathematical foundations to building LLM agents — the complete AI curriculum.</p>
          </div>
          <div className="flex items-center gap-3 text-sm shrink-0">
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
              <Layers className="size-3.5 text-purple-400" />
              <span className="font-bold text-zinc-200">{AI_MODULES.length}</span>
              <span className="text-zinc-500">modules</span>
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
              <BookOpen className="size-3.5 text-blue-400" />
              <span className="font-bold text-zinc-200">{totalTopics}</span>
              <span className="text-zinc-500">topics</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 space-y-4">
        {AI_MODULES.map(module => {
          const isOpen = activeModule === module.id;
          const topicIdx = activeTopic[module.id] ?? 0;
          const topic = module.topics[topicIdx];

          return (
            <div key={module.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {/* Module header */}
              <button
                onClick={() => setActiveModule(isOpen ? null : module.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-zinc-800/50 transition-colors"
              >
                <div
                  className="size-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: `${module.color}33`, border: `1px solid ${module.color}44`, color: module.color }}
                >
                  {ICON_MAP[module.icon] || <BrainCircuit className="size-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-zinc-100">{module.title}</h2>
                    <Badge className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700">{module.category}</Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{module.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-zinc-500">{module.topics.length} topics</span>
                  {isOpen ? <ChevronDown className="size-4 text-zinc-400" /> : <ChevronRight className="size-4 text-zinc-400" />}
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-zinc-800 p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* Topic sidebar */}
                  <div className="space-y-1.5">
                    {module.topics.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTopic(prev => ({ ...prev, [module.id]: i }))}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                          topicIdx === i
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                        }`}
                      >
                        <div className="size-5 rounded-md bg-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-zinc-400 shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium truncate">{t.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Topic detail */}
                  {topic && (
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-100 mb-1">{topic.title}</h3>
                        <p className="text-sm text-zinc-400">{topic.description}</p>
                      </div>

                      {/* Subtopics */}
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Subtopics</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.subtopics.map(s => (
                            <span key={s} className="text-xs bg-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Math formula */}
                      {topic.math && (
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <span>Key Formula</span>
                          </div>
                          <code className="text-sm text-purple-300 font-mono">{topic.math}</code>
                        </div>
                      )}

                      {/* Code example */}
                      {topic.codeExample && (
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                              <Code2 className="size-3" /> Code Example
                            </span>
                          </div>
                          <pre className="p-3 text-xs text-zinc-300 overflow-x-auto">
                            <code>{topic.codeExample}</code>
                          </pre>
                        </div>
                      )}

                      {/* Resources */}
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpen className="size-3" /> Resources
                        </h4>
                        <div className="space-y-1">
                          {topic.resources.map(r => (
                            <div key={r} className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
                              <ExternalLink className="size-3 shrink-0" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
