'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BookOpen, Brain, Trophy, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-sm text-purple-300 border-purple-500/30">
          <Zap className="w-3.5 h-3.5" />
          <span>30 MCQ Questions · Instant Results</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-7xl font-bold mb-6 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent glow-text">
            Test Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Knowledge
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Challenge yourself with our interactive quiz platform. Track your progress,
          compete on the leaderboard, and master new topics — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session ? (
            <button
              onClick={() => router.push('/quiz')}
              className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg w-full sm:w-auto justify-center"
            >
              Start Quiz <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg w-full sm:w-auto justify-center"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="glass glass-hover flex items-center gap-2 px-8 py-4 rounded-xl text-white/80 font-medium text-lg w-full sm:w-auto justify-center"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: '30', label: 'Questions' },
            { value: '6', label: 'Categories' },
            { value: '100%', label: 'Free' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center mb-4 text-[var(--qc-fg-1)]">
          Everything You Need
        </h2>
        <p className="text-[var(--qc-fg-5)] text-center mb-12 text-lg">Packed with features to make learning fun and effective</p>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'Smart Questions',
              desc: '30 carefully crafted MCQs covering Geography, Science, History, Technology, Math, and more.',
              color: 'from-purple-500 to-indigo-500',
            },
            {
              icon: Trophy,
              title: 'Progress Tracking',
              desc: 'Real-time progress bar, countdown timer, and interactive question navigation dots.',
              color: 'from-pink-500 to-rose-500',
            },
            {
              icon: CheckCircle,
              title: 'Instant Results',
              desc: 'Get a detailed breakdown of your answers with explanations and an animated score reveal.',
              color: 'from-cyan-500 to-blue-500',
            },
          ].map((f) => (
            <div key={f.title} className="glass glass-hover rounded-2xl p-6 text-left">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--qc-fg-1)] mb-2">{f.title}</h3>
              <p className="text-[var(--qc-fg-4)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="glass-strong rounded-3xl p-10">
          <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-[var(--qc-fg-1)] mb-3">Ready to Test Yourself?</h2>
          <p className="text-[var(--qc-fg-4)] mb-8 text-lg">Join thousands of learners who use LearnIt every day.</p>
          {session ? (
            <button
              onClick={() => router.push('/quiz')}
              className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2"
            >
              Start Quiz Now <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/auth/register"
              className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      <footer className="text-center py-8 text-white/30 text-sm">
        © 2024 LearnIt · Built with ❤️ for knowledge seekers
      </footer>
    </div>
  )
}
