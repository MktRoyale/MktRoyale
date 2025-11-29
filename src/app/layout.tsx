import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import StarfieldBackground from "@/components/StarfieldBackground";

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
          {/* Header */}
          <header className="border-b border-neon-teal/20 bg-cyber-black/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-electric-yellow to-chrome-blue rounded-lg flex items-center justify-center">
                    <span className="text-cyber-black font-bold text-sm">CW</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-electric-yellow">
                      Chrome War
                    </h1>
                    <p className="text-xs text-neon-teal">Battle Royale for Stock Traders</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-400">
                    Draft Phase Active
                  </div>
                  <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </header>

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
