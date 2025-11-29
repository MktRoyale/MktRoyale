"use client";

import { useRouter } from "next/navigation";
import MktRoyaleTitle from "@/components/MktRoyaleTitle";
import { useGamePhase } from "@/hooks/useGamePhase";

export default function Home() {
  const router = useRouter();
  const { phase, countdown, description, showEnterButton } = useGamePhase();

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
          {description}{' '}
          <span
            style={{
              color: phase === 'DRAFT_OPEN' ? 'var(--electric-yellow)' : 'var(--neon-teal)'
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
