import { queryOptions } from "@tanstack/react-query";
import { getCourses } from "@/lib/courses.functions";

export const coursesQueryOptions = queryOptions({
  queryKey: ["courses"],
  queryFn: () => getCourses(),
  staleTime: 60_000,
});
