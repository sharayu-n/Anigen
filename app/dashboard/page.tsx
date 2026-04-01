'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Film, LayoutGrid, Clock, ChevronRight, Sparkles, Play, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStories = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('stories')
          .select('*, scenes(*)')
          .order('created_at', { ascending: false })
        setStories(data || [])
      }
      setLoading(false)
    }

    fetchStories()
  }, [])

  const handleCreateRoom = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Create a new story narrative
    const { data: story } = await supabase
      .from('stories')
      .insert({ title: 'New Epic Adventure', content: '' })
      .select()
      .single()

    if (story) {
      // 2. Create a room for this story
      const { data: room } = await supabase
        .from('rooms')
        .insert({ 
          name: 'My Story Room', 
          created_by: user.id,
          story_id: story.id 
        })
        .select()
        .single()

      if (room) window.location.href = `/rooms/${room.id}`
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 italic">
            YOUR <span className="text-accent-cyan">STORYBOARD</span>
          </h1>
          <p className="text-slate-400">Co-create, generate, and explore your collaborative tales.</p>
        </div>
        
        <button 
          onClick={handleCreateRoom}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-blue text-slate-950 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all glow-cyan"
        >
          <Plus className="w-5 h-5" />
          Start New Story
        </button>
      </div>

      {/* Stats / Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-accent-cyan">
          <div className="p-3 bg-accent-cyan/10 rounded-xl text-accent-cyan">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stories.length}</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Active Stories</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-accent-purple">
          <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stories.filter(s => s.status === 'completed').length}</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Generations Ready</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-accent-blue">
          <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">128</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Manga Panels</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-8">
        <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent-cyan" />
          Recent Creations
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-900/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl border-dashed border-2 border-white/5">
            <Sparkles className="w-16 h-16 text-slate-700 mb-4 animate-float" />
            <p className="text-slate-500 text-lg">Your library is empty. Time to start an epic journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -8 }}
                className="glass-card group rounded-3xl overflow-hidden cursor-pointer relative"
              >
                <div className="aspect-video relative bg-slate-900 group-hover:after:bg-accent-cyan/10 after:inset-0 after:absolute transition-all">
                  {/* Preview Image / Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                    {story.status === 'completed' ? <Play className="w-12 h-12 text-white" /> : <BookOpen className="w-12 h-12 text-slate-700" />}
                  </div>
                  {story.scenes?.[0]?.manga_url && (
                    <img src={story.scenes[0].manga_url} alt={story.title} className="w-full h-full object-cover" />
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    story.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    story.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse' :
                    'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                  }`}>
                    {story.status}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-bold uppercase tracking-wide">
                    {story.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-accent-cyan">
                        <Film className="w-3 h-3" />
                        Video Generated
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500">
                        <ImageIcon className="w-3 h-3" />
                        Drafting...
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold mb-4 group-hover:text-accent-cyan transition-colors">{story.title}</h4>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-500">Created {new Date(story.created_at).toLocaleDateString()}</span>
                    <Link 
                      href={story.status === 'completed' ? `/view/${story.id}` : `/rooms/${story.id}`}
                      className="text-white hover:text-accent-cyan transition-colors flex items-center gap-1 text-sm font-bold"
                    >
                      {story.status === 'completed' ? 'View Final' : 'Continue'}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
