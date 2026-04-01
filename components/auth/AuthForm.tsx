'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for confirmation!')
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 glass-card rounded-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gradient">
        {mode === 'login' ? 'Welcome Back' : 'Join Anigen'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent-cyan outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent-cyan outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] rounded-lg font-semibold text-white transition-all glow-purple disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="h-px bg-slate-800 flex-1" />
        <span className="text-xs text-slate-500 uppercase">Or continue with</span>
        <div className="h-px bg-slate-800 flex-1" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button 
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2 py-2 px-4 glass rounded-lg hover:bg-white/10 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          <span className="text-sm">Google</span>
        </button>
        <button 
          onClick={() => handleSocialLogin('github')}
          className="flex items-center justify-center gap-2 py-2 px-4 glass rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span className="text-sm">GitHub</span>
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-400">
        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-accent-cyan font-medium hover:underline"
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </motion.div>
  )
}
