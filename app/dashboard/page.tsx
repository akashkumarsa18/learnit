'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Play, Trophy, Target, Clock, ChevronRight, BookOpen, TrendingUp } from 'lucide-react'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'

interface ResultSummary {
  id: string
  score: number
  totalQuestions: number
  timeTaken: number
  completedAt: string
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [results, setResults] = useState<ResultSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/results')
      .then((r) => r.json())
      .then((d) => { setResults(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const bestScore = results.length ? Math.max(...results.map((r) => Math.round((r.score / r.totalQuestions) * 100))) : 0
  const avgScore = results.length ? Math.round(results.reduce((a, r) => a + (r.score / r.totalQuestions) * 100, 0) / results.length) : 0

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <Background />
      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{session?.user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-white/50">Ready to challenge yourself today?</p>
        </div>

        {/* Start Quiz CTA */}
        <div className="glass-strong rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium uppercase tracking-wider">Quiz Available</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">30-Question Knowledge Test</h2>
              <p className="text-white/55">Science · History · Geography · Technology · Math · Art</p>
            </div>
            <button
              onClick={() => router.push('/quiz')}
              className="btn-primary flex items-center gap-2 px-7 py-4 rounded-xl text-white font-semibold whitespace-nowrap shrink-0"
            >
              <Play className="w-5 h-5" /> Start Quiz
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Quizzes Taken', value: results.length, icon: Target, color: 'text-purple-400' },
            { label: 'Best Score', value: results.length ? `${bestScore}%` : '—', icon: Trophy, color: 'text-yellow-400' },
            { label: 'Average Score', value: results.length ? `${avgScore}%` : '—', icon: TrendingUp, color: 'text-cyan-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/50 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent results */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">Recent Attempts</h3>
            <Clock className="w-4 h-4 text-white/40" />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No quizzes taken yet. Start your first quiz!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r) => {
                const pct = Math.round((r.score / r.totalQuestions) * 100)
                const color = pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'
                return (
                  <Link
                    key={r.id}
                    href={`/results?id=${r.id}`}
                    className="flex items-center justify-between p-4 rounded-xl glass glass-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-xl font-bold ${color} w-14 text-right`}>{pct}%</div>
                      <div>
                        <p className="text-white text-sm font-medium">{r.score}/{r.totalQuestions} correct</p>
                        <p className="text-white/40 text-xs">{formatDate(r.completedAt)} · {formatTime(r.timeTaken)}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
