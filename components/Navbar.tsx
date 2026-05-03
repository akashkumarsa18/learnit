'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { LogOut, BookOpen, LayoutDashboard, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            LearnIt
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-white/50 text-sm">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg glass glass-hover text-white/70 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors text-sm">
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
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden text-white/70" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden glass border-t border-white/10 px-4 py-4 space-y-3">
          {session ? (
            <>
              <p className="text-white/50 text-sm">{session.user?.name}</p>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm py-2"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm py-2 w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-white/80 hover:text-white text-sm py-2" onClick={() => setOpen(false)}>
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
