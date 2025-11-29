import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash,
    })

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=Link+expired', requestUrl.origin))
}
