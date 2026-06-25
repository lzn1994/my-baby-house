import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { AppState, AppAction } from '../types'

const STORAGE_KEY = 'renovation-app-state'

const initialState: AppState = {
  currentView: 'onboarding',
  userSession: {
    styleResult: null,
    budgetTotal: 0,
    budgetBreakdown: null,
    city: '',
    area: 0,
    specialNeeds: [],
    floorPlan: null,
  },
  sopProgress: {
    currentStep: 1,
    completedSteps: [],
    stageUnlockStatus: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false },
  },
  nianProgress: {
    level: 1,
    spiritPoints: 0,
    jadeStones: 100,
    houseScore: 0,
    streakDays: 0,
    equipment: [
      { id: 'red-ribbon', name: '红绸带', description: '灵气+5%', icon: '🎀' },
    ],
    emotion: 'happy',
  },
  demoMode: {
    isActive: false,
    currentChapter: 0,
    progress: 0,
  },
}

function loadState(): AppState {
  if (typeof window === 'undefined') return initialState
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...initialState, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error)
  }
  return initialState
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error)
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }

    case 'SET_STYLE_RESULT':
      return {
        ...state,
        userSession: {
          ...state.userSession,
          styleResult: action.payload,
        },
      }

    case 'SET_BUDGET':
      return {
        ...state,
        userSession: {
          ...state.userSession,
          budgetTotal: action.payload.total,
          budgetBreakdown: action.payload.breakdown,
        },
      }

    case 'SET_USER_SESSION':
      return {
        ...state,
        userSession: {
          ...state.userSession,
          ...action.payload,
        },
      }

    case 'UPDATE_SOP_STEP':
      return {
        ...state,
        sopProgress: {
          ...state.sopProgress,
          currentStep: action.payload,
        },
      }

    case 'COMPLETE_STEP': {
      const stepId = action.payload
      const newCompletedSteps = state.sopProgress.completedSteps.includes(stepId)
        ? state.sopProgress.completedSteps
        : [...state.sopProgress.completedSteps, stepId]
      
      const newCurrentStep = stepId >= state.sopProgress.currentStep
        ? Math.min(stepId + 1, 20)
        : state.sopProgress.currentStep

      const stageId = Math.ceil(stepId / 3)
      const nextStageId = stageId + 1
      const newStageUnlockStatus = { ...state.sopProgress.stageUnlockStatus }
      if (nextStageId <= 6) {
        newStageUnlockStatus[nextStageId] = true
      }

      return {
        ...state,
        sopProgress: {
          ...state.sopProgress,
          currentStep: newCurrentStep,
          completedSteps: newCompletedSteps,
          stageUnlockStatus: newStageUnlockStatus,
        },
        nianProgress: {
          ...state.nianProgress,
          spiritPoints: state.nianProgress.spiritPoints + 10,
          houseScore: state.nianProgress.houseScore + 5,
        },
      }
    }

    case 'UPDATE_NIAN':
      return {
        ...state,
        nianProgress: {
          ...state.nianProgress,
          ...action.payload,
        },
      }

    case 'SET_DEMO_MODE':
      return {
        ...state,
        demoMode: {
          ...state.demoMode,
          ...action.payload,
        },
      }

    case 'RESET_STATE':
      window.localStorage.removeItem(STORAGE_KEY)
      return initialState

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export default AppContext
