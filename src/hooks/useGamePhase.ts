import { useState, useEffect } from 'react';

export type GamePhase = 'DRAFT_OPEN' | 'TRADING_WEEK' | 'INTERMISSION';

export interface GameStatus {
  phase: GamePhase;
  countdown: string;
  description: string;
  showEnterButton: boolean;
}

export const useGamePhase = (): GameStatus => {
  const [status, setStatus] = useState<GameStatus>({
    phase: 'DRAFT_OPEN',
    countdown: '23:45:12',
    description: 'Draft Closes In:',
    showEnterButton: true
  });

  useEffect(() => {
    // For now, simulate draft open phase
    // In production, this would check actual game state from database
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Simple logic: Draft open on weekdays, trading week on weekdays after draft, intermission on weekends
    let phase: GamePhase;
    let showEnterButton = false;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend - intermission
      phase = 'INTERMISSION';
    } else if (now.getHours() < 16) {
      // Before 4 PM ET on weekdays - draft/trading open
      phase = now.getHours() >= 9 && now.getHours() < 12 ? 'DRAFT_OPEN' : 'TRADING_WEEK';
    } else {
      // After 4 PM ET - intermission until next day
      phase = 'INTERMISSION';
    }

    // Show enter button during draft phase
    if (phase === 'DRAFT_OPEN') {
      showEnterButton = true;
    }

    // Mock countdown - in production this would be real timer
    const countdown = phase === 'DRAFT_OPEN' ? '23:45:12' :
                     phase === 'TRADING_WEEK' ? '142 players' : '2d 14h 32m';

    const description = phase === 'DRAFT_OPEN' ? 'Draft Closes In:' :
                       phase === 'TRADING_WEEK' ? 'Players Remaining:' : 'Next Draft Starts In:';

    setStatus({
      phase,
      countdown,
      description,
      showEnterButton
    });
  }, []);

  return status;
};
