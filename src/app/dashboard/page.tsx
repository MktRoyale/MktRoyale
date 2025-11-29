"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ELECTRIC_YELLOW, NEON_TEAL, SUCCESS_GREEN } from "@/lib/constants";

type DashboardTab = 'overview' | 'draft' | 'arena';

// Mock stock data - same as used in draft page
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stocks, setStocks] = useState<typeof MOCK_STOCKS>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('draft');
  const router = useRouter();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        // 1. Fetch user session with aggressive null checking
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        // AGGRESSIVE ERROR GUARDING: Check for any session errors
        if (sessionError) {
          console.error('Auth error:', sessionError);
          try {
            router.push('/login');
          } catch (routerError) {
            console.error('Router error during redirect:', routerError);
            // Fallback: window.location if router fails
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          return;
        }

        // AGGRESSIVE ERROR GUARDING: Validate session and user object
        if (!session || !session.user || !session.user.id) {
          console.error('Invalid session or user data');
          try {
            router.push('/login');
          } catch (routerError) {
            console.error('Router error during redirect:', routerError);
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          return;
        }

        // AGGRESSIVE ERROR GUARDING: Ensure user object is valid before setting
        if (session.user && typeof session.user === 'object') {
          setUser(session.user);
        } else {
          console.error('Invalid user object structure');
          try {
            router.push('/login');
          } catch (routerError) {
            console.error('Router error during redirect:', routerError);
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          return;
        }

        // 2. Fetch user profile data (needed for Draft Arena) with aggressive error guarding
        try {
          // AGGRESSIVE ERROR GUARDING: Validate user ID exists before query
          if (!session.user.id || typeof session.user.id !== 'string') {
            console.error('Invalid user ID for profile fetch');
            setProfile({});
          } else {
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            // AGGRESSIVE ERROR GUARDING: Handle profile errors gracefully
            if (profileError) {
              // PGRST116 is "not found" - this is acceptable for new users
              if (profileError.code !== 'PGRST116') {
                console.error('Profile fetch error:', profileError);
              }
              // Continue anyway - profile might not exist yet
              setProfile({});
            } else {
              // AGGRESSIVE ERROR GUARDING: Ensure profileData is valid
              setProfile(profileData && typeof profileData === 'object' ? profileData : {});
            }
          }
        } catch (profileErr) {
          console.error('Failed to fetch profile:', profileErr);
          // Continue with empty profile - user can still access draft
          setProfile({});
        }

        // 3. Load stocks data (needed for Draft Arena) with aggressive error guarding
        try {
          // AGGRESSIVE ERROR GUARDING: Load stocks with try-catch to prevent crashes
          // In production, this would fetch from an API, but for now we use mock data
          // Simulate async loading to ensure proper initialization
          await new Promise(resolve => setTimeout(resolve, 0)); // Allow React to process
          
          // AGGRESSIVE ERROR GUARDING: Validate MOCK_STOCKS before setting
          if (Array.isArray(MOCK_STOCKS) && MOCK_STOCKS.length > 0) {
            setStocks(MOCK_STOCKS);
          } else {
            console.error('Invalid stocks data: MOCK_STOCKS is empty or not an array');
            setStocks([]);
          }
        } catch (stocksErr) {
          console.error('Failed to load stocks:', stocksErr);
          // Set empty array to prevent crashes, but loading guard will catch this
          setStocks([]);
        }

      } catch (error) {
        // AGGRESSIVE ERROR GUARDING: Catch-all for any unexpected errors
        console.error('Auth check failed:', error);
        try {
          router.push('/login');
        } catch (routerError) {
          console.error('Router error during error redirect:', routerError);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadAppData();

    // Listen for auth changes with aggressive error guarding
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          try {
            if (event === 'SIGNED_OUT' || !session) {
              try {
                router.push('/login');
              } catch (routerError) {
                console.error('Router error in auth state change:', routerError);
                if (typeof window !== 'undefined') {
                  window.location.href = '/login';
                }
              }
            } else if (session?.user && typeof session.user === 'object') {
              setUser(session.user);
            }
          } catch (stateChangeError) {
            console.error('Error in auth state change handler:', stateChangeError);
          }
        }
      );

      // AGGRESSIVE ERROR GUARDING: Ensure subscription exists before returning cleanup
      if (subscription) {
        return () => {
          try {
            subscription.unsubscribe();
          } catch (unsubError) {
            console.error('Error unsubscribing from auth:', unsubError);
          }
        };
      }
    } catch (subscriptionError) {
      console.error('Error setting up auth subscription:', subscriptionError);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      // AGGRESSIVE ERROR GUARDING: Handle logout errors gracefully
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        // Continue with redirect even if signOut fails
      }
      
      try {
        router.push('/');
      } catch (routerError) {
        console.error('Router error during logout:', routerError);
        // Fallback: window.location if router fails
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    } catch (logoutError) {
      console.error('Unexpected error during logout:', logoutError);
      // Still attempt redirect
      try {
        router.push('/');
      } catch (routerError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
  };

  // GLOBAL LOADING STATE - Prevent ANY rendering until all required data is loaded
  // AGGRESSIVE ERROR GUARDING: Comprehensive null/undefined checks for session, profile, and stocks
  if (
    loading || 
    !user || 
    profile === null || 
    typeof user !== 'object' || 
    !user.id ||
    !stocks ||
    !Array.isArray(stocks) ||
    stocks.length === 0
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-yellow mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Authenticating and Loading Arena...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'draft' as const, label: 'Draft Arena', icon: '⚔️' },
    { id: 'arena' as const, label: 'Battle Arena', icon: '🎯' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: ELECTRIC_YELLOW }}>
          Chrome War Command Center
        </h1>
        <p className="text-gray-300 mt-2">
          Welcome back, Commander {user?.email && typeof user.email === 'string' ? user.email.split('@')[0] : 'Warrior'}
        </p>
        <div className="mt-4">
          <p
            className="text-xl font-medium"
            style={{
              color: 'var(--off-white-text)',
              fontFamily: 'Roboto Mono, monospace'
            }}
          >
            Players Remaining:{' '}
            <span
              style={{
                color: 'var(--neon-teal)'
              }}
            >
              0
            </span>
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-electric-yellow text-cyber-black shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Draft Status */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: ELECTRIC_YELLOW }}>
            Draft Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lineup Ready:</span>
              <span className="text-success-green font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Core Stocks:</span>
              <span className="text-white font-medium">4/4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Wildcard:</span>
              <span className="text-neon-teal font-medium">Selected</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                try {
                  router.push('/draft');
                } catch (error) {
                  console.error('Error navigating to draft:', error);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/draft';
                  }
                }
              }}
              className="w-full px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: ELECTRIC_YELLOW,
                color: '#0A0A0F',
              }}
            >
              Enter Draft Arena
            </button>
          </div>
        </div>

        {/* Battle Status */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: NEON_TEAL }}>
            Battle Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Phase:</span>
              <span className="text-warning-orange font-medium">Draft Phase</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Rivals Locked:</span>
              <span className="text-white font-medium">0/2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Abilities Ready:</span>
              <span className="text-success-green font-medium">5/5</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                try {
                  router.push('/arena');
                } catch (error) {
                  console.error('Error navigating to arena:', error);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/arena';
                  }
                }
              }}
              className="w-full px-4 py-2 rounded-lg font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Enter Battle Arena
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Commander Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lifetime Wins:</span>
              <span className="text-electric-yellow font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Rank:</span>
              <span className="text-white font-medium">Unranked</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Prestige Tier:</span>
              <span className="text-neon-teal font-medium">Recruit</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                try {
                  router.push('/profile');
                } catch (error) {
                  console.error('Error navigating to profile:', error);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/profile';
                  }
                }
              }}
              className="w-full px-4 py-2 rounded-lg font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              View Full Profile
            </button>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'draft' && (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-electric-yellow mb-4">Draft Arena</h3>
            <p className="text-gray-300 mb-6">Build your chrome lineup for the upcoming battle</p>
            <button
              onClick={() => {
                try {
                  router.push('/draft');
                } catch (error) {
                  console.error('Error navigating to draft:', error);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/draft';
                  }
                }
              }}
              className="px-6 py-3 bg-electric-yellow text-cyber-black rounded-lg font-bold hover:bg-electric-yellow/90 transition-colors"
            >
              Enter Draft Arena
            </button>
          </div>
        </div>
      )}

      {activeTab === 'arena' && (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-neon-teal mb-4">Battle Arena</h3>
            <p className="text-gray-300 mb-6">Deploy abilities, hack rivals, and claim victory</p>
            <button
              onClick={() => {
                try {
                  router.push('/arena');
                } catch (error) {
                  console.error('Error navigating to arena:', error);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/arena';
                  }
                }
              }}
              className="px-6 py-3 bg-neon-teal text-cyber-black rounded-lg font-bold hover:bg-neon-teal/90 transition-colors"
            >
              Enter Battle Arena
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-danger-red hover:bg-danger-red/80 text-white rounded-lg font-medium transition-colors"
        >
          Logout & Return to Landing
        </button>
      </div>
    </div>
  );
}
