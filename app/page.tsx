'use client'

import { motion } from 'framer-motion'
import { Sparkles, Users, Video, BookOpen, Layers, Zap, ChevronRight, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-accent-cyan/10 via-accent-purple/5 to-transparent rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-accent-cyan text-xs font-bold tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            The Future of Collaborative Creation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter italic leading-tight"
          >
            CO-CREATE <span className="text-gradient">STORIES</span> <br /> 
            TURN THEM INTO <span className="text-accent-cyan">MOVIES</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Anigen brings your imagination to life. Collaborate in real-time, generate personalized avatars, and transform your narratives into cinematic videos or manga—all powered by advanced AI.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link 
              href="/auth" 
              className="group relative px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all glow-cyan"
            >
              Start Creating Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="flex items-center gap-3 px-8 py-4 glass-card rounded-2xl text-white font-bold hover:bg-white/10 transition-all">
              <PlayCircle className="w-6 h-6 text-accent-cyan" />
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <Users />, title: 'Live Collaboration', desc: 'Write stories together in real-time rooms with lightning-fast sync.' },
          { icon: <Sparkles />, title: 'Avatar Engine', desc: 'Generate consistent anime personas using Nanobanana AI.' },
          { icon: <Video />, title: 'Veo Animations', desc: 'Turn your scene scripts into stunning 4K animated videos.' },
          { icon: <BookOpen />, title: 'Manga Studio', desc: 'Auto-layout your narrative into classic manga panels instantly.' }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-3xl border border-white/5 hover:border-accent-cyan/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-accent-cyan mb-6 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Tech Stack Overlay */}
      <section className="bg-slate-950/50 py-20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-purple/5 to-accent-blue/5 animate-pulse" />
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <Zap className="text-accent-cyan" /> NEXT.JS
          </div>
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <Layers className="text-accent-purple" /> SUPABASE
          </div>
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            VEO AI
          </div>
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            LYRIA
          </div>
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            NANOBANANA
          </div>
        </div>
      </section>

      {/* Big Visual Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto glass-card rounded-[40px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 -z-10" />
          <div className="p-12 md:p-24 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 italic tracking-tighter">YOUR WORLD, <span className="text-accent-cyan">ANIMATED.</span></h2>
            <div className="w-full max-w-4xl aspect-video rounded-3xl shadow-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden relative group">
              {/* This would be an actually generated video or mockup image */}
              <div className="flex flex-col items-center gap-4 text-slate-600 group-hover:text-accent-cyan transition-colors">
                <PlayCircle className="w-20 h-20" />
                <span className="font-bold tracking-widest text-xs uppercase">Preview Generation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-8">Ready to start your first room?</h3>
        <Link 
          href="/auth" 
          className="px-12 py-5 bg-accent-purple text-white font-bold rounded-2xl hover:bg-accent-purple/80 hover:scale-105 active:scale-95 transition-all glow-purple inline-block"
        >
          Get Started For Free
        </Link>
      </section>
    </main>
  )
}
