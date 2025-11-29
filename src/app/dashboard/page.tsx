"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ELECTRIC_YELLOW, NEON_TEAL, SUCCESS_GREEN } from "@/lib/constants";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth error:', error);
          router.push('/login');
          return;
        }

        if (!session?.user) {
          router.push('/login');
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-yellow mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: ELECTRIC_YELLOW }}>
          Chrome War Command Center
        </h1>
        <p className="text-gray-300 mt-2">
          Welcome back, Commander {user.email?.split('@')[0] || 'Warrior'}
        </p>
      </div>

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

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-800/50 border border-gray-600 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/draft')}
            className="p-4 bg-electric-yellow/10 border border-electric-yellow/30 rounded-lg hover:bg-electric-yellow/20 transition-colors text-left"
          >
            <div className="font-bold text-electric-yellow mb-1">Draft Arena</div>
            <div className="text-sm text-gray-300">Build your chrome lineup</div>
          </button>

          <button
            onClick={() => router.push('/arena')}
            className="p-4 bg-neon-teal/10 border border-neon-teal/30 rounded-lg hover:bg-neon-teal/20 transition-colors text-left"
          >
            <div className="font-bold text-neon-teal mb-1">Battle Arena</div>
            <div className="text-sm text-gray-300">Deploy abilities, hack rivals</div>
          </button>

          <button
            onClick={() => router.push('/rules')}
            className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors text-left"
          >
            <div className="font-bold text-white mb-1">Rules & Abilities</div>
            <div className="text-sm text-gray-300">Master chrome warfare</div>
          </button>
        </div>
      </div>

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
