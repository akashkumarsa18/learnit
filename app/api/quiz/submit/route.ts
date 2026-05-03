import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { answers, timeTaken } = await req.json()
  // answers: { [questionId]: selectedIndex }
  const questionIds = Object.keys(answers)
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  })
  let score = 0
  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) score++
  }
  const result = await prisma.quizResult.create({
    data: {
      userId: session.user.id,
      score,
      totalQuestions: questionIds.length,
      timeTaken: timeTaken ?? 0,
      answers: JSON.stringify(answers),
    },
  })
  return NextResponse.json({ resultId: result.id, score, total: questionIds.length })
}
