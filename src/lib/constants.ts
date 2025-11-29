export const APP_NAME = "Chrome War";
export const APP_TAGLINE = "Battle Royale for Stock Traders";

export const CYBER_BLACK = "#0A0A0F";
export const ELECTRIC_YELLOW = "#FFE600";
export const NEON_TEAL = "#00E5FF";
export const CHROME_BLUE = "#4285F4";
export const DANGER_RED = "#FF4444";
export const SUCCESS_GREEN = "#00FF88";
export const WARNING_ORANGE = "#FF8800";

// Game Constants
export const CORE_SLOTS = 4;
export const WILDCARD_SLOTS = 1;
export const TOTAL_SLOTS = CORE_SLOTS + WILDCARD_SLOTS;

// Abilities
export const ABILITIES = {
  OVERCLOCK: {
    name: "Overclock",
    description: "+25% portfolio boost",
    duration: 4, // Trading Hours
    cooldown: 6, // Trading Hours
    charges: 3,
    effect: "multiply"
  },
  SHORT_CIRCUIT: {
    name: "Short Circuit",
    description: "–20% portfolio penalty to target",
    duration: 4,
    cooldown: 6,
    charges: 3,
    effect: "penalty"
  },
  GHOST_SHIELD: {
    name: "Ghost Shield",
    description: "Block next ability used against you",
    duration: 0, // Instant
    cooldown: 10,
    charges: 2,
    effect: "block"
  },
  MIRROR_HACK: {
    name: "Mirror Hack",
    description: "Copy rival's best performing stock",
    duration: 4,
    cooldown: 0, // Once per rival lock
    charges: 2,
    effect: "copy"
  },
  NULL_SURGE: {
    name: "Null Surge",
    description: "Cancel rival's next 2 abilities",
    duration: 0, // Instant
    cooldown: 0, // Once per rival lock
    charges: 2,
    effect: "cancel"
  }
};

// Game Phases
export const GAME_PHASES = {
  DRAFT: 'draft',
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  COMPLETE: 'complete'
};

// Rival Bonuses
export const RIVAL_BONUSES = {
  CLOSE_WIN: 0.05,    // 0-5% margin
  GOOD_WIN: 0.15,     // 6-15% margin
  DOMINANT_WIN: 0.30, // 16%+ margin
  FINAL_HOUR: 0.50    // Friday final hour
};

// Prestige Tiers
export const PRESTIGE_TIERS = {
  RECRUIT: { name: 'Recruit', minWins: 0, color: '#888888' },
  TRADER: { name: 'Trader', minWins: 3, color: NEON_TEAL },
  VETERAN: { name: 'Veteran', minWins: 8, color: ELECTRIC_YELLOW },
  ELITE: { name: 'Elite', minWins: 15, color: CHROME_BLUE },
  CHAMPION: { name: 'Champion', minWins: 25, color: SUCCESS_GREEN },
  LEGEND: { name: 'Legend', minWins: 50, color: '#FF6B35' }
};

// Market Hours (ET)
export const MARKET_OPEN = { hour: 9, minute: 30 };
export const MARKET_CLOSE = { hour: 16, minute: 0 };

// Draft Window
export const DRAFT_START = new Date(); // Now
export const DRAFT_END = new Date(); // Will be set to next Monday 9:30 AM ET

// Geo-blocked states (7 states with material chance of loss)
export const BLOCKED_STATES = ['NY', 'NJ', 'MD', 'VT', 'SC', 'HI', 'UT'];
