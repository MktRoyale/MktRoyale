import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import StarfieldBackground from "@/components/StarfieldBackground";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chrome War - Battle Royale for Stock Traders",
  description: "Enter the ultimate stock market battle royale. Draft your lineup, hack your rivals, and claim victory in Chrome War.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cyber-black text-white min-h-screen`}
      >
        {/* Animated Starfield Background */}
        <StarfieldBackground />

        <div className="min-h-screen bg-cyber-black relative z-10">
          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <NavBar />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
