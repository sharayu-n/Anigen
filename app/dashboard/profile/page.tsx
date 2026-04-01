'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { User, Mail, Save, Loader2, Image as ImageIcon } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setDisplayName(profile.display_name || '')
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 md:p-12"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/10 flex items-center justify-center relative group overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Account Settings</h1>
            <p className="text-slate-400">Manage your identity and storyteller profile.</p>
          </div>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider ml-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-accent-cyan/50 outline-none transition-all"
                  placeholder="Your storyteller name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider ml-1">Email (Private)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/30 border border-white/5 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-accent-cyan text-slate-950 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all glow-cyan disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
