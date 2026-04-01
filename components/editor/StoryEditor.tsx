'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Save, Loader2, Wand2, RefreshCw } from 'lucide-react'

interface StoryEditorProps {
  storyId: string;
  initialContent?: string;
}

export default function StoryEditor({ storyId, initialContent = '' }: StoryEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const supabase = createClient()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initial content setup
    if (initialContent) setContent(initialContent)

    // Subscribe to Realtime Story Updates
    const channel = supabase.channel(`story:${storyId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'stories',
        filter: `id=eq.${storyId}`
      }, (payload) => {
        // Only update if the change came from another user
        // In a real production app, we would use a CRDT or Yjs for character-level sync.
        // For this MVP scaffold, we'll do a simple state sync.
        if (payload.new.content !== content) {
          setContent(payload.new.content)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [storyId, initialContent])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // Debounced Auto-save
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      const { error } = await supabase
        .from('stories')
        .update({ content: newContent })
        .eq('id', storyId)
      
      if (!error) setLastSaved(new Date())
      setIsSaving(false)
    }, 2000)
  }

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          {isSaving ? (
            <RefreshCw className="w-3 h-3 animate-spin text-accent-cyan" />
          ) : (
            <Save className="w-3 h-3" />
          )}
          {isSaving ? 'Synchronizing...' : lastSaved ? `Last sync ${lastSaved.toLocaleTimeString()}` : 'Ready to write'}
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
            <Wand2 className="w-3 h-3 text-accent-cyan" />
            AI Draft
          </button>
        </div>
      </div>

      <div className="relative group flex-1 min-h-[500px]">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 -z-10" />
        
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start co-creating your epic tale..."
          className="w-full h-full p-12 bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-3xl text-xl leading-relaxed text-slate-200 outline-none focus:ring-1 focus:ring-accent-cyan/50 transition-all font-serif placeholder:italic placeholder:opacity-50 resize-none overflow-y-auto custom-scrollbar"
        />
        
        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 p-1.5 glass rounded-2xl shadow-2xl">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Bold">B</button>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors italic" title="Italic">I</button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-accent-cyan font-bold" title="Scene Analysis">S</button>
        </div>
      </div>
    </div>
  )
}
