import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookies().set(name, value, options)
          } catch {
            // ignore
          }
        },
        remove(name: string, options: any) {
          try {
            cookies().delete(name, options)
          } catch {
            // ignore
          }
        },
      },
    }
  )
}

