"use client";

import { useState } from "react";
import { CORE_CS_SUBJECTS } from "@/data/core-cs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu, ChevronRight, ChevronDown, BookOpen, HelpCircle,
  CheckSquare, Layers
} from "lucide-react";

export default function CoreCSPage() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<Record<string, number>>({});
  const [showInterviewQ, setShowInterviewQ] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
          <Cpu className="size-8 text-cyan-400" />
          Core Computer Science
        </h1>
        <p className="text-zinc-400 text-sm">
          OS, DBMS, Networks, OOP, System Design — the fundamentals every engineer must master.
        </p>
      </div>

      <div className="p-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Subject list */}
        <div className="xl:col-span-1 space-y-2">
          {CORE_CS_SUBJECTS.map(subject => (
            <button
              key={subject.id}
              onClick={() => setActiveSubject(activeSubject === subject.id ? null : subject.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                activeSubject === subject.id
                  ? "bg-zinc-800 border-zinc-600"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div
                className="size-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${subject.color}22`, border: `1px solid ${subject.color}44` }}
              >
                <Layers className="size-4" style={{ color: subject.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-200 truncate">{subject.name}</div>
                <div className="text-xs text-zinc-500">{subject.chapters.length} chapters</div>
              </div>
              {activeSubject === subject.id
                ? <ChevronDown className="size-4 text-zinc-400 shrink-0" />
                : <ChevronRight className="size-4 text-zinc-400 shrink-0" />
              }
            </button>
          ))}
        </div>

        {/* Subject detail */}
        <div className="xl:col-span-3">
          {activeSubject ? (() => {
            const subject = CORE_CS_SUBJECTS.find(s => s.id === activeSubject)!;
            const chapterIdx = activeChapter[subject.id] ?? 0;
            const chapter = subject.chapters[chapterIdx];

            return (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: `${subject.color}22` }}>
                    <Layers className="size-5" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100">{subject.name}</h2>
                    <p className="text-sm text-zinc-400 mt-0.5">{subject.description}</p>
                  </div>
                </div>

                {/* Chapter tabs */}
                <div className="flex flex-wrap gap-2">
                  {subject.chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveChapter(prev => ({ ...prev, [subject.id]: i }))}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        chapterIdx === i
                          ? "bg-zinc-700 border-zinc-600 text-zinc-100"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      {ch.title}
                    </button>
                  ))}
                </div>

                {/* Chapter content */}
                {chapter && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Topics */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                      <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2 mb-3">
                        <BookOpen className="size-4 text-blue-400" /> Topics Covered
                      </h3>
                      <ul className="space-y-2">
                        {chapter.topics.map(topic => (
                          <li key={topic} className="flex items-start gap-2 text-sm text-zinc-400">
                            <CheckSquare className="size-3.5 text-green-400 shrink-0 mt-0.5" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interview Questions */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                          <HelpCircle className="size-4 text-orange-400" /> Interview Questions
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-zinc-500"
                          onClick={() => setShowInterviewQ(prev => ({ ...prev, [`${subject.id}-${chapterIdx}`]: !prev[`${subject.id}-${chapterIdx}`] }))}
                        >
                          {showInterviewQ[`${subject.id}-${chapterIdx}`] ? "Hide" : "Reveal"}
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {chapter.interviewQuestions.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="size-4 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                            <span className={`transition-all ${showInterviewQ[`${subject.id}-${chapterIdx}`] ? "text-zinc-300" : "text-zinc-600 blur-[3px] select-none"}`}>
                              {q}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-600">
              <Cpu className="size-12 mb-3 opacity-30" />
              <p className="text-sm">Select a subject to view its chapters and interview questions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
