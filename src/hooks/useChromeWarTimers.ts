import { useState, useEffect } from 'react';
import { toZonedTime, format } from 'date-fns-tz';

export interface ChromeWarTimerState {
  nextDropTime: Date | null;
  weekEndTime: Date;
  timeUntilNextDrop: number | null; // milliseconds
  timeUntilWeekEnd: number; // milliseconds
  isDropUrgent: boolean; // < 1 hour
  isFinalDropActive: boolean; // Friday 3-4 PM ET
  dropNumber: number | null; // 1, 2, or 3
  dropStatus: 'upcoming' | 'active' | 'completed';
  weekStatus: 'active' | 'final-drop' | 'completed';
}

// Core Constants - All times in ET (America/New_York)
const TIME_ZONE = 'America/New_York';
const MARKET_CLOSE_HOUR = 16; // 4 PM ET
const MARKET_CLOSE_MINUTE = 0;

// Helper function to get current ET time
const getCurrentETTime = (): Date => {
  const now = new Date();
  return toZonedTime(now, TIME_ZONE);
};

// Calculate next DROP time (Tuesday, Wednesday, Thursday at 4:00 PM ET)
export const getNextDropTime = (currentDate: Date): Date | null => {
  const nowET = toZonedTime(currentDate, TIME_ZONE);
  const dayOfWeek = nowET.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  // Drop days are Tue (2), Wed (3), Thu (4)
  for (let i = 0; i <= 3; i++) {
    const checkDate = new Date(nowET);
    checkDate.setDate(nowET.getDate() + i);
    const checkDay = checkDate.getDay();

    if (checkDay >= 2 && checkDay <= 4) {
      // Found a possible drop day
      let dropTime = new Date(checkDate);
      dropTime.setHours(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE, 0, 0);

      // If the current time is before the drop time, this is the one.
      if (dropTime.getTime() > nowET.getTime()) {
        return dropTime;
      }
    }
  }

  return null; // All drops completed for the current week
};

// Calculate week end time (next Friday at 4:00 PM ET)
export const getWeekEndTime = (currentDate: Date): Date => {
  const nowET = toZonedTime(currentDate, TIME_ZONE);
  let date = new Date(nowET);
  const day = date.getDay(); // 0=Sun, 5=Fri

  // Calculate days until next Friday
  let diff = 5 - day;
  if (day > 5) { // If it's Saturday or Sunday
    diff = 7 + 5 - day;
  }

  date.setDate(date.getDate() + diff);
  date.setHours(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE, 0, 0);

  // If it's currently Friday and past 4 PM ET, move to next Friday
  if (day === 5 && nowET.getTime() > date.getTime()) {
    date.setDate(date.getDate() + 7);
  }

  return date;
};

// Calculate next draft open time (next Monday at 9:30 AM ET)
export const getNextDraftOpenTime = (currentDate: Date): Date => {
  const nowET = toZonedTime(currentDate, TIME_ZONE);
  let date = new Date(nowET);
  const day = date.getDay(); // 0=Sun, 1=Mon

  // Calculate days until next Monday
  let diff = 1 - day;
  if (day >= 1) { // If it's Monday or later in the week
    diff = 8 - day; // Next Monday
  }

  date.setDate(date.getDate() + diff);
  date.setHours(9, 30, 0, 0); // 9:30 AM ET

  return date;
};

// Calculate draft close time (next Monday at 9:30 AM ET)
export const getDraftCloseTime = (currentDate: Date): Date => {
  const DRAFT_CLOSE_HOUR = 9;  // 9 AM ET
  const DRAFT_CLOSE_MINUTE = 30; // 30 minutes ET

  // Use toZonedTime to get the current date aligned with ET
  const nowET = toZonedTime(currentDate, TIME_ZONE);
  let date = new Date(nowET);
  const day = date.getDay(); // 0=Sun, 1=Mon

  // Calculate days until Monday (1)
  let diff = 1 - day;
  if (diff < 0) {
    diff += 7; // Wrap to next week
  }

  date.setDate(date.getDate() + diff);
  date.setHours(DRAFT_CLOSE_HOUR, DRAFT_CLOSE_MINUTE, 0, 0);

  // EDGE CASE: If it is currently Monday and past 9:30 AM ET, target the NEXT Monday.
  if (day === 1 && nowET.getHours() > DRAFT_CLOSE_HOUR) {
    date.setDate(date.getDate() + 7);
  } else if (day === 1 && nowET.getHours() === DRAFT_CLOSE_HOUR && nowET.getMinutes() >= DRAFT_CLOSE_MINUTE) {
    date.setDate(date.getDate() + 7);
  }

  return date;
};

// Calculate DROP number (1=Tue, 2=Wed, 3=Thu)
const getDropNumber = (currentDate: Date): number | null => {
  const dayOfWeek = currentDate.getDay();

  switch (dayOfWeek) {
    case 2: return 1; // Tuesday
    case 3: return 2; // Wednesday
    case 4: return 3; // Thursday
    default: return null;
  }
};

// Format time remaining as string
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return '00:00:00';

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Format days + time
export const formatWeekTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return '00:00:00';

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const remainingMs = milliseconds % (1000 * 60 * 60 * 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}, ${formatTimeRemaining(remainingMs)}`;
  }

  return formatTimeRemaining(remainingMs);
};

export const useChromeWarTimers = (): ChromeWarTimerState => {
  const [timerState, setTimerState] = useState<ChromeWarTimerState>(() => {
    const now = getCurrentETTime();
    const nextDropTime = getNextDropTime(now);
    const weekEndTime = getWeekEndTime(now);

    return {
      nextDropTime,
      weekEndTime,
      timeUntilNextDrop: nextDropTime ? nextDropTime.getTime() - now.getTime() : null,
      timeUntilWeekEnd: weekEndTime.getTime() - now.getTime(),
      isDropUrgent: false,
      isFinalDropActive: false,
      dropNumber: getDropNumber(now),
      dropStatus: 'upcoming',
      weekStatus: 'active'
    };
  });

  useEffect(() => {
    const updateTimers = () => {
      const now = getCurrentETTime();
      const nextDropTime = getNextDropTime(now);
      const weekEndTime = getWeekEndTime(now);

      const timeUntilNextDrop = nextDropTime ? Math.max(0, nextDropTime.getTime() - now.getTime()) : null;
      const timeUntilWeekEnd = Math.max(0, weekEndTime.getTime() - now.getTime());

      // Check if DROP is urgent (< 1 hour)
      const isDropUrgent = timeUntilNextDrop ? timeUntilNextDrop < (60 * 60 * 1000) : false;

      // Check if final DROP is active (Friday 3-4 PM ET)
      const dayOfWeek = now.getDay();
      const currentHour = now.getHours();
      const isFinalDropActive = dayOfWeek === 5 && currentHour >= 15 && currentHour < 16;

      // Determine DROP status
      let dropStatus: 'upcoming' | 'active' | 'completed' = 'upcoming';
      if (timeUntilNextDrop === 0) {
        dropStatus = 'active';
      } else if (!nextDropTime) {
        dropStatus = 'completed';
      }

      // Determine week status
      let weekStatus: 'active' | 'final-drop' | 'completed' = 'active';
      if (isFinalDropActive) {
        weekStatus = 'final-drop';
      } else if (timeUntilWeekEnd === 0) {
        weekStatus = 'completed';
      }

      setTimerState({
        nextDropTime,
        weekEndTime,
        timeUntilNextDrop,
        timeUntilWeekEnd,
        isDropUrgent,
        isFinalDropActive,
        dropNumber: getDropNumber(now),
        dropStatus,
        weekStatus
      });
    };

    // Update immediately
    updateTimers();

    // Update every second
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, []);

  return timerState;
};

// Game Status Interface
export interface GameStatus {
  phase: 'DRAFT_OPEN' | 'TRADING_WEEK' | 'INTERMISSION' | 'FINAL_HOUR';
  targetTime: Date;
  displayTag: string;
  showEnterButton: boolean;
  countdown: string;
}

// Calculate time difference as HH:MM:SS string
export const calculateTimeDifference = (targetTime: Date): string => {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();

  if (diff <= 0) return '00:00:00';

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Main function to get current game status with optional force phase
export const getCurrentGameStatus = (options?: {
  forcePhase?: 'DRAFT_OPEN' | 'TRADING_WEEK' | 'INTERMISSION' | 'FINAL_HOUR';
  draftCloseDay?: number;
  draftCloseHour?: number;
  draftCloseMinute?: number;
  mockTime?: Date;
}): GameStatus => {
  const now = options?.mockTime || new Date();
  const forcePhase = options?.forcePhase;
  const draftCloseDay = options?.draftCloseDay ?? 1; // Monday
  const draftCloseHour = options?.draftCloseHour ?? 9;
  const draftCloseMinute = options?.draftCloseMinute ?? 30;

  // If forced phase is specified, use that
  if (forcePhase) {
    switch (forcePhase) {
      case 'DRAFT_OPEN':
        const draftCloseTime = getDraftCloseTime(now, draftCloseDay, draftCloseHour, draftCloseMinute);
        return {
          phase: 'DRAFT_OPEN',
          targetTime: draftCloseTime,
          displayTag: 'Draft Closes In',
          showEnterButton: true,
          countdown: calculateTimeDifference(draftCloseTime)
        };

      case 'TRADING_WEEK':
        const nextDropTime = getNextDropTime(now);
        if (nextDropTime) {
          return {
            phase: 'TRADING_WEEK',
            targetTime: nextDropTime,
            displayTag: 'Players Remaining',
            showEnterButton: false,
            countdown: '142 players' // Mock for now
          };
        } else {
          // No more drops, show week end
          const weekEndTime = getWeekEndTime(now);
          return {
            phase: 'FINAL_HOUR',
            targetTime: weekEndTime,
            displayTag: 'Final Hour',
            showEnterButton: false,
            countdown: calculateTimeDifference(weekEndTime)
          };
        }

      case 'INTERMISSION':
        const nextDraftTime = getNextDraftOpenTime(now);
        return {
          phase: 'INTERMISSION',
          targetTime: nextDraftTime,
          displayTag: 'Next Draft Starts In',
          showEnterButton: false,
          countdown: calculateTimeDifference(nextDraftTime)
        };

      default:
        break;
    }
  }

  // Normal logic based on current time
  const nowET = toZonedTime(now, TIME_ZONE);
  const dayOfWeek = nowET.getDay();
  const currentHour = nowET.getHours();
  const currentMinute = nowET.getMinutes();

  // Determine current phase based on day/time
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend - Intermission
    const nextDraftTime = getNextDraftOpenTime(now);
    return {
      phase: 'INTERMISSION',
      targetTime: nextDraftTime,
      displayTag: 'Next Draft Starts In',
      showEnterButton: false,
      countdown: calculateTimeDifference(nextDraftTime)
    };
  } else if (dayOfWeek >= 1 && dayOfWeek <= 4) {
    // Monday-Thursday
    if (dayOfWeek === 1 && currentHour < 9) {
      // Monday before 9 AM - Draft Open
      const draftCloseTime = getDraftCloseTime(now, 1, 9, 30);
      return {
        phase: 'DRAFT_OPEN',
        targetTime: draftCloseTime,
        displayTag: 'Draft Closes In',
        showEnterButton: true,
        countdown: calculateTimeDifference(draftCloseTime)
      };
    } else {
      // Trading Week (Monday after 9 AM, or Tue-Thu)
      const nextDropTime = getNextDropTime(now);
      if (nextDropTime) {
        return {
          phase: 'TRADING_WEEK',
          targetTime: nextDropTime,
          displayTag: 'Players Remaining',
          showEnterButton: false,
          countdown: '142 players' // Mock for now
        };
      } else {
        // No more drops, check if final hour
        const weekEndTime = getWeekEndTime(now);
        const timeUntilEnd = weekEndTime.getTime() - now.getTime();
        if (timeUntilEnd < (60 * 60 * 1000)) { // Less than 1 hour
          return {
            phase: 'FINAL_HOUR',
            targetTime: weekEndTime,
            displayTag: 'Final Hour',
            showEnterButton: false,
            countdown: calculateTimeDifference(weekEndTime)
          };
        } else {
          return {
            phase: 'TRADING_WEEK',
            targetTime: weekEndTime,
            displayTag: 'Players Remaining',
            showEnterButton: false,
            countdown: '142 players' // Mock for now
          };
        }
      }
    }
  } else {
    // Friday
    const weekEndTime = getWeekEndTime(now);
    const timeUntilEnd = weekEndTime.getTime() - now.getTime();

    if (timeUntilEnd < (60 * 60 * 1000)) { // Less than 1 hour
      return {
        phase: 'FINAL_HOUR',
        targetTime: weekEndTime,
        displayTag: 'Final Hour',
        showEnterButton: false,
        countdown: calculateTimeDifference(weekEndTime)
      };
    } else {
      return {
        phase: 'TRADING_WEEK',
        targetTime: weekEndTime,
        displayTag: 'Players Remaining',
        showEnterButton: false,
        countdown: '142 players' // Mock for now
      };
    }
  }
};
