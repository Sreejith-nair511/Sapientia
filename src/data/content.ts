// ============================================================
// ENGINEERING OS — COMPLETE CONTENT DATA LAYER
// All educational content stored as structured data
// ============================================================

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  topics: string[];
}

export interface LanguageTrack {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
  useCase: string;
  totalLessons: number;
  estimatedHours: number;
  modules: LanguageModule[];
}

export interface LanguageModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface DSATopic {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  importance: "Low" | "Medium" | "High" | "Critical";
  estimatedHours: number;
  description: string;
  definition: string;
  whyItMatters: string;
  realWorldUsage: string;
  complexity: { time: string; space: string };
  subtopics: string[];
  leetcodeProblems: { name: string; difficulty: "Easy" | "Medium" | "Hard"; url: string }[];
  companies: string[];
  prerequisites: string[];
}

export interface AIModule {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  topics: AITopic[];
}

export interface AITopic {
  title: string;
  description: string;
  subtopics: string[];
  math?: string;
  codeExample?: string;
  resources: string[];
}

export interface CoreCSSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  chapters: CoreCSChapter[];
}

export interface CoreCSChapter {
  title: string;
  topics: string[];
  interviewQuestions: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  techStack: string[];
  features: string[];
  learningOutcomes: string[];
  estimatedDays: number;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  totalWeeks: number;
  phases: RoadmapPhase[];
}

export interface RoadmapPhase {
  week: string;
  title: string;
  goals: string[];
  topics: string[];
  projects: string[];
}
