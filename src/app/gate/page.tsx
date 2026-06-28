"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, Calculator, Target, BookOpen, Clock,
  CheckSquare, HelpCircle, TrendingUp, ChevronDown, ChevronRight
} from "lucide-react";

const GATE_SUBJECTS = [
  {
    id: "engg-math",
    name: "Engineering Mathematics",
    weight: 15,
    progress: 0,
    chapters: [
      { title: "Discrete Mathematics", topics: ["Sets & Relations", "Functions", "Propositional Logic", "Predicate Logic", "Proof Techniques", "Graph Theory Basics", "Counting & Pigeonhole", "Recurrence Relations"] },
      { title: "Linear Algebra", topics: ["Matrix operations", "Rank & nullity", "Eigenvalues & eigenvectors", "Linear transformations", "System of equations"] },
      { title: "Calculus", topics: ["Limits & continuity", "Differentiation", "Integration", "Maxima/Minima", "Taylor & Maclaurin series"] },
      { title: "Probability & Statistics", topics: ["Probability axioms", "Conditional probability & Bayes", "Random variables", "Distributions (Normal, Binomial)", "Expectation & variance"] },
    ],
  },
  {
    id: "digital-logic",
    name: "Digital Logic",
    weight: 7,
    progress: 0,
    chapters: [
      { title: "Boolean Algebra", topics: ["Postulates & theorems", "De Morgan's laws", "K-Map minimization", "Quine-McCluskey"] },
      { title: "Combinational Circuits", topics: ["Adders & Subtractors", "MUX/DEMUX", "Encoders/Decoders", "Comparators"] },
      { title: "Sequential Circuits", topics: ["Flip-flops (SR, D, JK, T)", "Registers", "Counters (ripple & synchronous)", "Finite State Machines"] },
    ],
  },
  {
    id: "coa",
    name: "Computer Organization & Architecture",
    weight: 8,
    progress: 0,
    chapters: [
      { title: "Basic Organization", topics: ["Machine instructions & addressing modes", "ALU design", "Control unit (hardwired vs microprogrammed)"] },
      { title: "Memory Organization", topics: ["Cache memory (direct, associative, set-associative)", "Cache replacement policies", "Virtual memory & paging", "Memory hierarchy"] },
      { title: "Pipelining", topics: ["Instruction pipeline stages", "Pipeline hazards (structural, data, control)", "Forwarding & stalling", "Branch prediction"] },
      { title: "I/O Organization", topics: ["Programmed I/O", "Interrupt-driven I/O", "DMA"] },
    ],
  },
  {
    id: "programming-ds",
    name: "Programming & Data Structures",
    weight: 10,
    progress: 0,
    chapters: [
      { title: "Programming in C", topics: ["Data types", "Control flow", "Functions & recursion", "Pointers & arrays", "Structures", "Dynamic memory"] },
      { title: "Abstract Data Types", topics: ["Stacks & Queues", "Linked Lists", "Trees (Binary, BST, AVL)", "Heaps", "Graphs (representation, BFS, DFS)"] },
    ],
  },
  {
    id: "algorithms",
    name: "Algorithms",
    weight: 10,
    progress: 0,
    chapters: [
      { title: "Algorithm Analysis", topics: ["Asymptotic notation (O, Ω, Θ)", "Recurrence relations (Master theorem)", "Time & space complexity"] },
      { title: "Algorithm Design", topics: ["Divide & conquer", "Greedy algorithms", "Dynamic programming", "Backtracking"] },
      { title: "Graph Algorithms", topics: ["Shortest paths (Dijkstra, Bellman-Ford)", "MST (Prim, Kruskal)", "Topological sort", "Strongly connected components"] },
      { title: "Sorting & Searching", topics: ["Comparison sorts", "Counting/radix sort", "Binary search variants", "Hashing"] },
    ],
  },
  {
    id: "toc",
    name: "Theory of Computation",
    weight: 8,
    progress: 0,
    chapters: [
      { title: "Regular Languages", topics: ["DFA & NFA", "Regular expressions", "Equivalence (NFA→DFA)", "Pumping lemma for regular"] },
      { title: "Context-Free Languages", topics: ["CFG", "PDA", "CFL properties", "Pumping lemma for CFL", "Ambiguity"] },
      { title: "Turing Machines & Computability", topics: ["TM definition", "Variants (multi-tape, non-deterministic)", "Decidability & undecidability", "Halting problem", "Reductions"] },
      { title: "Complexity Theory", topics: ["P, NP, NP-hard, NP-complete", "Reductions (SAT, 3-CNF-SAT, Clique)"] },
    ],
  },
  {
    id: "compiler-design",
    name: "Compiler Design",
    weight: 5,
    progress: 0,
    chapters: [
      { title: "Lexical Analysis", topics: ["Tokens & patterns", "Lexeme & regular expressions", "LEX tool"] },
      { title: "Syntax Analysis", topics: ["Context-free grammars", "Parse trees & derivations", "Top-down parsing (LL(1))", "Bottom-up parsing (SLR, CLR, LALR)"] },
      { title: "Semantic Analysis & Code Gen", topics: ["Syntax-directed definitions", "Symbol table", "Type checking", "Intermediate code", "Code optimization basics"] },
    ],
  },
  {
    id: "os",
    name: "Operating Systems",
    weight: 9,
    progress: 0,
    chapters: [
      { title: "Process Management", topics: ["Process vs thread", "CPU scheduling (FCFS, SJF, RR, Priority)", "Context switching", "IPC"] },
      { title: "Concurrency", topics: ["Critical section", "Mutex & semaphores", "Monitors", "Deadlock (prevention, avoidance, detection)"] },
      { title: "Memory Management", topics: ["Segmentation & paging", "Virtual memory", "Page replacement (LRU, FIFO, Optimal)", "Thrashing"] },
      { title: "File Systems", topics: ["File system structure", "Directory implementation", "Inodes", "RAID levels"] },
    ],
  },
  {
    id: "dbms",
    name: "Databases",
    weight: 9,
    progress: 0,
    chapters: [
      { title: "Relational Model & SQL", topics: ["Relational algebra", "SQL (SELECT, JOIN, GROUP BY)", "Aggregate functions", "Views & indexes"] },
      { title: "Database Design", topics: ["ER model & mapping to relational", "Normalization (1NF to BCNF)", "Functional dependencies"] },
      { title: "Transactions & Concurrency", topics: ["ACID properties", "Concurrency control (2PL)", "Isolation levels", "Deadlock in databases"] },
    ],
  },
  {
    id: "networks",
    name: "Computer Networks",
    weight: 9,
    progress: 0,
    chapters: [
      { title: "Network Fundamentals", topics: ["OSI & TCP/IP model", "Physical layer basics", "Data link: framing, error detection (CRC), MAC"] },
      { title: "Network Layer", topics: ["IP addressing & subnetting", "Routing algorithms (Dijkstra, Bellman-Ford)", "OSPF, RIP, BGP overview"] },
      { title: "Transport Layer", topics: ["TCP (3-way handshake, congestion control)", "UDP", "Socket programming basics"] },
      { title: "Application Layer", topics: ["HTTP/HTTPS", "DNS", "SMTP/POP3/IMAP", "FTP/SFTP"] },
    ],
  },
];

export default function GATEPage() {
  const [subject, setSubject] = useState<string | null>(null);
  const [chapterIdx, setChapterIdx] = useState(0);

  const activeSubject = GATE_SUBJECTS.find(s => s.id === subject);
  const chapter = activeSubject?.chapters[chapterIdx];
  const totalWeight = GATE_SUBJECTS.reduce((a, s) => a + s.weight, 0);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
              <GraduationCap className="size-8 text-orange-400" />
              GATE CS / IT
            </h1>
            <p className="text-zinc-400 text-sm">Graduate Aptitude Test in Engineering — Complete preparation hub.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-zinc-500">Total Weight</div>
              <div className="text-lg font-bold text-zinc-200">{totalWeight} marks</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500">Subjects</div>
              <div className="text-lg font-bold text-zinc-200">{GATE_SUBJECTS.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Subject list */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Subjects & Weightage</h2>
          {GATE_SUBJECTS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSubject(s.id === subject ? null : s.id); setChapterIdx(0); }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                subject === s.id
                  ? "bg-zinc-800 border-zinc-600"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-zinc-200 truncate">{s.name}</span>
                  <Badge className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/20 shrink-0">{s.weight}m</Badge>
                </div>
                <div className="mt-1.5">
                  <Progress value={s.progress} className="h-1" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Subject detail */}
        <div className="lg:col-span-2">
          {activeSubject ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{activeSubject.name}</h2>
                <p className="text-sm text-zinc-500">
                  Weightage: <span className="text-orange-400 font-semibold">{activeSubject.weight} marks</span> ({Math.round(activeSubject.weight / totalWeight * 100)}% of paper) • {activeSubject.chapters.length} chapters
                </p>
              </div>

              {/* Chapter tabs */}
              <div className="flex flex-wrap gap-2">
                {activeSubject.chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => setChapterIdx(i)}
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

              {/* Chapter topics */}
              {chapter && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                    <BookOpen className="size-4 text-orange-400" /> {chapter.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {chapter.topics.map(topic => (
                      <div key={topic} className="flex items-center gap-2 p-2.5 bg-zinc-800/60 rounded-lg text-xs text-zinc-300">
                        <CheckSquare className="size-3 text-green-400 shrink-0" /> {topic}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GATE tips */}
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-orange-400 flex items-center gap-2 mb-2">
                  <Target className="size-4" /> GATE Strategy Tips for {activeSubject.name}
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  <li>• Solve all previous year GATE questions for this subject from GATE Overflow.</li>
                  <li>• Focus on understanding concepts, not memorization — GATE tests application.</li>
                  <li>• Time-box each chapter: 2–3 hours study + 1 hour PYQ practice.</li>
                  <li>• Take subject-wise mock tests after completing each chapter.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-600">
              <GraduationCap className="size-12 mb-3 opacity-30" />
              <p className="text-sm">Select a subject to view chapters and topics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
