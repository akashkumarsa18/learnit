export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: string
  explanation?: string | null
}

export interface QuizAnswer {
  questionId: string
  selectedIndex: number
}

export interface QuizResult {
  id: string
  score: number
  totalQuestions: number
  timeTaken: number
  completedAt: string
  answers: QuizAnswer[]
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
