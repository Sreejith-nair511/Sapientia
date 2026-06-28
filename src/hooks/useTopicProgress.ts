import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export function useTopicProgress(topicId: string | undefined) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const supabase = createClient();

  useEffect(() => {
    if (!user || !topicId) return;

    async function fetchChecklist() {
      const { data } = await supabase
        .from("checklists")
        .select("item_key, is_completed")
        .eq("user_id", user?.id)
        .eq("topic_id", topicId);
        
      if (data) {
        const checkMap: Record<string, boolean> = {};
        data.forEach(item => {
          checkMap[item.item_key] = item.is_completed;
        });
        setChecklist(checkMap);
      }
      setLoading(false);
    }
    
    fetchChecklist();
  }, [user, topicId]);

  const toggleCheck = async (key: string) => {
    if (!user || !topicId) return;
    
    const isCompleted = !checklist[key];
    setChecklist(prev => ({ ...prev, [key]: isCompleted }));
    
    // Upsert into Supabase
    await supabase.from("checklists").upsert({
      user_id: user.id,
      topic_id: topicId,
      item_key: key,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null
    }, { onConflict: 'user_id, topic_id, item_key' });
  };

  return { checklist, toggleCheck, loading };
}
