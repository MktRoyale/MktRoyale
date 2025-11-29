"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MktRoyaleTitle from "@/components/MktRoyaleTitle";

export default function Home() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    // Define a SIMPLE static target time (e.g., 48 hours from now) for display purposes.
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2); // Two days from now

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        // Simple calculation for days, hours, minutes, seconds format
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        clearInterval(timer);
        setTimeLeft('Draft is Closed');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEnterArena = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Branded Title */}
      <MktRoyaleTitle />

      {/* Dynamic Status Display */}
      <div className="text-center mb-12">
        <p
          className="text-xl md:text-2xl font-medium mb-6"
          style={{
            color: 'var(--off-white-text)',
            fontFamily: 'Roboto Mono, monospace'
          }}
        >
          Draft Closes In:{' '}
          <span
            className="countdown-timer"
            style={{
              color: 'var(--electric-yellow)'
            }}
          >
            {timeLeft}
          </span>
        </p>

        {/* Enter Button */}
        <button
          onClick={handleEnterArena}
          className="cyber-button text-xl px-12 py-6"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
