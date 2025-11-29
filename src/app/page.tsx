"use client";

import { useRouter } from "next/navigation";
import MktRoyaleTitle from "@/components/MktRoyaleTitle";
import { getCurrentGameStatus } from "@/hooks/useChromeWarTimers";

export default function Home() {
  const router = useRouter();

  // FORCE DRAFT STATE for landing page testing
  const { displayTag, targetTime, showEnterButton, countdown } = getCurrentGameStatus({
    forcePhase: 'DRAFT_OPEN',
    draftCloseDay: 1,
    draftCloseHour: 9,
    draftCloseMinute: 30
  });

  const handleEnterArena = () => {
    if (showEnterButton) {
      router.push('/draft');
    }
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
          {displayTag}:{' '}
          <span
            className="countdown-timer"
            style={{
              color: 'var(--electric-yellow)'
            }}
          >
            {countdown}
          </span>
        </p>

        {/* Enter Arena Button - Only show during draft phase */}
        {showEnterButton && (
          <button
            onClick={handleEnterArena}
            className="cyber-button text-xl px-12 py-6"
          >
            Enter Arena
          </button>
        )}
      </div>
    </div>
  );
}
