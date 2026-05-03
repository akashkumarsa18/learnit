import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
    return NextResponse.json({ id: user.id, name: user.name, email: user.email })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
