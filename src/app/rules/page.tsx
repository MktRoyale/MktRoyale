export default function Rules() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-electric-yellow mb-8">MktRoyale Rules</h1>

      <div className="space-y-8">
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">How to Play</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              MktRoyale is a weekly stock market competition where traders compete to build the best performing portfolio.
              Each week features a new challenge with different market conditions and opportunities.
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Select 5 stocks from the S&P 500 to build your portfolio</li>
              <li>• Each stock receives an equal weight (20%) in your portfolio</li>
              <li>• Portfolios are locked once the draft period ends</li>
              <li>• Rankings update in real-time during market hours</li>
              <li>• The week ends on Friday at market close</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">Draft Phase</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              The draft phase is when you select your stocks for the upcoming week. This period typically lasts 24-48 hours
              before the market opens on Monday.
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Choose exactly 5 stocks from the available S&P 500 list</li>
              <li>• You can change your selection until the draft closes</li>
              <li>• Once locked, your lineup cannot be modified</li>
              <li>• Draft deadlines are clearly displayed on the royale page</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">Trading Week</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              Once the draft closes, the trading week begins. Your portfolio performance is tracked in real-time
              using actual market data.
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Rankings update every 15 minutes during market hours</li>
              <li>• Performance is calculated based on total portfolio value</li>
              <li>• You can view live standings throughout the week</li>
              <li>• Market conditions may change the difficulty of the challenge</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">Prizes & Rankings</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              Compete for cash prizes based on your final ranking at the end of each week.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Top 10 Prizes</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>1st Place: $2,500</li>
                  <li>2nd Place: $1,500</li>
                  <li>3rd Place: $1,000</li>
                  <li>4th-10th: $500 each</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Top 10% Bonus</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>11th-124th Place: $100 each</li>
                  <li>Total Weekly Prize Pool: $10,000</li>
                  <li>Prizes paid via PayPal within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">Fair Play & Eligibility</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              MktRoyale is committed to fair competition for all participants.
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• One account per person</li>
              <li>• No manipulation of market prices or insider trading</li>
              <li>• All participants must be 18+ years old</li>
              <li>• Accounts found cheating will be permanently banned</li>
              <li>• MktRoyale reserves the right to modify rules at any time</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-neon-teal mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Can I change my stocks after the draft locks?</h3>
              <p className="text-gray-300">No, once the draft period ends, your lineup is permanently locked for that week.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">How is portfolio value calculated?</h3>
              <p className="text-gray-300">Each stock gets equal weighting (20%). The total value is the sum of each stock's current price multiplied by its weight.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">What happens if a stock I picked gets delisted?</h3>
              <p className="text-gray-300">In rare cases, MktRoyale may adjust portfolios or void the competition. You'll be notified immediately.</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">When do prizes get paid out?</h3>
              <p className="text-gray-300">Winners are paid within 48 hours after the week ends, pending verification of fair play.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
