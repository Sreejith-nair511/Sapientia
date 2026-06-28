"use client";

import { useState, useRef, use } from "react";
import dynamic from "next/dynamic";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Brain, CheckSquare, Clock, Code2, FileText,
  FolderKanban, Info, Library, Sparkles, Target, TrendingUp,
  HelpCircle, Lock, Unlock, Circle, CheckCircle2, RotateCcw,
  Star, ExternalLink, Download, Copy, Play, ChevronDown, Plus,
  Zap, BarChart2, GitMerge, AlertTriangle, Layers
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useTopicData } from "@/hooks/useTopicData";
import { useTopicProgress } from "@/hooks/useTopicProgress";

// Lazy load Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ─── TYPES ─────────────────────────────────────────────────────────────────
type ChecklistKey =
  | "theory" | "watch_playlist" | "read_docs" | "read_notes"
  | "easy_problems" | "medium_problems" | "hard_problems"
  | "revision_1" | "revision_2" | "revision_3"
  | "interview_prep" | "mini_project" | "full_project" | "contest" | "mastered";

interface ChecklistItem { key: ChecklistKey; label: string; xp: number; }

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { key: "theory",          label: "Read Theory",                xp: 20 },
  { key: "watch_playlist",  label: "Watch Playlist",             xp: 15 },
  { key: "read_docs",       label: "Read Official Documentation", xp: 15 },
  { key: "read_notes",      label: "Review Personal Notes",      xp: 10 },
  { key: "easy_problems",   label: "Solve Easy Problems (3+)",   xp: 30 },
  { key: "medium_problems", label: "Solve Medium Problems (5+)", xp: 50 },
  { key: "hard_problems",   label: "Solve Hard Problems (2+)",   xp: 80 },
  { key: "revision_1",      label: "Revision 1 (1 Day)",         xp: 20 },
  { key: "revision_2",      label: "Revision 2 (7 Days)",        xp: 20 },
  { key: "revision_3",      label: "Revision 3 (30 Days)",       xp: 20 },
  { key: "interview_prep",  label: "Interview Preparation",      xp: 40 },
  { key: "mini_project",    label: "Mini Project",               xp: 60 },
  { key: "full_project",    label: "Full Project",               xp: 100 },
  { key: "contest",         label: "Contest Practice",           xp: 50 },
  { key: "mastered",        label: "Topic Mastered ✓",           xp: 200 },
];

const LANGUAGES = ["cpp", "python", "java", "javascript", "typescript", "sql", "markdown"] as const;
type Lang = typeof LANGUAGES[number];

const LANG_LABELS: Record<Lang, string> = {
  cpp: "C++", python: "Python", java: "Java",
  javascript: "JavaScript", typescript: "TypeScript",
  sql: "SQL", markdown: "Markdown"
};

const STARTER_CODE: Record<Lang, string> = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  python: `# Your solution here
def solution():
    pass

if __name__ == "__main__":
    solution()`,
  java: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
  javascript: `// Your solution here
function solution() {

}

console.log(solution());`,
  typescript: `// Your solution here
function solution(): void {

}

solution();`,
  sql: `-- Your SQL query here
SELECT * FROM table_name WHERE condition;`,
  markdown: `# Topic Notes

## Key Concepts

- Point 1
- Point 2

## Code Example

\`\`\`cpp
// Example code
\`\`\``
};

const DEFAULT_NOTE = `# Arrays & Hashing - Personal Notes

## Core Concept
An **array** stores elements at contiguous memory locations. Hashing maps keys to values for O(1) lookups.

## Key Patterns
- **Two Pointers**: Use when array is sorted.
- **Hash Map**: Use for O(1) lookups, avoid O(N²).

## Complexity
| Operation | Array | HashMap |
|-----------|-------|---------|
| Access    | O(1)  | O(1)*   |
| Search    | O(N)  | O(1)*   |
| Insert    | O(N)  | O(1)*   |

\`\`\`cpp
// Two Sum - classic hash map usage
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        if (mp.count(target - nums[i]))
            return {mp[target - nums[i]], i};
        mp[nums[i]] = i;
    }
    return {};
}
\`\`\`
`;

const MOCK_PROBLEMS = [
  { name: "Two Sum", diff: "Easy", status: "solved", platform: "LeetCode", tags: ["Google", "Amazon"], time: 12, favorite: true },
  { name: "Group Anagrams", diff: "Medium", status: "solved", platform: "LeetCode", tags: ["Microsoft"], time: 28, favorite: false },
  { name: "Longest Consecutive", diff: "Medium", status: "revise", platform: "LeetCode", tags: ["Google"], time: 45, favorite: false },
];

const MOCK_RESOURCES = [
  { title: "NeetCode Arrays Playlist", type: "youtube", status: "watching" },
  { title: "Introduction to Algorithms (CLRS) - Ch. 11", type: "book", status: "bookmarked" },
  { title: "C++ STL Reference — unordered_map", type: "documentation", status: "completed" },
  { title: "Striver A2Z Sheet", type: "article", status: "watching" },
];

const INTERVIEW_QUESTIONS = [
  { q: "What is the time complexity of HashMap insertion?", category: "Theory" },
  { q: "Explain hash collision and how it is resolved.", category: "Theory" },
  { q: "Design a data structure that supports insert, delete, and getRandom in O(1).", category: "Coding" },
  { q: "When would you use an array over a linked list?", category: "Behavioral" },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function WorkspacePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const { topic, loading: topicLoading } = useTopicData(topicId);
  const { checklist, toggleCheck, loading: progressLoading } = useTopicProgress(topic?.id);
  const [noteContent, setNoteContent] = useState(DEFAULT_NOTE);
  const [activeNoteType, setActiveNoteType] = useState("personal_notes");
  const [lang, setLang] = useState<Lang>("cpp");
  const [code, setCode] = useState(STARTER_CODE.cpp);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [interviewConfidence, setInterviewConfidence] = useState(0);

  const completed = Object.values(checklist).filter(Boolean).length;
  const progress = Math.round((completed / CHECKLIST_ITEMS.length) * 100);

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    setCode(STARTER_CODE[newLang]);
  };

  const flashcards = [
    { front: "What is the load factor in a HashMap?", back: "Load factor = (# of elements) / (capacity). Default in Java is 0.75. When exceeded, the map rehashes." },
    { front: "O(1) vs O(N) search: when?", back: "O(1) with a HashMap if you pre-process. O(N) with brute force linear scan. Use HashMap for frequency tracking." },
    { front: "Two-pointer technique — when to apply?", back: "When array is sorted and you need pairs/subarrays summing to target. Eliminates the need for nested loops." },
  ];

  return (
    <div className="flex h-full flex-col lg:flex-row bg-background overflow-hidden">

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPIC HEADER */}
        <div className="px-8 py-5 border-b bg-card shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">Curriculum</Badge>
                <ChevronDown className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{topic?.title || "Topic"}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{topic?.title || "Loading..."}</h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3" /> {topic?.estimated_hours || 0} hrs logged</span>
                <span className="flex items-center gap-1"><Target className="size-3" /> Difficulty: {topic?.difficulty || "Medium"}</span>
                <span className="flex items-center gap-1"><BarChart2 className="size-3" /> Importance: {topic?.importance || "High"}</span>
              </div>
            </div>
            <div className="flex gap-4 items-center shrink-0">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-24 h-2" />
                  <span className="text-sm font-bold">{progress}%</span>
                </div>
              </div>
              <Badge className={
                progress === 100 ? "bg-purple-500 hover:bg-purple-600" :
                progress > 50 ? "bg-green-500 hover:bg-green-600" :
                progress > 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""
              } variant="secondary">
                {progress === 100 ? "Mastered" : progress > 50 ? "Intermediate" : progress > 0 ? "Learning" : "Not Started"}
              </Badge>
            </div>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 border-b bg-card shrink-0">
            <TabsList className="h-11 bg-transparent rounded-none space-x-1 p-0">
              {[
                { value: "overview", label: "Overview", icon: Info },
                { value: "checklist", label: "Checklist", icon: CheckSquare },
                { value: "notes", label: "Notes", icon: FileText },
                { value: "editor", label: "Code Editor", icon: Code2 },
                { value: "practice", label: "Practice", icon: Target },
                { value: "revision", label: "Revision", icon: RotateCcw },
                { value: "resources", label: "Resources", icon: Library },
                { value: "interview", label: "Interview Prep", icon: Brain },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent h-11 px-4 text-sm gap-1.5"
                >
                  <tab.icon className="size-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ── OVERVIEW TAB ── */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto p-8 space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Definition</CardTitle></CardHeader>
                  <CardContent className="text-muted-foreground text-sm leading-relaxed space-y-4">
                    <p>{topic?.definition || "Definition not available."}</p>
                    <p><strong>Why it exists:</strong> {topic?.why_it_exists || "Not available."}</p>
                    <p><strong>Real-world usage:</strong> {topic?.real_world_usage || "Not available."}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg">Complexity Reference</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operation</TableHead>
                          <TableHead>Array</TableHead>
                          <TableHead>HashMap (avg)</TableHead>
                          <TableHead>HashMap (worst)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ["Access", "O(1)", "O(1)", "O(N)"],
                          ["Search", "O(N)", "O(1)", "O(N)"],
                          ["Insert", "O(N)", "O(1)", "O(N)"],
                          ["Delete", "O(N)", "O(1)", "O(N)"],
                        ].map(([op, a, b, c]) => (
                          <TableRow key={op}>
                            <TableCell className="font-medium">{op}</TableCell>
                            <TableCell className="font-mono text-xs">{a}</TableCell>
                            <TableCell className="font-mono text-xs text-green-500">{b}</TableCell>
                            <TableCell className="font-mono text-xs text-red-400">{c}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Learning Objectives</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {(topic?.learning_objectives || []).map((obj: string) => (
                      <div key={obj} className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Company Frequency</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {(topic?.company_frequency || []).map((c: string) => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Prerequisites</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-primary" /> Variables & Types</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-primary" /> Loops & Conditions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Next Topics</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {["Two Pointers", "Sliding Window", "Linked Lists"].map(t => (
                      <div key={t} className="flex items-center justify-between text-sm cursor-pointer hover:text-primary">
                        <span>{t}</span>
                        <ChevronDown className="size-3 -rotate-90" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── CHECKLIST TAB ── */}
          <TabsContent value="checklist" className="flex-1 overflow-y-auto p-8 mt-0">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Learning Checklist</h2>
                  <span className="text-sm font-bold text-primary">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{completed} of {CHECKLIST_ITEMS.length} items completed · {CHECKLIST_ITEMS.filter((_, i) => checklist[CHECKLIST_ITEMS[i].key]).reduce((sum, item) => sum + item.xp, 0)} XP earned</p>
              </div>
              <div className="space-y-2">
                {CHECKLIST_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 ${checklist[item.key] ? "bg-primary/5 border-primary/20" : "bg-card"}`}
                  >
                    {checklist[item.key]
                      ? <CheckCircle2 className="size-5 text-primary shrink-0" />
                      : <Circle className="size-5 text-muted-foreground shrink-0" />}
                    <span className={`flex-1 text-sm font-medium ${checklist[item.key] ? "line-through text-muted-foreground" : ""}`}>
                      {item.label}
                    </span>
                    <Badge variant="secondary" className="text-xs">+{item.xp} XP</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── NOTES TAB ── */}
          <TabsContent value="notes" className="flex-1 overflow-hidden mt-0 flex flex-col">
            <div className="flex gap-2 px-8 py-3 border-b bg-card shrink-0 flex-wrap">
              {[
                { key: "personal_notes", label: "Personal Notes" },
                { key: "tricks", label: "Tricks & Patterns" },
                { key: "mistakes", label: "Mistakes" },
                { key: "revision", label: "Revision Sheet" },
                { key: "interview_prep", label: "Interview Notes" },
              ].map(tab => (
                <Button
                  key={tab.key}
                  variant={activeNoteType === tab.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveNoteType(tab.key)}
                  className="text-xs h-8"
                >
                  {tab.label}
                </Button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground self-center">Auto-saved</span>
            </div>
            <div className="flex-1 grid grid-cols-2 overflow-hidden">
              <div className="flex flex-col border-r overflow-hidden">
                <div className="bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground border-b flex justify-between">
                  <span>Markdown</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-5 text-xs px-1">
                      <Download className="size-3 mr-1" /> Export
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="flex-1 border-0 focus-visible:ring-0 rounded-none resize-none font-mono text-sm p-4 bg-transparent leading-relaxed"
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <div className="bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground border-b">
                  Preview
                </div>
                <div className="flex-1 p-6 overflow-y-auto prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted/50 prose-pre:rounded-lg">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{noteContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── CODE EDITOR TAB ── */}
          <TabsContent value="editor" className="flex-1 overflow-hidden mt-0 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-card shrink-0 flex-wrap">
              <div className="flex gap-1">
                {LANGUAGES.map(l => (
                  <Button
                    key={l}
                    variant={lang === l ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleLangChange(l)}
                    className="text-xs h-7 px-2"
                  >
                    {LANG_LABELS[l]}
                  </Button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setEditorTheme(t => t === "vs-dark" ? "light" : "vs-dark")}>
                  {editorTheme === "vs-dark" ? "☀️ Light" : "🌙 Dark"}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <Copy className="size-3 mr-1" /> Copy
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <Download className="size-3 mr-1" /> Download
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <Star className="size-3 mr-1" /> Save Snippet
                </Button>
              </div>
            </div>
            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <MonacoEditor
                language={lang === "markdown" ? "markdown" : lang}
                theme={editorTheme}
                value={code}
                onChange={val => setCode(val ?? "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  lineNumbers: "on",
                  renderLineHighlight: "all",
                  wordWrap: "on",
                }}
              />
            </div>
            {/* Console */}
            <div className="border-t bg-zinc-950 text-zinc-400 text-xs font-mono p-3 h-20 shrink-0">
              <div className="flex items-center gap-2 mb-1 text-zinc-500">
                <Play className="size-3" /> Console Output
              </div>
              <span className="text-zinc-600">Run your code to see output here...</span>
            </div>
          </TabsContent>

          {/* ── PRACTICE TAB ── */}
          <TabsContent value="practice" className="flex-1 overflow-y-auto p-8 mt-0 space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: "Easy", count: 1, color: "text-green-500 border-green-500/20" },
                { label: "Medium", count: 2, color: "text-yellow-500 border-yellow-500/20" },
                { label: "Hard", count: 0, color: "text-red-500 border-red-500/20" },
              ].map(d => (
                <Card key={d.label} className={`border ${d.color}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${d.color.split(" ")[0]}`}>{d.count}</div>
                    <div className="text-xs text-muted-foreground">{d.label} Solved</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Problem Tracker</CardTitle>
                  <CardDescription>All problems for Arrays & Hashing</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="size-4 mr-1" /> Add Problem
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Problem</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Companies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PROBLEMS.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Star className={`size-4 cursor-pointer ${p.favorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                        </TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            p.diff === "Easy" ? "text-green-500 border-green-500/20 text-xs" :
                            p.diff === "Medium" ? "text-yellow-500 border-yellow-500/20 text-xs" :
                            "text-red-500 border-red-500/20 text-xs"
                          }>{p.diff}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.platform}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.time}m</TableCell>
                        <TableCell><div className="flex gap-1 flex-wrap">{p.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px] px-1">{t}</Badge>)}</div></TableCell>
                        <TableCell>
                          <Badge variant={p.status === "solved" ? "default" : "outline"} className="text-xs capitalize">
                            {p.status === "revise" ? "🔄 Revise" : "✓ Solved"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-xs h-7">Notes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── REVISION / FLASHCARDS TAB ── */}
          <TabsContent value="revision" className="flex-1 overflow-y-auto p-8 mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FLASHCARDS */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Flashcards ({flashcards.length})</h2>
                <div
                  className="h-48 rounded-xl border bg-card cursor-pointer flex items-center justify-center p-6 text-center transition-all hover:border-primary/50"
                  onClick={() => setFlashcardFlipped(f => !f)}
                >
                  <div>
                    <Badge variant="outline" className="mb-3 text-xs">{flashcardFlipped ? "Answer" : "Question"}</Badge>
                    <p className="text-sm font-medium">
                      {flashcardFlipped ? flashcards[activeFlashcard].back : flashcards[activeFlashcard].front}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">Click to {flashcardFlipped ? "see question" : "reveal answer"}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" onClick={() => { setActiveFlashcard(i => Math.max(0, i - 1)); setFlashcardFlipped(false); }}>← Previous</Button>
                  <span className="text-xs text-muted-foreground">{activeFlashcard + 1} / {flashcards.length}</span>
                  <Button variant="outline" size="sm" onClick={() => { setActiveFlashcard(i => Math.min(flashcards.length - 1, i + 1)); setFlashcardFlipped(false); }}>Next →</Button>
                </div>
                <div className="flex gap-2 justify-center">
                  {["😓 Hard", "😐 Okay", "😊 Easy"].map(label => (
                    <Button key={label} variant="outline" size="sm" className="text-xs">{label}</Button>
                  ))}
                </div>
              </div>
              {/* REVISION SCHEDULE */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Spaced Repetition</h2>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {[
                      { interval: "1 Day", date: "Not scheduled", status: "pending" },
                      { interval: "3 Days", date: "Not scheduled", status: "pending" },
                      { interval: "7 Days", date: "Not scheduled", status: "pending" },
                      { interval: "15 Days", date: "Not scheduled", status: "pending" },
                      { interval: "30 Days", date: "Not scheduled", status: "pending" },
                      { interval: "60 Days", date: "Not scheduled", status: "pending" },
                      { interval: "90 Days", date: "Not scheduled", status: "pending" },
                    ].map(r => (
                      <div key={r.interval} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{r.interval}</span>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                        <Lock className="size-3 text-muted-foreground" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Button className="w-full" variant="outline">
                  <RotateCcw className="size-4 mr-2" /> Schedule Revision Now
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ── RESOURCES TAB ── */}
          <TabsContent value="resources" className="flex-1 overflow-y-auto p-8 mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Resources Library</h2>
              <Button size="sm"><Plus className="size-4 mr-1" /> Add Resource</Button>
            </div>
            {["youtube", "book", "documentation", "article", "github", "paper"].map(type => {
              const items = MOCK_RESOURCES.filter(r => r.type === type);
              if (!items.length) return null;
              const labels: Record<string, string> = {
                youtube: "YouTube Playlists", book: "Books",
                documentation: "Documentation", article: "Articles & Blogs",
                github: "GitHub Repos", paper: "Research Papers"
              };
              return (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{labels[type]}</h3>
                  <div className="space-y-2">
                    {items.map((res, i) => (
                      <Card key={i} className="hover:border-primary/40 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BookOpen className="size-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{res.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs capitalize">{res.status}</Badge>
                            <Button variant="ghost" size="sm" className="h-7">
                              <ExternalLink className="size-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* ── INTERVIEW PREP TAB ── */}
          <TabsContent value="interview" className="flex-1 overflow-y-auto p-8 mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Interview Question Bank</h2>
                  <Button size="sm"><Plus className="size-4 mr-1" /> Add Question</Button>
                </div>
                {["Theory", "Coding", "Behavioral"].map(cat => (
                  <div key={cat}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{cat} Questions</h3>
                    <div className="space-y-2">
                      {INTERVIEW_QUESTIONS.filter(q => q.category === cat).map((q, i) => (
                        <Card key={i} className="hover:border-primary/40 transition-all cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-sm">{q.q}</p>
                              <div className="flex gap-2 shrink-0">
                                <Badge variant="outline" className="text-xs">{cat}</Badge>
                                <Button variant="ghost" size="sm" className="h-6 text-xs px-2">View Answer</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Interview Readiness</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">{interviewConfidence}%</div>
                      <p className="text-xs text-muted-foreground mt-1">Confidence Score</p>
                    </div>
                    <Progress value={interviewConfidence} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs" onClick={() => setInterviewConfidence(c => Math.min(100, c + 10))}>
                        + Confident
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setInterviewConfidence(c => Math.max(0, c - 10))}>
                        - Not Ready
                      </Button>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      {[
                        { label: "Theory Score", val: 0 },
                        { label: "Coding Score", val: 0 },
                        { label: "Questions Reviewed", val: 0 },
                      ].map(s => (
                        <div key={s.label} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className="font-medium">{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── AI SIDEBAR ── */}
      <div className="w-72 border-l bg-card flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2 text-sm">
            <Brain className="size-4 text-primary" /> AI Study Assistant
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Get instant help for this topic.</p>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { label: "Explain Simply", icon: Sparkles },
            { label: "Give Real Examples", icon: BookOpen },
            { label: "Generate Mini Quiz", icon: Target },
            { label: "Create Flashcards", icon: Brain },
            { label: "Generate Problems", icon: Code2 },
            { label: "Summarize Notes", icon: FileText },
            { label: "Make Revision Sheet", icon: RotateCcw },
            { label: "Interview Questions", icon: HelpCircle },
          ].map(btn => (
            <Button
              key={btn.label}
              variant="outline"
              className="w-full justify-start text-xs h-9 bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/40"
            >
              <btn.icon className="size-3.5 mr-2.5 shrink-0" />
              {btn.label}
            </Button>
          ))}
        </div>
        <div className="p-4 border-t space-y-3">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-3">
              <p className="text-xs font-medium mb-1">Next Revision</p>
              <p className="text-lg font-bold">Not Scheduled</p>
              <p className="text-xs opacity-80 mt-0.5">Complete checklist to start.</p>
            </CardContent>
          </Card>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Mastery Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
    </div>
  );
}
