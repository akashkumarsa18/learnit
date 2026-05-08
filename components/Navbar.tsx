'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LogOut, BookOpen, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react'

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('qc-theme') as 'dark' | 'light' | null
    if (stored) {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored === 'light' ? 'light' : '')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('qc-theme', next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  return { theme, toggleTheme }
}

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="glass sticky top-0 z-50 border-b border-[var(--qc-glass-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-display bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            LearnIt
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-[var(--qc-fg-4)] hover:text-[var(--qc-fg-1)] transition-colors text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="h-4 w-px bg-[var(--qc-glass-border-strong)]" />
              <span className="text-[var(--qc-fg-5)] text-sm">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg glass glass-hover text-[var(--qc-fg-4)] hover:text-[var(--qc-fg-1)]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-[var(--qc-fg-4)] hover:text-[var(--qc-fg-1)] transition-colors text-sm">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary text-white text-sm px-4 py-2 rounded-lg font-medium"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg glass glass-hover text-[var(--qc-fg-4)] hover:text-[var(--qc-fg-1)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg glass text-[var(--qc-fg-4)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="text-[var(--qc-fg-4)]" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden glass border-t border-[var(--qc-glass-border)] px-4 py-4 space-y-3">
          {session ? (
            <>
              <p className="text-[var(--qc-fg-5)] text-sm">{session.user?.name}</p>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[var(--qc-fg-3)] hover:text-[var(--qc-fg-1)] text-sm py-2"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-[var(--qc-fg-3)] hover:text-[var(--qc-fg-1)] text-sm py-2 w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-[var(--qc-fg-3)] hover:text-[var(--qc-fg-1)] text-sm py-2" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/auth/register" className="block btn-primary text-white text-sm px-4 py-2 rounded-lg font-medium text-center" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
