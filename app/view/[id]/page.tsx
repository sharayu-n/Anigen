'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, LayoutGrid, Music, Share2, Download, ChevronLeft, Sparkles, Play, Pause, Volume2 } from 'lucide-react'
import Link from 'next/link'

export default function StoryView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [story, setStory] = useState<any>(null)
  const [scenes, setScenes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'video' | 'manga'>('video')
  const [isPlaying, setIsPlaying] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchStory = async () => {
      const { data: storyData } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single()
      
      const { data: scenesData } = await supabase
        .from('scenes')
        .select('*')
        .eq('story_id', id)
        .order('order', { ascending: true })
      
      setStory(storyData)
      setScenes(scenesData || [])
      setLoading(false)
    }

    fetchStory()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Sparkles className="w-12 h-12 text-accent-cyan animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Header */}
      <header className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5">
        <div className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-accent-cyan transition-colors text-sm font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" />
            Back to Library
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic text-gradient uppercase">
            {story?.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs font-bold border border-white/10 uppercase">
              <Film className="w-3 h-3" /> Animated Series
            </span>
            <span className="text-xs uppercase font-bold tracking-widest">Completed March 2026</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:bg-white/10 transition-all font-bold">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-accent-cyan text-slate-950 rounded-2xl hover:scale-105 active:scale-95 transition-all font-bold glow-cyan">
            <Download className="w-5 h-5" /> Export 4K
          </button>
        </div>
      </header>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-center">
        <div className="p-1 glass rounded-2xl flex items-center gap-1 border border-white/5 shadow-2xl">
          <button 
            onClick={() => setActiveView('video')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'video' ? 'bg-accent-blue text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <Film className="w-4 h-4" /> Video View
          </button>
          <button 
            onClick={() => setActiveView('manga')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'manga' ? 'bg-accent-purple text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Manga View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {activeView === 'video' ? (
            <motion.div 
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              {/* Main Player */}
              <div className="aspect-video bg-slate-900 rounded-[40px] overflow-hidden relative shadow-2xl border border-white/5 group">
                {scenes[0]?.video_url ? (
                  <video src={scenes[0].video_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950">
                    <Play className="w-24 h-24 mb-4 opacity-10 group-hover:opacity-100 group-hover:scale-110 group-hover:text-accent-cyan transition-all duration-700" />
                    <p className="font-bold tracking-widest text-xs uppercase opacity-20">Previewing Compiled Series</p>
                  </div>
                )}
                
                {/* Custom Controls Overly */}
                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                  <div className="p-2 glass rounded-2xl flex items-center gap-4 pr-6">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-white text-slate-950 rounded-xl hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">Episode 01</span>
                      <span className="text-[10px] text-slate-400">01:42 / 03:30</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-2 glass rounded-2xl">
                      <Volume2 className="w-4 h-4 text-white" />
                      <div className="w-20 h-1 bg-white/20 rounded-full relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-3/4 bg-accent-cyan" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scene Breakdown */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {scenes.map((scene, i) => (
                  <div key={i} className="glass-card group rounded-2xl overflow-hidden hover:border-accent-cyan/30 transition-all">
                    <div className="aspect-video relative bg-slate-900 overflow-hidden">
                      <img src={scene.manga_url} alt={`Scene ${i+1}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-1 rounded text-accent-cyan font-bold uppercase tracking-widest">Scene {i+1}</div>
                    </div>
                    <div className="p-4 bg-slate-900/40">
                      <p className="text-xs text-slate-400 line-clamp-2 italic font-serif">"{scene.content}"</p>
                      <div className="mt-3 flex items-center gap-2 overflow-hidden">
                        <span className="px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple text-[8px] font-bold uppercase tracking-widest border border-accent-purple/20">
                          {scene.mood}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="manga"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid gap-12"
            >
              {/* Sequential Manga Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {scenes.map((scene, i) => (
                  <div key={i} className={`flex flex-col glass-card rounded-3xl overflow-hidden border border-white/5 ${i % 3 === 0 ? 'md:col-span-2' : ''}`}>
                    <div className={`${i % 3 === 0 ? 'aspect-[21/9]' : 'aspect-square'} relative overflow-hidden group`}>
                      <img src={scene.manga_url} alt={`Manga Panel ${i+1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-12 left-12 max-w-lg">
                        <h5 className="text-3xl font-black italic tracking-tighter text-white mb-4 uppercase drop-shadow-lg">{scene.mood}</h5>
                        <p className="text-xl font-serif text-slate-100 leading-relaxed drop-shadow-lg line-clamp-3">
                          {scene.content}
                        </p>
                      </div>
                      <div className="absolute top-8 right-8 w-12 h-12 glass rounded-full flex items-center justify-center text-xl font-black italic text-accent-cyan">
                        {i + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Soundtrack Card */}
              <div className="glass-card rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 border-l-8 border-accent-blue">
                <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-2xl relative group overflow-hidden">
                  <Music className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 animate-pulse" />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Original Cinematic Score</h3>
                    <p className="text-slate-400">Generated with Lyria AI to perfectly match your story's emotional arc.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Atmospheric Ambience</span>
                      <span className="text-accent-cyan">Track Locked</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple w-2/3" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-2 bg-white text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2">
                       <Play className="w-4 h-4 fill-current" /> Play Album
                    </button>
                    <button className="px-6 py-2 glass text-white font-bold rounded-xl text-sm border border-white/10">
                      Download MP3
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
