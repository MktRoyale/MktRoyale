"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import { ABILITIES, RIVAL_BONUSES, GAME_PHASES } from "@/lib/constants";

interface Ability {
  id: string;
  name: string;
  charges: number;
  maxCharges: number;
  cooldown: number;
  cooldownRemaining: number;
  duration: number;
  isActive: boolean;
  activeUntil: number;
}

interface Rival {
  id: string;
  name: string;
  rank: number;
  portfolioValue: number;
  change: number;
  abilitiesUsed: number;
  isGhost: boolean;
  lockExpires: number;
}

export default function Arena() {
  const [abilities, setAbilities] = useState<Ability[]>([
    {
      id: 'overclock',
      name: 'Overclock',
      charges: 3,
      maxCharges: 3,
      cooldown: 6,
      cooldownRemaining: 0,
      duration: 4,
      isActive: false,
      activeUntil: 0
    },
    {
      id: 'short-circuit',
      name: 'Short Circuit',
      charges: 3,
      maxCharges: 3,
      cooldown: 6,
      cooldownRemaining: 0,
      duration: 4,
      isActive: false,
      activeUntil: 0
    },
    {
      id: 'ghost-shield',
      name: 'Ghost Shield',
      charges: 2,
      maxCharges: 2,
      cooldown: 10,
      cooldownRemaining: 0,
      duration: 0,
      isActive: false,
      activeUntil: 0
    },
    {
      id: 'mirror-hack',
      name: 'Mirror Hack',
      charges: 2,
      maxCharges: 2,
      cooldown: 0,
      cooldownRemaining: 0,
      duration: 4,
      isActive: false,
      activeUntil: 0
    },
    {
      id: 'null-surge',
      name: 'Null Surge',
      charges: 2,
      maxCharges: 2,
      cooldown: 0,
      cooldownRemaining: 0,
      duration: 0,
      isActive: false,
      activeUntil: 0
    }
  ]);

  const [rivals, setRivals] = useState<Rival[]>([
    {
      id: 'rival1',
      name: 'StockMaster99',
      rank: 245,
      portfolioValue: 12350,
      change: 2.1,
      abilitiesUsed: 2,
      isGhost: false,
      lockExpires: Date.now() + 2 * 24 * 60 * 60 * 1000 // 2 days
    },
    {
      id: 'rival2',
      name: 'CryptoKing',
      rank: 312,
      portfolioValue: 11890,
      change: -1.8,
      abilitiesUsed: 1,
      isGhost: false,
      lockExpires: Date.now() + 2 * 24 * 60 * 60 * 1000
    }
  ]);

  const [gamePhase, setGamePhase] = useState<keyof typeof GAME_PHASES>('MONDAY');
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60 * 1000); // 24 hours
  const [playerStats, setPlayerStats] = useState({
    portfolioValue: 12450,
    change: 1.8,
    rank: 247,
    rivalBonus: 0
  });

  const supabase = createClient();

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1000));

      setAbilities(prev => prev.map(ability => ({
        ...ability,
        cooldownRemaining: Math.max(0, ability.cooldownRemaining - 1),
        activeUntil: ability.activeUntil > 0 ? Math.max(0, ability.activeUntil - 1000) : 0,
        isActive: ability.activeUntil > Date.now()
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const useAbility = (abilityId: string, targetRivalId?: string) => {
    setAbilities(prev => prev.map(ability => {
      if (ability.id === abilityId && ability.charges > 0 && ability.cooldownRemaining === 0) {
        const now = Date.now();
        return {
          ...ability,
          charges: ability.charges - 1,
          cooldownRemaining: ability.cooldown * 60 * 60, // Convert hours to seconds
          isActive: ability.duration > 0,
          activeUntil: ability.duration > 0 ? now + (ability.duration * 60 * 60 * 1000) : 0
        };
      }
      return ability;
    }));

    // Apply ability effects (mock)
    if (abilityId === 'overclock') {
      setPlayerStats(prev => ({ ...prev, change: prev.change + 2.5 }));
    } else if (abilityId === 'short-circuit' && targetRivalId) {
      setRivals(prev => prev.map(rival =>
        rival.id === targetRivalId
          ? { ...rival, change: rival.change - 2.0 }
          : rival
      ));
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCooldown = (seconds: number) => {
    if (seconds === 0) return 'Ready';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getPhaseName = () => {
    switch (gamePhase) {
      case 'MONDAY': return 'Monday Battle';
      case 'TUESDAY': return 'Tuesday Battle';
      case 'WEDNESDAY': return 'Wednesday Battle';
      case 'THURSDAY': return 'Thursday Cull';
      case 'FRIDAY': return 'Friday Deathmatch';
      default: return 'Battle Phase';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Phase Timer */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-electric-yellow mb-2">Chrome Battle Arena</h1>
            <p className="text-gray-300">Deploy abilities, hack rivals, claim victory</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-chrome-blue mb-1">{getPhaseName()}</div>
            <div className="text-lg text-gray-400">
              {formatTime(Math.floor(timeRemaining / 1000))} remaining
            </div>
          </div>
        </div>

        {/* Phase Progress Bar */}
        <div className="mt-4 bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-electric-yellow to-chrome-blue h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeRemaining / (24 * 60 * 60 * 1000)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Stats */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Chrome Status</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Portfolio Value</span>
              <span className="text-2xl font-bold text-electric-yellow">
                ${playerStats.portfolioValue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Change</span>
              <span className={`font-bold ${playerStats.change >= 0 ? 'text-success-green' : 'text-danger-red'}`}>
                {playerStats.change >= 0 ? '+' : ''}{playerStats.change}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Rank</span>
              <span className="font-bold text-neon-teal">#{playerStats.rank}</span>
            </div>

            {playerStats.rivalBonus > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Rival Bonus</span>
                <span className="font-bold text-success-green">+{playerStats.rivalBonus}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Chrome Abilities */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-neon-teal mb-4">Chrome Abilities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {abilities.map((ability) => (
                <div
                  key={ability.id}
                  className={`relative border-2 rounded-lg p-4 transition-all ${
                    ability.isActive
                      ? 'border-electric-yellow bg-electric-yellow/10'
                      : ability.charges > 0 && ability.cooldownRemaining === 0
                      ? 'border-neon-teal bg-neon-teal/10 cursor-pointer hover:bg-neon-teal/20'
                      : 'border-gray-600 bg-gray-700/50'
                  }`}
                >
                  {ability.isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-electric-yellow rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-cyber-black rounded-full animate-pulse"></div>
                    </div>
                  )}

                  <div className="font-bold text-white mb-1">{ability.name}</div>

                  <div className="text-sm text-gray-400 mb-3 h-8">
                    {ABILITIES[ability.id.toUpperCase().replace('-', '_')]?.description}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Charges</span>
                    <div className="flex gap-1">
                      {Array.from({ length: ability.maxCharges }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < ability.charges ? 'bg-neon-teal' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {ability.cooldownRemaining > 0 && (
                    <div className="text-xs text-warning-orange mb-2">
                      Cooldown: {formatCooldown(ability.cooldownRemaining)}
                    </div>
                  )}

                  {ability.isActive && (
                    <div className="text-xs text-electric-yellow mb-2">
                      Active: {formatCooldown(Math.floor((ability.activeUntil - Date.now()) / 1000))}
                    </div>
                  )}

                  {/* Ability buttons for applicable abilities */}
                  {(ability.id === 'short-circuit' || ability.id === 'mirror-hack' || ability.id === 'null-surge') && ability.charges > 0 && ability.cooldownRemaining === 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rivals.filter(r => !r.isGhost).map((rival) => (
                        <button
                          key={rival.id}
                          onClick={() => useAbility(ability.id, rival.id)}
                          className="text-xs bg-danger-red hover:bg-danger-red/80 text-white px-2 py-1 rounded transition-colors"
                        >
                          Use on {rival.name.split('')[0]}
                        </button>
                      ))}
                    </div>
                  )}

                  {(ability.id === 'overclock' || ability.id === 'ghost-shield') && ability.charges > 0 && ability.cooldownRemaining === 0 && (
                    <button
                      onClick={() => useAbility(ability.id)}
                      className="w-full mt-2 bg-electric-yellow text-cyber-black py-2 rounded font-medium hover:bg-electric-yellow/90 transition-colors"
                    >
                      Deploy
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rivals */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-danger-red mb-4">Active Rivals</h2>

            <div className="space-y-4">
              {rivals.map((rival) => (
                <div
                  key={rival.id}
                  className={`border rounded-lg p-4 ${
                    rival.isGhost ? 'border-gray-600 bg-gray-700/30' : 'border-danger-red/50 bg-danger-red/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rival.name}</span>
                      {rival.isGhost && (
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">GHOST</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">Rank #{rival.rank}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Portfolio:</span>
                      <div className="font-mono text-white">${rival.portfolioValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Change:</span>
                      <div className={`font-medium ${rival.change >= 0 ? 'text-success-green' : 'text-danger-red'}`}>
                        {rival.change >= 0 ? '+' : ''}{rival.change}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Abilities:</span>
                      <div className="text-neon-teal">{rival.abilitiesUsed} used</div>
                    </div>
                  </div>

                  {!rival.isGhost && (
                    <div className="mt-3 text-xs text-gray-400">
                      Lock expires: {new Date(rival.lockExpires).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {gamePhase === 'THURSDAY' && (
              <div className="mt-6 bg-warning-orange/10 border border-warning-orange/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-warning-orange">⚠️</span>
                  <span className="text-warning-orange font-medium">Thursday Cull Imminent</span>
                </div>
                <p className="text-sm text-gray-300">
                  Only the top 5 traders will survive to Friday's deathmatch. Fight hard!
                </p>
              </div>
            )}

            {gamePhase === 'FRIDAY' && (
              <div className="mt-6 bg-danger-red/10 border border-danger-red/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-danger-red">🔥</span>
                  <span className="text-danger-red font-medium">Friday Deathmatch</span>
                </div>
                <p className="text-sm text-gray-300">
                  1-hour battle royale among the final 5. Winner takes all!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
