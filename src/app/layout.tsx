import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ThemeToaster } from "@/components/ThemeToaster";
import "@/styles.css";

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export const metadata: Metadata = {
  title: {
    default: "NextGen Learn — Next-Gen Learning Platform",
    template: "%s — NextGen Learn",
  },
  description:
    "A premium, animated learning platform with real-time progress, courses, and activity insights.",
  openGraph: {
    title: "NextGen Learn — Next-Gen Learning Platform",
    description:
      "Master new skills, track progress, and achieve your goals with our next-generation learning platform.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Blocking theme script — prevents flash of incorrect theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = JSON.parse(localStorage.getItem('user-settings-v2') || '{}');
                if (s.themeMode === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
                if (s.fontSize) {
                  var sizes = { small: '14px', medium: '16px', large: '18px' };
                  document.documentElement.style.fontSize = sizes[s.fontSize] || '16px';
                }
                if (s.themeColor) {
                  var colors = { violet: '#8b5cf6', blue: '#3b82f6', emerald: '#10b981', orange: '#f97316', rose: '#f43f5e' };
                  document.documentElement.style.setProperty('--theme-accent', colors[s.themeColor] || '#8b5cf6');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <ThemeToaster />
      </body>
    </html>
  );
}
