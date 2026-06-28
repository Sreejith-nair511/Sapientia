"use client";

import { useState } from "react";
import { RESOURCES, RESOURCE_CATEGORIES, RESOURCE_TYPES } from "@/data/resources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Library, Search, ExternalLink, Star, Book, Video, Globe, GitBranch, FileText, BookOpen } from "lucide-react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Book:    <Book className="size-3.5" />,
  Course:  <BookOpen className="size-3.5" />,
  YouTube: <Video className="size-3.5" />,
  Website: <Globe className="size-3.5" />,
  GitHub:  <GitBranch className="size-3.5" />,
  Article: <FileText className="size-3.5" />,
  Paper:   <FileText className="size-3.5" />,
  Tool:    <Globe className="size-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  Book:    "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Course:  "text-blue-400 bg-blue-500/10 border-blue-500/20",
  YouTube: "text-red-400 bg-red-500/10 border-red-500/20",
  Website: "text-green-400 bg-green-500/10 border-green-500/20",
  GitHub:  "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Paper:   "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Tool:    "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const filtered = RESOURCES.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const matchType = activeType === "All" || r.type === activeType;
    return matchSearch && matchCat && matchType;
  });

  const freeCount = RESOURCES.filter(r => r.isFree).length;

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
              <Library className="size-8 text-amber-400" />
              Resource Library
            </h1>
            <p className="text-zinc-400 text-sm">
              {RESOURCES.length} curated resources — {freeCount} free. The best of the internet for engineers.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg px-3 py-1.5">
              {freeCount} Free
            </span>
            <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg px-3 py-1.5">
              {RESOURCES.length - freeCount} Paid
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <Input
            placeholder="Search resources, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-8"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {RESOURCE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                activeCategory === cat
                  ? "bg-amber-600/20 border-amber-500/40 text-amber-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1.5">
          {RESOURCE_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                activeType === type
                  ? "bg-zinc-700 border-zinc-600 text-zinc-200"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(resource => (
          <div key={resource.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group flex flex-col gap-3">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border ${TYPE_COLORS[resource.type] || "text-zinc-400"}`}>
                    {TYPE_ICONS[resource.type]} {resource.type}
                  </span>
                  <span className="text-xs text-zinc-500 bg-zinc-800 rounded-md px-1.5 py-0.5">{resource.category}</span>
                  {resource.isFree
                    ? <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded px-1.5 py-0.5">Free</span>
                    : <span className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded px-1.5 py-0.5">Paid</span>
                  }
                </div>
                <h3 className="font-bold text-zinc-100 text-sm leading-snug">{resource.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">by {resource.author}</p>
              </div>
              {/* Rating stars */}
              <div className="flex shrink-0">
                {Array.from({ length: resource.rating }).map((_, i) => (
                  <Star key={i} className="size-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{resource.description}</p>

            {/* Difficulty */}
            <div className="text-xs text-zinc-500">
              <span className="text-zinc-600">Level: </span>{resource.difficulty}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-1.5 py-0.5">{tag}</span>
              ))}
            </div>

            {/* Visit link */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-1.5 text-xs py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
            >
              <ExternalLink className="size-3.5" /> Visit Resource
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          <Library className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No resources match your filter.</p>
        </div>
      )}
    </div>
  );
}
