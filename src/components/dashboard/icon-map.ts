import {
  Layers,
  FileCode,
  Boxes,
  Database,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Layers,
  FileCode,
  Boxes,
  Database,
  BookOpen,
  Sparkles,
};

export function resolveIcon(name: string): LucideIcon {
  return map[name] ?? BookOpen;
}
