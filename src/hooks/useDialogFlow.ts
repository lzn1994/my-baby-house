import { useState, useCallback } from 'react'
import type { StyleQuizQuestion } from '../types'

export function useDialogFlow(questions: StyleQuizQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const currentQuestion = questions[currentIndex] ?? null
  const isFirst = currentIndex === 0
  const isLast = questions.length > 0 && currentIndex === questions.length - 1
  const totalSteps = questions.length
  const progress = questions.length > 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, questions.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }, [questions.length])

  const setAnswer = useCallback((questionId: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }, [])

  const getAnswer = useCallback(
    (questionId: number) => {
      return answers[questionId] || null
    },
    [answers]
  )

  const selectAndNext = useCallback(
    (optionId: string) => {
      if (currentQuestion && !isLast) {
        setAnswer(currentQuestion.id, optionId)
        goNext()
      }
    },
    [currentQuestion, isLast, goNext, setAnswer]
  )

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
  }, [])

  const isAnswered = useCallback(
    (questionId: number) => {
      return !!answers[questionId]
    },
    [answers]
  )

  return {
    currentQuestion,
    currentIndex,
    answers,
    isFirst,
    isLast,
    totalSteps,
    progress,
    goNext,
    goPrev,
    goTo,
    setAnswer,
    getAnswer,
    selectAndNext,
    reset,
    isAnswered,
  }
}
