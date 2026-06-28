"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase, Building2, Code2, FileText, Users, ChevronRight,
  CheckSquare, Star, ExternalLink, Target, BookOpen, AlertCircle
} from "lucide-react";

const COMPANIES = [
  {
    name: "Google",
    tier: "FAANG",
    color: "#4285F4",
    rounds: ["Online Assessment (90 min)", "Phone Screen (45 min)", "4× Onsite (45 min each)"],
    focus: ["DSA (Hard level)", "System Design (Senior+)", "Behavioral (Googleyness)"],
    tips: "Google emphasizes clean code, edge cases, and communication. Don't just solve — explain your thought process. Know BFS/DFS, DP, and graphs deeply.",
    resources: ["Tech Dev Guide (Google)", "Neetcode Blind 75", "CTCI book"],
  },
  {
    name: "Amazon",
    tier: "FAANG",
    color: "#FF9900",
    rounds: ["OA: 2 coding problems", "2× Technical interviews", "Bar Raiser (Leadership Principles)"],
    focus: ["DSA (Medium-Hard)", "System Design", "Leadership Principles (STAR format)"],
    tips: "Amazon's LP interviews are as important as technical rounds. Prepare 2–3 stories per LP (14 principles). OA tests medium DP, graphs, arrays.",
    resources: ["Amazon LPs official page", "Neetcode 150", "STAR method guide"],
  },
  {
    name: "Microsoft",
    tier: "FAANG",
    color: "#00A4EF",
    rounds: ["OA: 1–2 problems", "3–4 Interviews", "As-Appropriate round"],
    focus: ["DSA (Easy-Medium)", "OOP & Design", "Behavioral"],
    tips: "Microsoft values problem-solving approach and code quality. They often ask about OOP, design patterns, and how you'd architect small systems.",
    resources: ["Leetcode Top Interview 150", "CTCI for OOP"],
  },
  {
    name: "Meta",
    tier: "FAANG",
    color: "#1877F2",
    rounds: ["Phone Screen (45 min)", "4 Onsite: 2 Coding + 1 System Design + 1 Behavioral"],
    focus: ["DSA (Medium-Hard)", "System Design", "Behavioral (STAR)"],
    tips: "Meta interviews are fast-paced. Coding rounds expect 2 optimal solutions per 45 min. Know arrays, graphs, DP, and sliding window patterns cold.",
    resources: ["Meta Interview Prep Portal", "Exponent (System Design)", "Neetcode 150"],
  },
  {
    name: "Apple",
    tier: "FAANG",
    color: "#555555",
    rounds: ["Technical Screen", "4–5 Onsite interviews", "Team-specific interviews"],
    focus: ["DSA", "Coding quality", "Domain-specific (iOS/macOS for SWE)"],
    tips: "Apple interviews depend heavily on the team. For general SWE, expect medium DSA + OOP. Code must be clean and production-quality.",
    resources: ["Neetcode 150", "Swift/Obj-C for iOS roles"],
  },
  {
    name: "Atlassian",
    tier: "Tier-2",
    color: "#0052CC",
    rounds: ["Karat Screen (1 hr, automated)", "2 Technical + Values"],
    focus: ["DSA (Easy-Medium)", "System thinking", "Agile/Values"],
    tips: "Atlassian uses Karat for screening — it's timed with a human evaluator. They value team collaboration and impact. System design is light.",
    resources: ["Leetcode Easy/Medium", "Atlassian Engineering blog"],
  },
];

const RESUME_TIPS = [
  { tip: "Use strong action verbs: Designed, Implemented, Optimized, Architected, Led", priority: "High" },
  { tip: "Quantify every achievement: 'Reduced latency by 40%' not 'improved performance'", priority: "High" },
  { tip: "Keep it to 1 page (for < 5 years experience)", priority: "High" },
  { tip: "Use ATS-friendly formatting: clean font, no tables, no headers/footers", priority: "Medium" },
  { tip: "Tailor for each company — match their job description keywords", priority: "Medium" },
  { tip: "Lead with strongest projects: open source contributions > course projects", priority: "Medium" },
  { tip: "GitHub link must have pinned repos with READMEs and live demos", priority: "High" },
];

const BEHAVIORAL_QUESTIONS = [
  "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
  "Describe a project you're most proud of. What was your specific contribution?",
  "Tell me about a time you failed. What did you learn?",
  "How do you handle ambiguity when requirements are unclear?",
  "Tell me about a time you took initiative beyond your assigned role.",
  "Describe a situation where you had to deliver under tight deadlines.",
  "How do you prioritize when you have multiple competing tasks?",
  "Tell me about a time you influenced a technical decision without authority.",
];

const STUDY_PLAN = [
  { week: "1–4", title: "DSA Core", tasks: ["Complete Arrays, Hashing, Two Pointers", "Complete Sliding Window, Stack, Binary Search", "Solve 50 LeetCode Easy/Medium problems"] },
  { week: "5–8", title: "DSA Advanced", tasks: ["Trees, Graphs (BFS/DFS, Topological Sort)", "Dynamic Programming (15 classic patterns)", "Total: 100 LeetCode problems"] },
  { week: "9–12", title: "System Design", tasks: ["Study URL shortener, rate limiter, Twitter design", "Learn caching, sharding, CAP theorem", "Practice 5 full system design interviews"] },
  { week: "13–16", title: "Behavioral + Mock", tasks: ["Prepare 2 STAR stories per Amazon LP", "Do 10 mock interviews (Pramp, Interviewing.io)", "Apply to target companies, refine resume"] },
];

export default function PlacementsPage() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [showBehavioral, setShowBehavioral] = useState(false);

  const company = COMPANIES.find(c => c.name === activeCompany);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
          <Briefcase className="size-8 text-sky-400" />
          Placement Preparation
        </h1>
        <p className="text-zinc-400 text-sm">Company-specific prep, resume tips, behavioral guides, and study plans.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Company grid */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Company-Specific Prep</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {COMPANIES.map(co => (
              <button
                key={co.name}
                onClick={() => setActiveCompany(activeCompany === co.name ? null : co.name)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeCompany === co.name
                    ? "bg-zinc-800 border-zinc-600"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: co.color + "33", border: `1px solid ${co.color}44`, color: co.color }}>
                      {co.name.slice(0, 2)}
                    </div>
                    <span className="font-bold text-zinc-100">{co.name}</span>
                  </div>
                  <Badge className={`text-xs ${co.tier === "FAANG" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                    {co.tier}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {co.focus.slice(0, 2).map(f => (
                    <span key={f} className="text-xs bg-zinc-800 text-zinc-400 rounded px-1.5 py-0.5">{f}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Company detail */}
          {company && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Interview Rounds</h3>
                <ol className="space-y-2">
                  {company.rounds.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className="size-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center shrink-0 font-bold">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Focus Areas</h3>
                <ul className="space-y-1.5">
                  {company.focus.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                      <Target className="size-3 text-orange-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Resources</h3>
                  {company.resources.map(r => (
                    <div key={r} className="text-xs text-indigo-400 mb-1 flex items-center gap-1 hover:text-indigo-300 cursor-pointer">
                      <ExternalLink className="size-3" /> {r}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Insider Tips</h3>
                <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-800 rounded-xl p-3">{company.tips}</p>
              </div>
            </div>
          )}
        </div>

        {/* Study plan + Resume in 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 16-week plan */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="font-bold text-zinc-200 flex items-center gap-2">
                <Target className="size-4 text-green-400" /> 16-Week Placement Plan
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {STUDY_PLAN.map((phase, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 text-xs font-mono text-indigo-400 bg-indigo-500/10 rounded px-2 py-0.5 h-fit mt-0.5">
                    Wk {phase.week}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-200 mb-1">{phase.title}</div>
                    <ul className="space-y-1">
                      {phase.tasks.map(task => (
                        <li key={task} className="flex items-start gap-1.5 text-xs text-zinc-400">
                          <CheckSquare className="size-3 text-green-400 shrink-0 mt-0.5" /> {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume tips */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="font-bold text-zinc-200 flex items-center gap-2">
                <FileText className="size-4 text-yellow-400" /> Resume Checklist
              </h2>
            </div>
            <div className="p-5 space-y-2.5">
              {RESUME_TIPS.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 bg-zinc-800/60 rounded-xl">
                  <AlertCircle className={`size-3.5 shrink-0 mt-0.5 ${item.priority === "High" ? "text-red-400" : "text-yellow-400"}`} />
                  <span className="text-xs text-zinc-400">{item.tip}</span>
                  <Badge className={`text-xs ml-auto shrink-0 ${item.priority === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Behavioral questions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="font-bold text-zinc-200 flex items-center gap-2">
              <Users className="size-4 text-purple-400" /> Behavioral Interview Questions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-zinc-500"
              onClick={() => setShowBehavioral(!showBehavioral)}
            >
              {showBehavioral ? "Hide" : "Reveal All"}
            </Button>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {BEHAVIORAL_QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-zinc-800/60 rounded-xl">
                <span className="size-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i + 1}</span>
                <span className={`text-xs transition-all ${showBehavioral ? "text-zinc-300" : "text-zinc-600 blur-sm select-none"}`}>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
