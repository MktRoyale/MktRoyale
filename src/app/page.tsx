"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MktRoyaleTitle from "@/components/MktRoyaleTitle";
import { getDraftCloseTime, formatDraftCountdown } from "@/hooks/useChromeWarTimers";

export default function Home() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    // Calculate the accurate target time using getDraftCloseTime
    const targetDate = getDraftCloseTime(new Date());

    const timer = setInterval(() => {
      const now = new Date();
      const countdown = formatDraftCountdown(targetDate, now);
      setTimeLeft(countdown);

      // Stop timer if draft is closed
      if (countdown === 'Draft is Closed') {
        clearInterval(timer);
      }
    }, 1000);

    // Initial calculation
    setTimeLeft(formatDraftCountdown(targetDate));

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
