import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookies().getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookies().set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/login?message=Link expired', requestUrl.origin))
}
