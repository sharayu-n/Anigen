import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Check your .env.local file.')
  }

  return createBrowserClient(
    supabaseUrl?.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
  )
}
