"use client";

import { use, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code2, Clock, Trophy, Target, BookOpen, ChevronRight, CheckCircle2, PlayCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  estimated_hours: number;
}

export default function TrackDashboardPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = use(params);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const supabase = createClient();

  useEffect(() => {
    const fetchTrack = async () => {
      // In a real app we'd fetch track by ID, but for now we fetch topics matching the track ID from URL
      // If it's a slug, we might need a slug field on tracks. For now, just fetch all topics if id is not matching.
      const { data } = await supabase
        .from('topics')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (data) setTopics(data);
      setLoading(false);
    };
    
    fetchTrack();
  }, [trackId]);

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Badge variant="secondary" className="mb-3">Programming Track</Badge>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Code2 className="size-10 text-primary" />
            C++ Mastery
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Master modern C++ from basics to advanced STL.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-sm font-medium mb-1">Current Progress</p>
            <div className="flex items-center gap-3">
              <Progress value={15} className="w-32 h-2" />
              <span className="font-bold">15%</span>
            </div>
          </div>
          <div className="w-px h-12 bg-border mx-2"></div>
          <Button className="shrink-0 h-12 px-6">
            <PlayCircle className="size-5 mr-2" /> Continue Learning
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Topics", val: topics.length, icon: BookOpen },
          { label: "Topics Mastered", val: "2", icon: Trophy },
          { label: "Hours Spent", val: "12h", icon: Clock },
          { label: "Current Level", val: "Apprentice", icon: Target },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.val}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABS */}
      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent pb-3 pt-2 px-1">Overview</TabsTrigger>
          <TabsTrigger value="roadmap" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent pb-3 pt-2 px-1">Roadmap & Topics</TabsTrigger>
          <TabsTrigger value="practice" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent pb-3 pt-2 px-1">Practice</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent pb-3 pt-2 px-1">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roadmap" className="pt-6">
          <div className="space-y-4">
            {topics.map((topic, i) => (
              <Link key={topic.id} href={`/workspace/${topic.slug}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group mb-4">
                  <CardContent className="p-5 flex items-center gap-6">
                    <div className="size-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{topic.title}</h3>
                        <Badge variant={topic.difficulty === 'Hard' ? 'destructive' : topic.difficulty === 'Easy' ? 'secondary' : 'default'} className="text-xs">
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                      
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="size-3" /> {topic.estimated_hours} hours</span>
                        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                          <Progress value={0} className="h-1.5 flex-1" />
                          <span>0%</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Overview content goes here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
