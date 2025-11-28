import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-6xl font-bold text-electric-yellow mb-6">
          MktRoyale
        </h1>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Battle it out in the ultimate stock market royale. Pick your portfolio,
          compete against traders worldwide, and claim victory in this high-stakes
          financial showdown.
        </p>
      </div>

      <div className="bg-neon-teal/10 border border-neon-teal/30 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-neon-teal mb-4">
          This Week's Challenge
        </h2>
        <p className="text-gray-300 mb-6">
          Market volatility is at an all-time high. Can you navigate the chaos
          and outperform your competitors?
        </p>
        <div className="text-sm text-gray-400">
          <p>📅 Week 47 • Dec 2-8, 2025</p>
          <p>💰 Prize Pool: $10,000</p>
          <p>👥 1,247 Traders Competing</p>
        </div>
      </div>

      <Link
        href="/royale"
        className="inline-block bg-electric-yellow text-cyber-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-electric-yellow/90 transition-colors"
      >
        Enter This Week's Royale
      </Link>
    </div>
  );
}
