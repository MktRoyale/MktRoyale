// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://missing-url.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'missing-key'

export const supabase = createBrowserClient(url, key)