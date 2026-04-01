'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, Loader2, Check, User, Wand2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AvatarCreator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [traits, setTraits] = useState({
    hairColor: '',
    eyeColor: '',
    style: 'Anime / Manga',
    personality: ''
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  
  const supabase = createClient()

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setGeneratedUrl(null)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/generate/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, traits }),
      })
      const data = await response.json()
      if (data.avatarUrl) {
        setGeneratedUrl(data.avatarUrl)
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedUrl) return
    setSaveStatus('saving')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('avatars')
      .insert({
        user_id: user.id,
        name: prompt.slice(0, 20),
        image_url: generatedUrl,
        traits: traits
      })

    if (!error) {
      setSaveStatus('saved')
      // Update profile avatar as well
      await supabase.from('profiles').update({ avatar_url: generatedUrl }).eq('id', user.id)
    } else {
      setSaveStatus('idle')
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto px-6 py-8">
      {/* Configuration Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8 glass-card p-8 rounded-3xl"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Wand2 className="w-6 h-6 text-accent-cyan" />
            Character Concept
          </h2>
          <p className="text-slate-400 text-sm">Describe your character's appearance and personality.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Text Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic samurai with glowing cyan highlights, silver hair, and a determined expression..."
              className="w-full h-32 p-4 bg-slate-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-accent-cyan outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hair Color</label>
              <input
                type="text"
                value={traits.hairColor}
                onChange={(e) => setTraits({...traits, hairColor: e.target.value})}
                placeholder="Silver / Black"
                className="w-full p-3 bg-slate-900/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-accent-cyan outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Eye Color</label>
              <input
                type="text"
                value={traits.eyeColor}
                onChange={(e) => setTraits({...traits, eyeColor: e.target.value})}
                placeholder="Purple / Blue"
                className="w-full p-3 bg-slate-900/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-accent-cyan outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-blue rounded-2xl font-bold text-slate-950 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 glow-cyan"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            Generate Avatar
          </button>
        </div>
      </motion.div>

      {/* Preview Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col items-center justify-center aspect-square glass-card rounded-3xl relative overflow-hidden group border-2 border-dashed border-white/10"
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-x-0 inset-y-0 m-auto w-12 h-12 text-accent-cyan animate-pulse" />
              </div>
              <p className="text-slate-400 font-medium animate-pulse">Nanobanana is weaving magic...</p>
            </motion.div>
          ) : generatedUrl ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col items-center justify-center p-8 space-y-6"
            >
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl glow-purple border border-white/10">
                <img src={generatedUrl} alt="Generated Avatar" className="w-full h-full object-cover" />
              </div>
              
              <button
                onClick={handleSave}
                disabled={saveStatus !== 'idle'}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-white text-slate-950 hover:scale-105'
                }`}
              >
                {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                 saveStatus === 'saved' ? <Check className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {saveStatus === 'saved' ? 'Avatar Saved!' : 'Set as Profile Avatar'}
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-slate-500 p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                <Upload className="w-10 h-10" />
              </div>
              <p className="max-w-xs">Your character will appear here after generation. Try describing something epic!</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
