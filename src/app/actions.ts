'use server'

import { createServerSupabaseClient } from '@/lib/supabaseClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error('Error signing out')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
