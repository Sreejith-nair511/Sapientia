import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function useTopicData(slug: string) {
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTopic() {
      const { data } = await supabase
        .from("topics")
        .select("*")
        .eq("slug", slug)
        .single();
        
      setTopic(data);
      setLoading(false);
    }
    
    if (slug) fetchTopic();
  }, [slug]);

  return { topic, loading };
}
