// src/lib/supabaseClient.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://missing-url.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'missing-key'

// Browser client for client components
export const supabase = createBrowserClient(url, key)

// Server client factory for route handlers and server actions
export function createClient(cookieStore?: any) {
  if (typeof window === 'undefined') {
    // Server-side
    return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore?.getAll?.() || []
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore?.set?.(name, value, options)
          })
        },
      },
    })
  } else {
    // Client-side fallback
    return supabase
  }
}