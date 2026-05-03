'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock, Send, AlertCircle } from 'lucide-react'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import type { Question } from '@/types'

const TOTAL_SECONDS = 30 * 60 // 30 minutes

export default function QuizPage() {
  const { status } = useSession()
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/questions')
      .then((r) => r.json())
      .then((d) => { setQuestions(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => { setError('Failed to load questions'); setLoading(false) })
  }, [])

  // Countdown timer
  useEffect(() => {
    if (loading || submitting) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, submitting])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['1','2','3','4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1
        if (questions[current]?.options[idx] !== undefined) selectAnswer(idx)
      }
      if (e.key === 'ArrowRight' && current < questions.length - 1) setCurrent(current + 1)
      if (e.key === 'ArrowLeft' && current > 0) setCurrent(current - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions])

  const selectAnswer = useCallback((idx: number) => {
    if (!questions[current]) return
    setAnswers((prev) => ({ ...prev, [questions[current].id]: idx }))
  }, [current, questions])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    setShowConfirm(false)
    const timeTaken = TOTAL_SECONDS - timeLeft
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeTaken }),
      })
      const data = await res.json()
      if (data.resultId) router.push(`/results?id=${data.resultId}`)
    } catch {
      setSubmitting(false)
    }
  }, [answers, router, submitting, timeLeft])

  const answered = Object.keys(answers).length
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timerWarning = timeLeft < 300

  const q = questions[current]
  const optionLabels = ['A', 'B', 'C', 'D']

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Background />
      <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/50 text-sm">Loading quiz...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <Background />
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-white text-lg">{error}</p>
      <button onClick={() => router.push('/dashboard')} className="btn-primary px-6 py-3 rounded-xl text-white">
        Back to Dashboard
      </button>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />

      {/* Submit Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-strong rounded-2xl p-8 max-w-sm w-full text-center">
            <Send className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Submit Quiz?</h3>
            <p className="text-white/55 mb-6 text-sm">
              You answered <strong className="text-white">{answered}</strong> of{' '}
              <strong className="text-white">{questions.length}</strong> questions.
              {answered < questions.length && ' Unanswered questions will be marked wrong.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 glass glass-hover py-3 rounded-xl text-white/70 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 btn-primary py-3 rounded-xl text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <span className="text-white/50 text-sm font-medium">
            Question <span className="text-white font-bold">{current + 1}</span> of {questions.length}
          </span>

          {/* Timer */}
          <div className={`flex items-center gap-1.5 glass rounded-full px-4 py-1.5 ${timerWarning ? 'border-red-500/50 bg-red-500/10' : ''}`}>
            <Clock className={`w-3.5 h-3.5 ${timerWarning ? 'text-red-400' : 'text-purple-400'}`} />
            <span className={`font-mono text-sm font-semibold ${timerWarning ? 'text-red-300' : 'text-white'}`}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>

          <span className="text-white/50 text-sm">
            <span className="text-purple-300 font-bold">{answered}</span>/{questions.length} answered
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question card */}
        {q && (
          <div key={q.id} className="glass-strong rounded-2xl p-6 sm:p-8 mb-5 card-enter">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full glass text-purple-300 border-purple-500/30">
                {q.category}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full glass ${
                q.difficulty === 'easy' ? 'text-green-300 border-green-500/30' :
                q.difficulty === 'hard' ? 'text-red-300 border-red-500/30' :
                'text-yellow-300 border-yellow-500/30'
              }`}>
                {q.difficulty}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-7">
              {q.text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`option-card w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl ${selected ? 'option-selected' : ''}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      selected ? 'bg-purple-500/50 text-white' : 'bg-white/10 text-white/60'
                    }`}>
                      {optionLabels[i]}
                    </span>
                    <span className="text-white/90 text-sm sm:text-base">{opt}</span>
                  </button>
                )
              })}
            </div>

            <p className="text-white/25 text-xs mt-5 text-right">
              Tip: Press 1–4 to select · ← → to navigate
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex items-center gap-2 glass glass-hover px-5 py-3 rounded-xl text-white/70 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
            >
              {submitting ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : <Send className="w-4 h-4" />}
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              className="flex items-center gap-2 btn-primary px-5 py-3 rounded-xl text-white font-medium"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="glass rounded-2xl p-4">
          <p className="text-white/40 text-xs mb-3 text-center">Question Navigator</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((q, i) => {
              const isCurrent = i === current
              const isAnswered = answers[q.id] !== undefined
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrent(i)}
                  title={`Question ${i + 1}`}
                  className={`q-dot ${isCurrent ? 'q-dot-current' : isAnswered ? 'q-dot-answered' : 'q-dot-unanswered'}`}
                />
              )
            })}
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-white/20" /> Unanswered
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-white" /> Current
            </span>
          </div>
        </div>

        {/* Floating submit when all answered */}
        {answered === questions.length && !submitting && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-primary flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-2xl shadow-purple-500/30"
            >
              <Send className="w-4 h-4" /> Submit All Answers
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
