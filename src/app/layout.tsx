import type { Metadata, Viewport } from "next";
import "@/styles.css";

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export const metadata: Metadata = {
  title: {
    default: "Next-Gen Learning Dashboard",
    template: "%s — Next-Gen Learning",
  },
  description:
    "A premium, animated learning dashboard with real-time progress and activity insights.",
  authors: [{ name: "Lovable" }],
  openGraph: {
    title: "Next-Gen Learning Dashboard",
    description:
      "A premium, animated learning dashboard with real-time progress and activity insights.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@Lovable",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
