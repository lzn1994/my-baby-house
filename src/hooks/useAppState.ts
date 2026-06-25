import { useAppContext } from '../context/AppContext'
import type { AppView, StyleResult, BudgetBreakdown, NianProgress } from '../types'

export function useAppState() {
  const { state, dispatch } = useAppContext()

  const setView = (view: AppView) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }

  const setStyleResult = (result: StyleResult) => {
    dispatch({ type: 'SET_STYLE_RESULT', payload: result })
  }

  const setBudget = (total: number, breakdown: BudgetBreakdown) => {
    dispatch({ type: 'SET_BUDGET', payload: { total, breakdown } })
  }

  const setUserSession = (session: Partial<typeof state.userSession>) => {
    dispatch({ type: 'SET_USER_SESSION', payload: session })
  }

  const updateSOPStep = (stepId: number) => {
    dispatch({ type: 'UPDATE_SOP_STEP', payload: stepId })
  }

  const completeStep = (stepId: number) => {
    dispatch({ type: 'COMPLETE_STEP', payload: stepId })
  }

  const updateNian = (progress: Partial<NianProgress>) => {
    dispatch({ type: 'UPDATE_NIAN', payload: progress })
  }

  const setDemoMode = (demo: Partial<typeof state.demoMode>) => {
    dispatch({ type: 'SET_DEMO_MODE', payload: demo })
  }

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' })
  }

  return {
    state,
    dispatch,
    setView,
    setStyleResult,
    setBudget,
    setUserSession,
    updateSOPStep,
    completeStep,
    updateNian,
    setDemoMode,
    resetState,
  }
}
