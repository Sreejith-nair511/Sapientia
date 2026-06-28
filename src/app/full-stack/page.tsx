"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers, Globe, Server, Database, Wind, Code2, Lock, Boxes,
  ArrowRight, CheckSquare, ExternalLink, ChevronRight, ChevronDown
} from "lucide-react";

const FULLSTACK_MODULES = [
  {
    id: "html-css",
    title: "HTML & CSS",
    icon: Globe,
    color: "#f97316",
    description: "The structure and style of the web. Master semantic HTML5 and modern CSS.",
    subtopics: ["Semantic HTML5 elements", "CSS Box Model", "Flexbox", "CSS Grid", "Responsive design (media queries)", "CSS animations & transitions", "CSS variables (custom properties)", "Accessibility (ARIA, a11y)"],
    projects: ["Portfolio website", "Responsive landing page"],
    resources: ["MDN Web Docs", "CSS-Tricks", "Kevin Powell (YouTube)"],
    interviewQ: ["What is the difference between display:none and visibility:hidden?", "Explain the CSS specificity rules.", "What is BEM naming convention?"],
  },
  {
    id: "javascript",
    title: "JavaScript (ES2024)",
    icon: Code2,
    color: "#f7df1e",
    description: "The language of the web. Event loop, closures, prototypes, async patterns.",
    subtopics: ["Event loop & call stack", "Closures & scope", "Prototype chain", "async/await & Promises", "Modules (ESM)", "Destructuring, spread, optional chaining", "WeakMap, WeakSet, Symbol", "Proxy & Reflect"],
    projects: ["Vanilla JS Todo App", "Weather Dashboard"],
    resources: ["javascript.info", "You Don't Know JS (book series)", "Eloquent JavaScript"],
    interviewQ: ["Explain event delegation.", "What is the difference between == and ===?", "How does the JavaScript event loop work?"],
  },
  {
    id: "typescript",
    title: "TypeScript",
    icon: Code2,
    color: "#3178c6",
    description: "Type-safe JavaScript for large codebases. Generics, utility types, decorators.",
    subtopics: ["Type inference", "Interfaces vs type aliases", "Union & intersection types", "Generics with constraints", "Utility types: Partial, Pick, Omit, Record", "Mapped types", "Conditional types", "Template literal types"],
    projects: ["Type-safe REST client", "Zod schema validation"],
    resources: ["TypeScript Handbook", "Total TypeScript (Matt Pocock)", "TypeScript Deep Dive"],
    interviewQ: ["What is the difference between any and unknown?", "Explain the infer keyword.", "When would you use interface vs type?"],
  },
  {
    id: "react",
    title: "React 19",
    icon: Layers,
    color: "#61dafb",
    description: "Component architecture, hooks, state management, and performance optimization.",
    subtopics: ["JSX & virtual DOM", "useState, useEffect, useRef", "useContext & state lifting", "Custom hooks", "React.memo, useMemo, useCallback", "Suspense & lazy loading", "React 19 Actions & transitions", "Error boundaries"],
    projects: ["GitHub user search app", "E-commerce product page"],
    resources: ["React Docs (react.dev)", "Josh Comeau blog", "Kent C. Dodds blog"],
    interviewQ: ["What causes unnecessary re-renders?", "When do you use useMemo vs useCallback?", "Explain React's reconciliation algorithm."],
  },
  {
    id: "nextjs",
    title: "Next.js 15",
    icon: Layers,
    color: "#ffffff",
    description: "Full-stack React framework. App Router, Server Components, Server Actions.",
    subtopics: ["App Router & file-based routing", "Server vs Client Components", "Server Actions & Forms", "Route Handlers (API routes)", "Parallel and intercepting routes", "Middleware", "Image optimization", "Caching strategies (unstable_cache)"],
    projects: ["Blog with MDX", "SaaS dashboard with auth"],
    resources: ["Next.js Docs", "Lee Robinson (YouTube)", "Sam Selikoff (YouTube)"],
    interviewQ: ["When do you use Server vs Client Components?", "How does Next.js caching work?", "What is the difference between generateStaticParams and dynamic routes?"],
  },
  {
    id: "backend",
    title: "Backend: Node.js & APIs",
    icon: Server,
    color: "#68a063",
    description: "REST APIs, authentication, file handling, and backend patterns.",
    subtopics: ["Express.js middleware pattern", "REST API design principles", "JWT authentication", "OAuth 2.0 flow", "File uploads (multipart/form-data)", "Rate limiting & security headers", "API versioning", "Error handling middleware"],
    projects: ["REST API with JWT auth", "File upload service"],
    resources: ["Express.js Docs", "Node.js Best Practices (GitHub)", "REST API Design Rulebook"],
    interviewQ: ["What is the difference between authentication and authorization?", "How does JWT work?", "What are HTTP status codes for different scenarios?"],
  },
  {
    id: "databases",
    title: "Databases & ORMs",
    icon: Database,
    color: "#336791",
    description: "PostgreSQL, SQL mastery, Supabase, Redis, and ORM patterns.",
    subtopics: ["PostgreSQL fundamentals", "Advanced SQL (JOINs, CTEs, Window functions)", "Database indexing & EXPLAIN", "Supabase (Postgres as a service)", "Prisma ORM", "Redis caching patterns", "Connection pooling", "Database migrations"],
    projects: ["Full CRUD app with Supabase", "Redis-cached API"],
    resources: ["PostgreSQL Tutorial", "Supabase Docs", "Prisma Docs"],
    interviewQ: ["What is N+1 query problem?", "When would you use Redis?", "Explain database indexing."],
  },
  {
    id: "auth",
    title: "Authentication & Security",
    icon: Lock,
    color: "#10b981",
    description: "Sessions, JWT, OAuth, OWASP top 10, and best practices.",
    subtopics: ["Session-based vs token-based auth", "JWT structure & validation", "OAuth 2.0 & OpenID Connect", "Clerk / NextAuth", "Password hashing (bcrypt, Argon2)", "CSRF protection", "SQL injection prevention", "OWASP Top 10"],
    projects: ["Auth system from scratch", "OAuth integration"],
    resources: ["OWASP Top 10", "Auth0 blog", "Clerk Docs"],
    interviewQ: ["What is the difference between authentication and authorization?", "What is CSRF?", "How do you store passwords securely?"],
  },
  {
    id: "devops",
    title: "DevOps & Deployment",
    icon: Wind,
    color: "#0ea5e9",
    description: "Docker, CI/CD with GitHub Actions, deployment to Vercel and cloud.",
    subtopics: ["Docker & docker-compose", "GitHub Actions CI/CD", "Vercel & Railway deployment", "Environment management (.env)", "Monitoring & logging", "Nginx reverse proxy", "SSL/TLS certificates", "Load balancing basics"],
    projects: ["Dockerized Next.js app", "Auto-deploy GitHub Actions pipeline"],
    resources: ["Docker Docs", "GitHub Actions Docs", "Vercel Docs"],
    interviewQ: ["What is a Docker container vs VM?", "Explain CI/CD pipeline.", "How do you manage secrets in production?"],
  },
];

export default function FullStackPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showInterviewQ, setShowInterviewQ] = useState<Record<string, boolean>>({});

  const module = FULLSTACK_MODULES.find(m => m.id === activeModule);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
          <Layers className="size-8 text-orange-400" />
          Full Stack Development
        </h1>
        <p className="text-zinc-400 text-sm">HTML to deployment. Every skill required to build production-grade web applications.</p>
      </div>

      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Module list */}
        <div className="space-y-2">
          {FULLSTACK_MODULES.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                activeModule === mod.id
                  ? "bg-zinc-800 border-zinc-600"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div
                className="size-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${mod.color}22`, border: `1px solid ${mod.color}33` }}
              >
                <mod.icon className="size-4" style={{ color: mod.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-200 truncate">{mod.title}</div>
                <div className="text-xs text-zinc-500">{mod.subtopics.length} subtopics</div>
              </div>
              {activeModule === mod.id
                ? <ChevronDown className="size-4 text-zinc-400 shrink-0" />
                : <ChevronRight className="size-4 text-zinc-400 shrink-0" />
              }
            </button>
          ))}
        </div>

        {/* Module detail */}
        <div className="lg:col-span-2">
          {module ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: `${module.color}22` }}>
                  <module.icon className="size-5" style={{ color: module.color }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">{module.title}</h2>
                  <p className="text-sm text-zinc-400">{module.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subtopics */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Topics</h3>
                  <ul className="space-y-1.5">
                    {module.subtopics.map(s => (
                      <li key={s} className="flex items-start gap-2 text-xs text-zinc-400">
                        <CheckSquare className="size-3 text-green-400 shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  {/* Projects */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Practice Projects</h3>
                    <ul className="space-y-1.5">
                      {module.projects.map(p => (
                        <li key={p} className="flex items-center gap-2 text-xs text-zinc-400">
                          <Code2 className="size-3 text-violet-400 shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Resources</h3>
                    <ul className="space-y-1.5">
                      {module.resources.map(r => (
                        <li key={r} className="flex items-center gap-2 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">
                          <ExternalLink className="size-3 shrink-0" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Interview Questions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interview Questions</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-zinc-500"
                    onClick={() => setShowInterviewQ(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                  >
                    {showInterviewQ[module.id] ? "Hide" : "Reveal"}
                  </Button>
                </div>
                <ul className="space-y-2">
                  {module.interviewQ.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="size-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                      <span className={`transition-all ${showInterviewQ[module.id] ? "text-zinc-300" : "text-zinc-600 blur-sm select-none"}`}>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-600">
              <Layers className="size-12 mb-3 opacity-30" />
              <p className="text-sm">Select a module to view full content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
