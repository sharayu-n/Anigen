import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Anigen | Collaborative AI Storytelling",
  description: "Create immersive stories, personalized avatars, and cinematic videos with AI. Collaborative storytelling for creators.",
  keywords: ["AI", "storytelling", "manga", "video generation", "characters", "collaborative"],
  openGraph: {
    title: "Anigen | Collaborative AI Storytelling",
    description: "Co-create stories and turn them into animated videos or manga panels.",
    type: "website",
    siteName: "Anigen",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased min-h-screen selection:bg-accent-cyan/30 selection:text-accent-cyan">
        <Navbar />
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
