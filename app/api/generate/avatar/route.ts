import { NextResponse } from 'next/server'
import { generateAvatar } from '@/lib/ai/nanobanana'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, referenceImage, traits } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Call Nanobanana service
    const avatarUrl = await generateAvatar(prompt, referenceImage, traits)

    return NextResponse.json({ avatarUrl })
  } catch (error: any) {
    console.error('Avatar Generation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
