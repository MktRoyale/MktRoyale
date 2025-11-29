import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-6xl font-bold text-electric-yellow mb-6">
          Chrome War
        </h1>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Enter the ultimate stock market battle royale. Draft your chrome lineup,
          hack your rivals with cyber abilities, and claim victory in this high-stakes
          financial showdown.
        </p>
      </div>

      <div className="bg-neon-teal/10 border border-neon-teal/30 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-neon-teal mb-4">
          Chrome War Arena
        </h2>
        <p className="text-gray-300 mb-6">
          Draft your 4-core + 1-wildcard lineup, battle rivals with cyber abilities,
          and survive the culling to claim victory.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p>⚡ Abilities: Overclock, Short Circuit, Ghost Shield</p>
            <p>🎯 Rivals: 2-day locks, Friday deathmatch</p>
          </div>
          <div>
            <p>💰 Prize Pool: $15,000+</p>
            <p>👥 2,500+ Chrome Warriors</p>
            <p>🔥 Volatility: Uncapped</p>
          </div>
        </div>
      </div>

      <Link
        href="/draft"
        className="inline-block bg-electric-yellow text-cyber-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-electric-yellow/90 transition-colors"
      >
        Enter Chrome War Arena
      </Link>
    </div>
  );
}
