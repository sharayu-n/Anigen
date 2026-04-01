'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, LayoutDashboard, User, LogOut, PlusSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  if (pathname === '/auth') return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-lg flex items-center justify-center glow-cyan transition-transform group-hover:rotate-12">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight italic">
          ANI<span className="text-accent-cyan">GEN</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-accent-cyan' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              href="/rooms/new" 
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-full text-white hover:bg-accent-purple/20 transition-all"
            >
              <PlusSquare className="w-4 h-4 text-accent-purple" />
              New Room
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <Link 
              href="/dashboard/profile" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/dashboard/profile' ? 'text-accent-cyan' : 'text-slate-400 hover:text-white'}`}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button 
              onClick={handleSignOut}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Link 
            href="/auth" 
            className="px-6 py-2 bg-accent-cyan text-slate-950 font-bold rounded-full hover:scale-105 transition-all glow-cyan"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  )
}
