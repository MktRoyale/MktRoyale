"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ELECTRIC_YELLOW, NEON_TEAL, SUCCESS_GREEN } from "@/lib/constants";

type DashboardTab = 'overview' | 'draft' | 'arena';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('draft');
  const router = useRouter();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        // 1. Fetch user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Auth error:', sessionError);
          router.push('/login');
          return;
        }

        if (!session?.user) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        // 2. Fetch user profile data (needed for Draft Arena)
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
            // Continue anyway - profile might not exist yet
          } else {
            setProfile(profileData || {});
          }
        } catch (profileErr) {
          console.error('Failed to fetch profile:', profileErr);
          // Continue with empty profile - user can still access draft
          setProfile({});
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadAppData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // GLOBAL LOADING STATE - Prevent ANY rendering until all required data is loaded
  if (loading || !user || profile === null) {
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
          Welcome back, Commander {user.email?.split('@')[0] || 'Warrior'}
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
              onClick={() => router.push('/draft')}
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
              onClick={() => router.push('/arena')}
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
              onClick={() => router.push('/profile')}
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
              onClick={() => router.push('/draft')}
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
              onClick={() => router.push('/arena')}
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
