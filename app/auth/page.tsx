'use client'

import AuthForm from '@/components/auth/AuthForm'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function AuthPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-purple/20 rounded-full blur-[120px] -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[140px] -z-10 animate-float" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 mb-6 glow-purple">
          <Sparkles className="w-10 h-10 text-white -rotate-12" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-2 italic">
          ANI<span className="text-accent-cyan">GEN</span>
        </h1>
        <p className="text-slate-400 font-medium tracking-wide border-t border-slate-800 pt-2 px-4 uppercase text-xs">
          Collaborative AI Storytelling
        </p>
      </motion.div>

      <AuthForm />

      <footer className="mt-12 text-slate-500 text-xs text-center space-y-2">
        <p>© 2026 Anigen Labs. Powered by Veo, Nanobanana & Lyria.</p>
        <div className="flex gap-4 justify-center">
          <a href="#" className="hover:text-accent-cyan transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent-cyan transition-colors">Terms of Service</a>
        </div>
      </footer>
    </main>
  )
}
