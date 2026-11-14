import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joseph Ombati — AI × Data Science",
  description: "An immersive portfolio exploring AI, data science, and the systems that connect them.",
  applicationName: "Orbit Portfolio",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Joseph Ombati — AI × Data Science",
    description: "A cinematic portfolio at the intersection of AI and data science.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050914",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
