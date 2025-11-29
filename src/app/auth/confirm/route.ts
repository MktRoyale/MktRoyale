import { createClient } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type === 'magiclink') {
    const supabase = createClient(cookies())
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'magiclink',
      options: { redirectTo: origin },
    })

    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // Fallback on error
  return NextResponse.redirect(new URL('/login?message=Link expired', origin))
}
