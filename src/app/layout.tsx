import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MktRoyale - Stock Market Battle Royale",
  description: "Battle it out in the ultimate stock market royale",
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
        <div className="min-h-screen bg-cyber-black">
          {/* Header Placeholder */}
          <header className="border-b border-neon-teal/20 bg-cyber-black/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-electric-yellow">
                  MktRoyale
                </h1>
                <div className="text-neon-teal">
                  Header Placeholder
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
