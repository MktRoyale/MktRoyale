"use client";

import { useChromeWarTimers, formatTimeRemaining, formatWeekTimeRemaining } from '@/hooks/useChromeWarTimers';
import { DANGER_RED, WARNING_ORANGE, SUCCESS_GREEN, ELECTRIC_YELLOW } from '@/lib/constants';

export default function TimersComponent() {
  const {
    nextDropTime,
    timeUntilNextDrop,
    timeUntilWeekEnd,
    isDropUrgent,
    isFinalDropActive,
    dropNumber,
    dropStatus,
    weekStatus
  } = useChromeWarTimers();

  const getDropDisplayText = () => {
    if (dropStatus === 'completed') {
      return 'All Culls Complete';
    }

    if (dropStatus === 'active') {
      return `DROP #${dropNumber} ACTIVE`;
    }

    if (timeUntilNextDrop && timeUntilNextDrop > 0) {
      return `DROP #${dropNumber} in ${formatTimeRemaining(timeUntilNextDrop)}`;
    }

    return 'Awaiting Next Phase';
  };

  const getWeekDisplayText = () => {
    if (weekStatus === 'completed') {
      return 'Awaiting Prize Payout';
    }

    if (weekStatus === 'final-drop') {
      return 'FINAL DROP ACTIVE';
    }

    if (timeUntilWeekEnd > 0) {
      return `Chrome War Ends in ${formatWeekTimeRemaining(timeUntilWeekEnd)}`;
    }

    return 'Week Complete';
  };

  const getDropTextStyle = () => {
    if (dropStatus === 'active' || isDropUrgent) {
      return {
        color: DANGER_RED,
        textShadow: '0 0 10px currentColor',
        animation: 'pulse 1s infinite'
      };
    }

    if (dropStatus === 'completed') {
      return {
        color: SUCCESS_GREEN
      };
    }

    return {
      color: WARNING_ORANGE
    };
  };

  const getWeekTextStyle = () => {
    if (weekStatus === 'final-drop') {
      return {
        color: ELECTRIC_YELLOW,
        textShadow: '0 0 15px currentColor',
        animation: 'pulse 0.8s infinite'
      };
    }

    if (weekStatus === 'completed') {
      return {
        color: SUCCESS_GREEN
      };
    }

    return {
      color: '#888888'
    };
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 text-center">
        Chrome War Timers
      </h3>

      <div className="space-y-4">
        {/* DROP Timer */}
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Next Cull</div>
          <div
            className={`text-xl font-mono font-bold transition-all duration-300 ${
              isDropUrgent || dropStatus === 'active' ? 'animate-pulse' : ''
            }`}
            style={getDropTextStyle()}
          >
            {getDropDisplayText()}
          </div>
          {isDropUrgent && dropStatus !== 'active' && (
            <div className="text-xs text-danger-red mt-1 animate-pulse">
              ⚠️ CULL IMMINENT
            </div>
          )}
        </div>

        {/* Week End Timer */}
        <div className="text-center border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400 mb-1">Week Status</div>
          <div
            className={`text-lg font-mono font-bold transition-all duration-300 ${
              weekStatus === 'final-drop' ? 'animate-pulse' : ''
            }`}
            style={getWeekTextStyle()}
          >
            {getWeekDisplayText()}
          </div>
          {weekStatus === 'final-drop' && (
            <div className="text-xs text-electric-yellow mt-1 animate-pulse">
              🔥 DEATHMATCH ACTIVE
            </div>
          )}
        </div>

        {/* Visual Indicators */}
        <div className="flex justify-center space-x-4 mt-4">
          <div className={`w-3 h-3 rounded-full ${
            dropStatus === 'active' || isDropUrgent ? 'bg-danger-red animate-pulse' :
            dropStatus === 'upcoming' ? 'bg-warning-orange' :
            'bg-success-green'
          }`} title="DROP Status" />

          <div className={`w-3 h-3 rounded-full ${
            weekStatus === 'final-drop' ? 'bg-electric-yellow animate-pulse' :
            weekStatus === 'active' ? 'bg-neon-teal' :
            'bg-success-green'
          }`} title="Week Status" />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
