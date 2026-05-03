'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Trophy, RotateCcw, LayoutDashboard, CheckCircle, XCircle, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'

interface ResultQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: string
  explanation?: string | null
  userAnswer: number
}

interface Result {
  id: string
  score: number
  totalQuestions: number
  timeTaken: number
  completedAt: string
  questions: ResultQuestion[]
}

function CircularProgress({ pct }: { pct: number }) {
  const r = 72
  const circ = 2 * Math.PI * r
  const [anim, setAnim] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setAnim(pct), 200)
    return () => clearTimeout(timeout)
  }, [pct])

  const offset = circ - (anim / 100) * circ
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444'

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 168 168">
        <circle cx="84" cy="84" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="84" cy="84" r={r} fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">{Math.round(anim)}%</span>
        <span className="text-white/50 text-sm">Score</span>
      </div>
    </div>
  )
}

function ResultsContent() {
  const { status } = useSession()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')

  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    if (!id) { setError('No result ID'); setLoading(false); return }
    fetch(`/api/results/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); setLoading(false); return }
        setResult(d); setLoading(false)
      })
      .catch(() => { setError('Failed to load results'); setLoading(false) })
  }, [id])

  // Animate score counter
  useEffect(() => {
    if (!result) return
    let frame: NodeJS.Timeout
    const target = result.score
    let current = 0
    const step = () => {
      current = Math.min(current + 1, target)
      setDisplayScore(current)
      if (current < target) frame = setTimeout(step, 50)
    }
    const t = setTimeout(step, 400)
    return () => { clearTimeout(t); clearTimeout(frame) }
  }, [result])

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Background />
      <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/50 text-sm">Loading results...</p>
    </div>
  )

  if (error || !result) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <Background />
      <p className="text-white text-lg">{error || 'Result not found'}</p>
      <button onClick={() => router.push('/dashboard')} className="btn-primary px-6 py-3 rounded-xl text-white">
        Back to Dashboard
      </button>
    </div>
  )

  const pct = Math.round((result.score / result.totalQuestions) * 100)
  const badge =
    pct >= 90 ? { label: 'Excellent! 🏆', color: 'text-yellow-300' } :
    pct >= 70 ? { label: 'Great Job! 🎉', color: 'text-green-300' } :
    pct >= 50 ? { label: 'Good Effort! 👍', color: 'text-blue-300' } :
    { label: 'Keep Practicing! 💪', color: 'text-orange-300' }

  const mins = Math.floor(result.timeTaken / 60)
  const secs = result.timeTaken % 60

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Score card */}
        <div className="glass-strong rounded-3xl p-8 text-center mb-6 card-enter">
          <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-1">Quiz Complete!</h1>
          <p className={`text-lg font-semibold mb-8 ${badge.color}`}>{badge.label}</p>

          <CircularProgress pct={pct} />

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-bold text-green-400">{displayScore}</p>
              <p className="text-white/50 text-xs mt-0.5">Correct</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-bold text-red-400">{result.totalQuestions - displayScore}</p>
              <p className="text-white/50 text-xs mt-0.5">Wrong</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-white/40" />
                {mins}:{String(secs).padStart(2,'0')}
              </p>
              <p className="text-white/50 text-xs mt-0.5">Time Taken</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              onClick={() => router.push('/quiz')}
              className="flex-1 flex items-center justify-center gap-2 glass glass-hover py-3.5 rounded-xl text-white/80 font-medium"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          </div>
        </div>

        {/* Question breakdown */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Answer Breakdown</h2>
          <div className="space-y-3">
            {result.questions.map((q, i) => {
              const correct = q.userAnswer === q.correctAnswer
              const skipped = q.userAnswer === undefined || q.userAnswer === null || (q.userAnswer as unknown) === -1
              const isOpen = expandedIdx === i

              return (
                <div key={q.id} className={`rounded-xl border overflow-hidden ${
                  skipped ? 'border-white/15 bg-white/5' :
                  correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                }`}>
                  <button
                    className="w-full flex items-center gap-3 p-4 text-left"
                    onClick={() => setExpandedIdx(isOpen ? null : i)}
                  >
                    {skipped ? (
                      <span className="w-6 h-6 rounded-full bg-white/15 shrink-0 flex items-center justify-center text-white/40 text-xs font-bold">—</span>
                    ) : correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="flex-1 text-sm text-white/85 font-medium line-clamp-2">{i + 1}. {q.text}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2">
                      {q.options.map((opt, oi) => {
                        const isCorrectOpt = oi === q.correctAnswer
                        const isUserOpt = oi === q.userAnswer
                        return (
                          <div
                            key={oi}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                              isCorrectOpt ? 'bg-green-500/20 text-green-200' :
                              isUserOpt && !isCorrectOpt ? 'bg-red-500/20 text-red-200' :
                              'text-white/50'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrectOpt ? 'bg-green-500/40 text-green-200' :
                              isUserOpt ? 'bg-red-500/40 text-red-200' :
                              'bg-white/10 text-white/40'
                            }`}>
                              {['A','B','C','D'][oi]}
                            </span>
                            {opt}
                            {isCorrectOpt && <CheckCircle className="w-3.5 h-3.5 text-green-400 ml-auto" />}
                            {isUserOpt && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto" />}
                          </div>
                        )
                      })}
                      {q.explanation && (
                        <div className="mt-2 px-3 py-2.5 rounded-lg bg-white/5 text-white/55 text-xs leading-relaxed">
                          💡 {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
