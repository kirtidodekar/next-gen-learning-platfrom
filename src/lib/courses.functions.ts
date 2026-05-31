import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Course } from "@/types/course";

export const getCourses = createServerFn({ method: "GET" }).handler(
  async (): Promise<Course[]> => {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("id, title, progress, icon_name, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[getCourses] supabase error", error);
      throw new Error(error.message);
    }
    return (data ?? []) as Course[];
  },
);
