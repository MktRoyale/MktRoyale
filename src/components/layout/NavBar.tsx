// src/components/layout/NavBar.tsx
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"   // ← changed
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { ELECTRIC_YELLOW, NEON_TEAL } from "@/lib/constants"

export default function NavBar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/royale", label: "Royale" },
    { href: "/profile", label: "Profile" },
    { href: "/rules", label: "Rules" },
  ]

  return (
    <header className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold" style={{ color: ELECTRIC_YELLOW }}>
            MktRoyale
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: NEON_TEAL,
                    textShadow: "0 0 8px currentColor",
                  }}
                >
                  {user.email?.split("@")[0] || "Player"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm rounded-md transition-colors"
                  style={{
                    backgroundColor: ELECTRIC_YELLOW,
                    color: "#0A0A0F",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: ELECTRIC_YELLOW,
                  color: "#0A0A0F",
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}