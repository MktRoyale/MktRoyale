export default function Rules() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-electric-yellow mb-8">Chrome War Rules & Abilities</h1>

      <div className="space-y-8">
        {/* Core Game Rules */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">Chrome War Fundamentals</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              Chrome War is an advanced stock market battle royale where traders draft unique lineups,
              battle rivals with cyber abilities, and survive market culling to claim victory.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Draft Phase</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• 4 unique core stocks (uniqueness enforced)</li>
                  <li>• 1 wildcard stock (any stock, can duplicate)</li>
                  <li>• Draft closes Monday 9:30 AM ET</li>
                  <li>• Lineup hash based on sorted core stocks only</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Battle Phase</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• 2-day rival locks (Mon-Tue, Wed-Thu)</li>
                  <li>• Thursday cull: Top 5 survive</li>
                  <li>• Friday: 1-hour deathmatch among Top 5</li>
                  <li>• No Monday cull (everyone starts)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chrome Abilities */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-electric-yellow mb-4">Chrome Abilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neon-teal/10 border border-neon-teal/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-neon-teal mb-2">Overclock</h3>
              <p className="text-gray-300 text-sm mb-3">+25% portfolio boost for 4 trading hours</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Charges: 3</div>
                <div>Cooldown: 6 trading hours</div>
                <div>Target: Self</div>
              </div>
            </div>

            <div className="bg-danger-red/10 border border-danger-red/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-danger-red mb-2">Short Circuit</h3>
              <p className="text-gray-300 text-sm mb-3">–20% penalty to rival portfolio for 4 trading hours</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Charges: 3</div>
                <div>Cooldown: 6 trading hours</div>
                <div>Target: Single rival</div>
              </div>
            </div>

            <div className="bg-chrome-blue/10 border border-chrome-blue/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-chrome-blue mb-2">Ghost Shield</h3>
              <p className="text-gray-300 text-sm mb-3">Block the next ability used against you</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Charges: 2</div>
                <div>Cooldown: 10 trading hours</div>
                <div>Target: Self</div>
              </div>
            </div>

            <div className="bg-success-green/10 border border-success-green/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-success-green mb-2">Mirror Hack</h3>
              <p className="text-gray-300 text-sm mb-3">Copy rival's best performing stock for 4 trading hours</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Charges: 2</div>
                <div>Cooldown: Once per rival lock</div>
                <div>Target: Single rival</div>
              </div>
            </div>

            <div className="bg-warning-orange/10 border border-warning-orange/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-warning-orange mb-2">Null Surge</h3>
              <p className="text-gray-300 text-sm mb-3">Cancel rival's next 2 ability uses</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Charges: 2</div>
                <div>Cooldown: Once per rival lock</div>
                <div>Target: Single rival</div>
              </div>
            </div>

            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-300 mb-2">Trading Hours</h3>
              <p className="text-gray-300 text-sm mb-3">All durations and cooldowns measured in trading hours (9:30 AM - 4:00 PM ET)</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>• 1 TH = 1 market hour</div>
                <div>• Non-trading hours don't count</div>
                <div>• Weekends reset counters</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rival System */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-danger-red mb-4">Rival System & Bonuses</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Rival Pairing</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• 2-day rival locks: Mon-Tue, Wed-Thu</li>
                  <li>• Friday: Final rival from Top 5</li>
                  <li>• Ghost rivals: Culled players frozen</li>
                  <li>• Rival bonuses for beating them</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Victory Bonuses</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• 0-5% margin: +5% bonus</li>
                  <li>• 6-15% margin: +15% bonus</li>
                  <li>• 16%+ margin: +30% bonus</li>
                  <li>• Friday final hour: +50% bonus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring & Culling */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-warning-orange mb-4">Scoring & Culling</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-success-green mb-2">Monday</div>
                <div className="text-sm text-gray-300">Everyone starts - no cull</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-warning-orange mb-2">Thursday</div>
                <div className="text-sm text-gray-300">Top 5 survive culling</div>
              </div>
              <div className="text-center p-4 bg-danger-red/10 border border-danger-red/30 rounded-lg">
                <div className="text-2xl font-bold text-danger-red mb-2">Friday</div>
                <div className="text-sm text-gray-300">1-hour deathmatch</div>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Key Mechanics</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Volatility completely uncapped (full market excitement)</li>
                <li>• Rankings update every 15 minutes during trading hours</li>
                <li>• Thursday cull eliminates all but Top 5 at market close</li>
                <li>• Friday: 1-hour battle royale among survivors</li>
                <li>• Winner takes all prize pool + final hour bonus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prizes & Legal Compliance */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-electric-yellow mb-4">Prizes & Legal Compliance</h2>
          <div className="space-y-6">
            <div className="bg-success-green/10 border border-success-green/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-success-green mb-2">Prize Structure</h3>
              <p className="text-gray-300 text-sm mb-3">Tiered guaranteed prizes announced Sunday before each week:</p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• 1st Place: $3,000+</li>
                <li>• 2nd Place: $1,800</li>
                <li>• 3rd Place: $1,200</li>
                <li>• 4th-5th: $800 each</li>
                <li>• Total Weekly Prize Pool: $15,000+</li>
                <li>• Prizes paid via PayPal within 48 hours</li>
              </ul>
            </div>

            <div className="bg-warning-orange/10 border border-warning-orange/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-warning-orange mb-2">Legal & Geographic Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Blocked States (7 states)</h4>
                  <ul className="text-gray-400 space-y-1 text-xs">
                    <li>• New York (NY)</li>
                    <li>• New Jersey (NJ)</li>
                    <li>• Maryland (MD)</li>
                    <li>• Vermont (VT)</li>
                    <li>• South Carolina (SC)</li>
                    <li>• Hawaii (HI)</li>
                    <li>• Utah (UT)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Legal Citations</h4>
                  <ul className="text-gray-400 space-y-1 text-xs">
                    <li>• Humphrey v. Viacom (2023)</li>
                    <li>• Dew-Becker v. Wu (2023)</li>
                    <li>• Forcerank LLC v. WV (2024)</li>
                    <li>• 3-click friction required</li>
                    <li>• Next-week delay mandatory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prestige System */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-chrome-blue mb-4">Prestige System</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries({
                'Recruit': { color: '#888888', minWins: 0 },
                'Trader': { color: '#00E5FF', minWins: 3 },
                'Veteran': { color: '#FFE600', minWins: 8 },
                'Elite': { color: '#4285F4', minWins: 15 },
                'Champion': { color: '#00FF88', minWins: 25 },
                'Legend': { color: '#FF6B35', minWins: 50 }
              }).map(([tier, data]) => (
                <div key={tier} className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-sm font-bold" style={{ color: data.color }}>{tier}</div>
                  <div className="text-xs text-gray-400">{data.minWins}+ wins</div>
                </div>
              ))}
            </div>
            <p className="text-gray-300 text-sm">
              Prestige tiers unlock based on lifetime Chrome War victories. Higher tiers grant access to exclusive features and tournaments.
            </p>
          </div>
        </div>

        {/* Chrome War FAQ */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Chrome War FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">How does the 4-core + wildcard system work?</h3>
              <p className="text-gray-300 text-sm">Your core 4 stocks must be unique (enforced by hash). The wildcard can be any stock, even duplicates. Only core stocks determine lineup uniqueness.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">What are Trading Hours (TH)?</h3>
              <p className="text-gray-300 text-sm">All ability durations/cooldowns are measured in trading hours (9:30 AM - 4:00 PM ET). Non-trading hours don't count toward timers.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">How do rival bonuses work?</h3>
              <p className="text-gray-300 text-sm">Beat your locked rivals by margins: 0-5% (+5%), 6-15% (+15%), 16%+ (+30%). Friday final hour grants +50% bonus.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">What's the culling process?</h3>
              <p className="text-gray-300 text-sm">Thursday: Top 5 survive. Friday: 1-hour deathmatch among survivors. Losers become ghost rivals until their lock expires.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Free entry requirements?</h3>
              <p className="text-gray-300 text-sm">3-click friction + next-week delay required by law. Entry is free but requires account creation and draft submission.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
