import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About ArtDoU — California-based brand where art meets everyday life.",
};

export default function AboutLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
