import { useState, useEffect } from 'react';
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';

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
  return utcToZonedTime(now, TIME_ZONE);
};

// Calculate next DROP time (Tuesday, Wednesday, Thursday at 4:00 PM ET)
export const getNextDropTime = (currentDate: Date): Date | null => {
  const nowET = utcToZonedTime(currentDate, TIME_ZONE);
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
        return zonedTimeToUtc(dropTime, TIME_ZONE);
      }
    }
  }

  return null; // All drops completed for the current week
};

// Calculate week end time (next Friday at 4:00 PM ET)
export const getWeekEndTime = (currentDate: Date): Date => {
  const nowET = utcToZonedTime(currentDate, TIME_ZONE);
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

  return zonedTimeToUtc(date, TIME_ZONE);
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
