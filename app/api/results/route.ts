import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const results = await prisma.quizResult.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: 'desc' },
    take: 10,
  })
  return NextResponse.json(results)
}
