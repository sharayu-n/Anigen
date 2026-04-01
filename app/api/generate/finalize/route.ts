import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processStoryToScenes } from '@/lib/ai/story-engine'
import { generateVideo } from '@/lib/ai/veo'
import { generateMangaPanels } from '@/lib/ai/nanobanana'
import { generateMusic } from '@/lib/ai/lyria'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { storyId } = await request.json()
    
    // 1. Fetch story
    const { data: story } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single()
    
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 })

    // 2. Mark story as generating
    await supabase.from('stories').update({ status: 'generating' }).eq('id', storyId)

    // 3. Process into scenes
    // (In a real app, this should be a background queue job / worker)
    const scenes = await processStoryToScenes(story.content, story.metadata)

    // 4. Parallel Generation of Assets for each scene
    const sceneUpdatePromises = scenes.map(async (scene) => {
      const [videoUrl, mangaPanels, musicUrl] = await Promise.all([
        generateVideo(scene.prompts.video),
        generateMangaPanels(scene.prompts.manga, []),
        generateMusic(scene.mood)
      ]);

      // Save scene with media
      return supabase.from('scenes').insert({
        story_id: storyId,
        content: scene.content,
        mood: scene.mood,
        order: scene.order,
        prompts: scene.prompts,
        video_url: videoUrl,
        manga_url: mangaPanels[0], // First panel for simplicity
        audio_url: musicUrl
      });
    });

    await Promise.all(sceneUpdatePromises);

    // 5. Mark as completed
    await supabase.from('stories').update({ status: 'completed' }).eq('id', storyId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Finalization Pipeline Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
