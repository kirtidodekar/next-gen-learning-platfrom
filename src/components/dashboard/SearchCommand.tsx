"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: "course" | "lesson" | "achievement";
  url: string;
}

const mockResults: SearchResult[] = [
  { id: "1", title: "Advanced React Patterns", type: "course", url: "/courses" },
  { id: "2", title: "TypeScript Mastery", type: "course", url: "/courses" },
  { id: "3", title: "Next.js Architecture", type: "course", url: "/courses" },
  { id: "4", title: "Database Design", type: "course", url: "/courses" },
  { id: "5", title: "First Steps Achievement", type: "achievement", url: "/analytics" },
  { id: "6", title: "Week Warrior Badge", type: "achievement", url: "/analytics" },
];

const recentSearches = ["React", "TypeScript", "Achievements"];

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockResults.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-2xl -translate-x-1/2"
          >
            <div className="mx-4 overflow-hidden rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
                <Search className="size-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search courses, lessons, achievements..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="rounded-lg bg-white/5 p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.length === 0 ? (
                  <div className="p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Recent Searches
                    </p>
                    <div className="space-y-1">
                      {recentSearches.map((search, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(search)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5"
                        >
                          <Clock className="size-4 text-muted-foreground" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No results found</p>
                  </div>
                ) : (
                  <div className="p-2">
                    <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </p>
                    {results.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                          index === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-2 ${
                            result.type === "course"
                              ? "bg-violet/20"
                              : "bg-emerald/20"
                          }`}
                        >
                          {result.type === "course" ? (
                            <TrendingUp className="size-4 text-violet-300" />
                          ) : (
                            <Search className="size-4 text-emerald-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{result.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {result.type}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 px-4 py-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5">↑</kbd>{" "}
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5">↓</kbd> navigate
                  </span>
                  <span>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5">↵</kbd> select
                  </span>
                  <span>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5">esc</kbd> close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
