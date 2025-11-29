"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CORE_SLOTS, WILDCARD_SLOTS, TOTAL_SLOTS, ABILITIES } from "@/lib/constants";
import Link from "next/link";

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout;
  const debounced = ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T & { cancel: () => void };

  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}

// Mock stock data with market data
const MOCK_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 195.50, change: 2.3, volume: "45.2M", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 415.75, change: -0.8, volume: "23.1M", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.30, change: 1.7, volume: "18.9M", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.30, change: 3.2, volume: "31.5M", sector: "Consumer Discretionary" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.90, change: -1.2, volume: "67.8M", sector: "Consumer Discretionary" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 145.20, change: 5.7, volume: "89.3M", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms Inc.", price: 521.80, change: 0.9, volume: "15.6M", sector: "Technology" },
  { symbol: "NFLX", name: "Netflix Inc.", price: 689.50, change: -2.1, volume: "8.7M", sector: "Communication Services" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 198.40, change: 1.5, volume: "12.3M", sector: "Financials" },
  { symbol: "V", name: "Visa Inc.", price: 289.60, change: 0.3, volume: "9.2M", sector: "Financials" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 167.80, change: -0.5, volume: "7.8M", sector: "Health Care" },
  { symbol: "WMT", name: "Walmart Inc.", price: 89.20, change: 1.1, volume: "14.5M", sector: "Consumer Staples" },
  { symbol: "PG", name: "Procter & Gamble Co.", price: 173.40, change: 0.8, volume: "6.9M", sector: "Consumer Staples" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", price: 568.90, change: 2.8, volume: "3.2M", sector: "Health Care" },
  { symbol: "HD", name: "Home Depot Inc.", price: 412.30, change: -1.9, volume: "4.1M", sector: "Consumer Discretionary" },
  { symbol: "BAC", name: "Bank of America Corp.", price: 45.60, change: 1.2, volume: "28.7M", sector: "Financials" },
  { symbol: "MA", name: "Mastercard Inc.", price: 512.70, change: 1.8, volume: "3.8M", sector: "Financials" },
  { symbol: "PFE", name: "Pfizer Inc.", price: 28.90, change: -0.7, volume: "22.1M", sector: "Health Care" },
  { symbol: "KO", name: "Coca-Cola Co.", price: 62.30, change: 0.5, volume: "11.6M", sector: "Consumer Staples" },
  { symbol: "DIS", name: "Walt Disney Co.", price: 98.70, change: 2.4, volume: "16.8M", sector: "Communication Services" },
];

// Recent movers (top gainers/losers)
const RECENT_MOVERS = MOCK_STOCKS
  .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
  .slice(0, 10);

export default function Draft() {
  const [selectedStocks, setSelectedStocks] = useState<(typeof MOCK_STOCKS[0] | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'favorites'>('search');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Debounced lineup saving
  const saveLineupToDatabase = useCallback(
    debounce(async (lineup: (typeof MOCK_STOCKS[0] | null)[]) => {
      if (!user) return;

      const lineupSymbols = lineup.map(stock => stock?.symbol || null).filter(Boolean);

      const { error } = await supabase
        .from('users')
        .update({ draft_lineup: lineupSymbols })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to save draft lineup:', error);
      }
    }, 500),
    [user]
  );

  // Load lineup on mount
  useEffect(() => {
    const loadDraftLineup = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('draft_lineup')
        .eq('id', user.id)
        .single();

      if (data?.draft_lineup && Array.isArray(data.draft_lineup)) {
        // Convert symbols back to stock objects
        const loadedStocks = data.draft_lineup.map((symbol: string) =>
          MOCK_STOCKS.find(stock => stock.symbol === symbol) || null
        );
        // Pad with nulls to maintain 5-slot structure
        while (loadedStocks.length < TOTAL_SLOTS) {
          loadedStocks.push(null);
        }
        setSelectedStocks(loadedStocks);
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to load draft lineup:', error);
      }
    };

    loadDraftLineup();
  }, [user]);

  // Auto-save lineup changes
  useEffect(() => {
    if (user && selectedStocks.length > 0) {
      saveLineupToDatabase(selectedStocks);
    }

    return () => {
      saveLineupToDatabase.cancel();
    };
  }, [selectedStocks, user, saveLineupToDatabase]);

  // Generate lineup hash from first 4 stocks only
  const generateLineupHash = (stocks: (typeof MOCK_STOCKS[0] | null)[]) => {
    const coreStocks = stocks.slice(0, CORE_SLOTS).filter(Boolean);
    if (coreStocks.length !== CORE_SLOTS) return null;

    const symbols = coreStocks.map(s => s!.symbol).sort();
    return symbols.join('-');
  };

  // Check if core lineup is unique
  const checkUniqueness = async (lineupHash: string) => {
    // Mock uniqueness check - in real app, this would check database
    return Math.random() > 0.1; // 90% chance of being unique
  };

  const toggleStock = async (stock: typeof MOCK_STOCKS[0]) => {
    const currentIndex = selectedStocks.findIndex(s => s?.symbol === stock.symbol);

    if (currentIndex !== -1) {
      // Remove from lineup
      const newStocks = [...selectedStocks];
      newStocks[currentIndex] = null;
      setSelectedStocks(newStocks);
      return;
    }

    // Find first available slot
    const emptySlotIndex = selectedStocks.findIndex(s => s === null);
    if (emptySlotIndex === -1) return; // No empty slots

    // Check core uniqueness for first 4 slots
    if (emptySlotIndex < CORE_SLOTS) {
      const tempStocks = [...selectedStocks];
      tempStocks[emptySlotIndex] = stock;
      const lineupHash = generateLineupHash(tempStocks);

      if (lineupHash) {
        const isUnique = await checkUniqueness(lineupHash);
        if (!isUnique) {
          setError("This core lineup has already been taken! Try different stocks.");
          setTimeout(() => setError(""), 3000);
          return;
        }
      }
    }

    const newStocks = [...selectedStocks];
    newStocks[emptySlotIndex] = stock;
    setSelectedStocks(newStocks);
  };

  const handleRemoveStock = (symbolToRemove: string) => {
    setSelectedStocks(prevStocks =>
      prevStocks.map(stock => stock?.symbol === symbolToRemove ? null : stock)
    );
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const submitLineup = async () => {
    if (!user) return;

    const lineupHash = generateLineupHash(selectedStocks);
    if (!lineupHash) {
      setError("Please select 4 core stocks first.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Prepare final lineup data
      const finalLineup = selectedStocks.map(stock => stock?.symbol || null).filter(Boolean);

      // Save to database - atomic operation
      const { error } = await supabase
        .from('users')
        .update({
          final_lineup: finalLineup,
          lineup_locked: true,
          lineup_hash: lineupHash
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Success - redirect to dashboard (which will show battle arena tab)
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Failed to submit lineup:', err);
      setError("Failed to submit lineup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStocks = MOCK_STOCKS.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = selectedStocks.filter(Boolean).length;
  const coreCount = selectedStocks.slice(0, CORE_SLOTS).filter(Boolean).length;
  const canSubmit = coreCount === CORE_SLOTS;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-electric-yellow mb-4">Chrome Draft Arena</h1>
        <p className="text-gray-300 mb-4">
          Build your chrome lineup: 4 unique core stocks + 1 wildcard. Core uniqueness is enforced.
        </p>

        {/* Draft Timer */}
        <div className="bg-chrome-blue/10 border border-chrome-blue/30 rounded-lg p-4 inline-block">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
            <span className="text-chrome-blue font-medium">Draft Open</span>
            <span className="text-gray-400 text-sm">• Closes Monday 9:30 AM ET</span>
          </div>
        </div>
      </div>

      {/* Selected Lineup */}
      <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Chrome Lineup</h2>

        <div className="grid grid-cols-5 gap-4 mb-4">
          {selectedStocks.map((stock, index) => (
            <div
              key={index}
              className={`relative border-2 rounded-lg p-4 min-h-[120px] flex flex-col items-center justify-center transition-all ${
                index < CORE_SLOTS
                  ? stock
                    ? 'border-electric-yellow bg-electric-yellow/10'
                    : 'border-gray-600 bg-gray-700/30'
                  : stock
                    ? 'border-neon-teal bg-neon-teal/10'
                    : 'border-gray-600 bg-gray-700/30'
              }`}
            >
              {stock ? (
                <>
                  <button
                    onClick={() => toggleStock(stock)}
                    className="absolute top-2 right-2 w-6 h-6 bg-danger-red rounded-full flex items-center justify-center text-xs font-bold hover:bg-danger-red/80"
                  >
                    ×
                  </button>
                  <div className="font-bold text-lg">{stock.symbol}</div>
                  <div className="text-sm text-gray-300 text-center">{stock.name}</div>
                  <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-success-green' : 'text-danger-red'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-sm font-medium mb-1">
                    {index < CORE_SLOTS ? `Core ${index + 1}` : 'Wildcard'}
                  </div>
                  <div className="text-xs">
                    {index < CORE_SLOTS ? 'Required' : 'Optional'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {coreCount}/{CORE_SLOTS} core stocks • {selectedCount}/{TOTAL_SLOTS} total
            {selectedStocks[CORE_SLOTS] && <span className="text-neon-teal ml-2">• Wildcard active</span>}
          </div>

          <button
            onClick={submitLineup}
            disabled={!canSubmit || isSubmitting}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              canSubmit && !isSubmitting
                ? 'bg-electric-yellow text-cyber-black hover:bg-electric-yellow/90'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Deploying Chrome...' : 'Execute'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-danger-red/10 border border-danger-red/30 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-danger-red">⚠️</span>
              <span className="text-danger-red">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stock Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search and Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'bg-electric-yellow text-cyber-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Search Stocks
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'recent'
                    ? 'bg-electric-yellow text-cyber-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Recent Movers
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'favorites'
                    ? 'bg-electric-yellow text-cyber-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Favorites ({favorites.length})
              </button>
            </div>

            {activeTab === 'search' && (
              <input
                type="text"
                placeholder="Search stocks by symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:border-transparent mb-4"
              />
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(activeTab === 'search' ? filteredStocks :
                activeTab === 'recent' ? RECENT_MOVERS :
                MOCK_STOCKS.filter(stock => favorites.includes(stock.symbol))
              ).map((stock) => {
                const isSelected = selectedStocks.some(s => s?.symbol === stock.symbol);
                const isFavorited = favorites.includes(stock.symbol);

                return (
                  <div
                    key={stock.symbol}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-electric-yellow/20 border-electric-yellow'
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => toggleStock(stock)}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(stock.symbol);
                        }}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                          isFavorited
                            ? 'bg-electric-yellow text-cyber-black'
                            : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                        }`}
                      >
                        {isFavorited ? '★' : '☆'}
                      </button>

                      <div>
                        <div className="font-bold text-white">{stock.symbol}</div>
                        <div className="text-sm text-gray-400">{stock.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-white">${stock.price}</div>
                      <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-success-green' : 'text-danger-red'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Abilities Preview */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-neon-teal mb-4">Chrome Abilities</h3>
            <div className="space-y-3">
              {Object.values(ABILITIES).slice(0, 3).map((ability) => (
                <div key={ability.name} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="font-medium text-white">{ability.name}</div>
                  <div className="text-sm text-gray-400">{ability.description}</div>
                  <div className="text-xs text-neon-teal mt-1">
                    {ability.charges} charges • {ability.duration}H duration
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/rules"
                className="text-chrome-blue hover:text-chrome-blue/80 text-sm underline"
              >
                View all abilities →
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-warning-orange mb-4">Draft Rules</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• 4 core stocks must be unique</li>
              <li>• 1 wildcard can be any stock</li>
              <li>• Core lineup determines uniqueness</li>
              <li>• Draft closes Monday 9:30 AM ET</li>
              <li>• Abilities unlock after draft</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
