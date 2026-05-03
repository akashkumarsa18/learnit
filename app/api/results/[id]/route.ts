import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await prisma.quizResult.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, email: true } } },
  })
  if (!result || result.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const answers = JSON.parse(result.answers)
  const questionIds = Object.keys(answers)
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    orderBy: { createdAt: 'asc' },
  })
  const parsedQuestions = questions.map((q) => ({
    ...q,
    options: JSON.parse(q.options),
    userAnswer: answers[q.id],
  }))
  return NextResponse.json({
    id: result.id,
    score: result.score,
    totalQuestions: result.totalQuestions,
    timeTaken: result.timeTaken,
    completedAt: result.completedAt,
    questions: parsedQuestions,
  })
}
