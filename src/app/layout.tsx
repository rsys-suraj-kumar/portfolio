import type { Metadata, Viewport } from "next";
import "./globals.css";

// Competition-grade metadata for Awwwards/FWA
export const metadata: Metadata = {
  title: "Suraj Kumar | Senior Software Engineer - Temporal Drift Portfolio",
  description:
    "Award-winning portfolio of Suraj Kumar, a Senior Software Engineer specializing in high-performance React, Next.js, and creative WebGL experiences. Explore my journey through time.",
  keywords: [
    "Suraj Kumar",
    "Software Engineer",
    "React Developer",
    "Next.js",
    "WebGL",
    "Three.js",
    "Frontend Engineer",
    "Portfolio",
    "Creative Developer",
  ],
  authors: [{ name: "Suraj Kumar", url: "https://github.com/surajkumar85" }],
  creator: "Suraj Kumar",
  publisher: "Suraj Kumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://surajkumar.dev",
    siteName: "Suraj Kumar Portfolio",
    title: "Suraj Kumar | Senior Software Engineer",
    description:
      "Award-winning portfolio showcasing creative web development, WebGL experiences, and high-performance applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suraj Kumar - Senior Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suraj Kumar | Senior Software Engineer",
    description:
      "Award-winning portfolio showcasing creative web development and WebGL experiences.",
    images: ["/og-image.png"],
    creator: "@surajkumar",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
