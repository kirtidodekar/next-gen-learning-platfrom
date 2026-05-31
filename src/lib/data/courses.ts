import "server-only";

import { supabaseServer } from "@/integrations/supabase/server";
import type { Course } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabaseServer
    .from("courses")
    .select("id, title, progress, icon_name, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getCourses] supabase error", error);
    throw new Error(error.message);
  }

  return (data ?? []) as Course[];
}
