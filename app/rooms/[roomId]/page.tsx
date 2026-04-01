'use client'

import { useEffect, useState, useRef, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Send, Sparkles, MessageSquare, Mic, MicOff, BookOpen, Wand2 } from 'lucide-react'
import StoryEditor from '@/components/editor/StoryEditor'

export default function StoryRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const [room, setRoom] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLiveEnabled, setIsLiveEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<'story' | 'chat'>('story')
  
  const supabase = createClient()
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*, stories(*)')
        .eq('id', roomId)
        .single()
      setRoom(data)
    }

    fetchRoom()

    // Real-time Chat Subscription
    const channel = supabase.channel(`room:${roomId}`)
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        setChatMessages(prev => [...prev, payload])
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setParticipants(Object.values(state).flat())
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
              name: user.user_metadata?.display_name || 'Guest Storyteller'
            })
          }
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: room?.created_by === room?.user_id ? 'Author' : 'Collaborator',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    supabase.channel(`room:${roomId}`).send({
      type: 'broadcast',
      event: 'chat',
      payload: message
    })

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Sidebar - Navigation & Presence */}
      <aside className="w-20 lg:w-72 border-r border-white/5 flex flex-col glass">
        <div className="p-6 border-b border-white/5">
          <h2 className="hidden lg:block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Room Activity</h2>
          <div className="flex -space-x-2">
            {participants.map((p, i) => (
              <div key={i} title={p.name} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-accent-purple/20 flex items-center justify-center text-xs font-bold text-white uppercase ring-2 ring-accent-purple/50">
                {p.name[0]}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-500">
              +{Math.max(0, 5 - participants.length)}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('story')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'story' ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Narrative</span>
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Idea Board</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setIsLiveEnabled(!isLiveEnabled)}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all ${isLiveEnabled ? 'bg-red-500 text-white animate-pulse' : 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'}`}
          >
            {isLiveEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span className="hidden lg:block">{isLiveEnabled ? 'LIVE' : 'Go Live'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gradient">{room?.stories?.title || 'Drafting Story...'}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Scene 1: The Awakening</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full text-slate-950 font-bold text-sm glow-cyan hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4" />
            Finalize Scene
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'story' ? (
              <motion.div 
                key="story"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                <StoryEditor storyId={room?.story_id} initialContent={room?.stories?.content} />
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col max-w-2xl mx-auto"
              >
                <div className="flex-1 space-y-6 mb-8">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                      <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                      <p>Start a conversation with your co-authors.</p>
                    </div>
                  )}
                  {chatMessages.map((m) => (
                    <div key={m.id} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{m.sender}</span>
                        <span className="text-[10px] text-slate-600">{m.timestamp}</span>
                      </div>
                      <div className="p-4 glass rounded-2xl rounded-tl-none border border-white/5 text-slate-200">
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="relative mb-6">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Share an idea..."
                    className="w-full pl-6 pr-16 py-4 bg-slate-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-accent-purple outline-none transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent-purple text-white rounded-xl hover:scale-110 active:scale-95 transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Suggestions Floating Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-1 glass-card rounded-2xl flex items-center gap-2 border border-accent-cyan/10">
          <div className="px-4 py-2 text-xs font-bold text-accent-cyan uppercase tracking-widest border-r border-white/5 flex items-center gap-2">
            <Wand2 className="w-3 h-3" />
            Lyria Suggests
          </div>
          <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Add a plot twist</button>
          <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Deepen the mood</button>
          <div className="h-4 w-px bg-white/5 mx-2" />
          <button className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-xl text-xs font-bold hover:bg-accent-cyan/20 transition-all">Refresh</button>
        </div>
      </main>
    </div>
  )
}
