import { useRef, useState, useCallback, useEffect } from 'react'
import { useAppState } from './useAppState'
import { demoChapters, type DemoAction, type DemoChapter } from '../data/demo-script'
import { demoStyleResult, demoBudgetBreakdown, demoNianProgress, demoCity, demoArea } from '../data/mock-demo'
import { trackEvent } from '../utils/tracking'
import type { AppState } from '../types'

export interface DemoModeState {
  isPlaying: boolean
  isActive: boolean
  currentChapterIndex: number
  currentActionIndex: number
  progress: number
  chapterProgress: number
  isPaused: boolean
  isCompleted: boolean
  showConfirm: boolean
  spotlightVisible: boolean
  spotlightSelector: string
  spotlightPosition: 'top' | 'bottom' | 'left' | 'right' | 'center'
  spotlightMessage: string
  speakMessage: string
  speakVisible: boolean
}

export function useDemoMode() {
  const { state, dispatch, setView, setStyleResult, setUserSession, setDemoMode } = useAppState()

  const [demoState, setDemoState] = useState<DemoModeState>({
    isPlaying: false,
    isActive: false,
    currentChapterIndex: 0,
    currentActionIndex: 0,
    progress: 0,
    chapterProgress: 0,
    isPaused: false,
    isCompleted: false,
    showConfirm: false,
    spotlightVisible: false,
    spotlightSelector: '',
    spotlightPosition: 'top',
    spotlightMessage: '',
    speakMessage: '',
    speakVisible: false,
  })

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const originalStateRef = useRef<AppState | null>(null)
  const actionTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const currentChapterIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const demoStartTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const totalPausedDurationRef = useRef<number>(0)

  const currentChapter: DemoChapter | undefined = demoChapters[demoState.currentChapterIndex]

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
    actionTimersRef.current.forEach((t) => clearTimeout(t))
    actionTimersRef.current.clear()
  }, [])

  const saveOriginalState = useCallback(() => {
    originalStateRef.current = JSON.parse(JSON.stringify(state))
  }, [state])

  const restoreOriginalState = useCallback(() => {
    if (originalStateRef.current) {
      dispatch({ type: 'RESET_STATE' })
    }
  }, [dispatch])

  const loadDemoData = useCallback(() => {
    setStyleResult(demoStyleResult)
    setUserSession({
      budgetTotal: 200000,
      budgetBreakdown: demoBudgetBreakdown,
      city: demoCity,
      area: demoArea,
      specialNeeds: ['老人房', '儿童房', '衣帽间'],
      floorPlan: { rooms: 3, area: 100 },
    })
    dispatch({
      type: 'UPDATE_NIAN',
      payload: demoNianProgress,
    })
    dispatch({
      type: 'SET_DEMO_MODE',
      payload: { isActive: true, currentChapter: 1, progress: 0 },
    })
  }, [setStyleResult, setUserSession, dispatch])

  const executeAction = useCallback((action: DemoAction, chapterIndex: number, actionIndex: number) => {
    const timerId = `ch${chapterIndex}-act${actionIndex}`

    switch (action.type) {
      case 'navigate':
        setView(action.payload)
        break

      case 'speak': {
        setDemoState((prev) => ({
          ...prev,
          speakMessage: action.payload,
          speakVisible: true,
        }))
        const speakTimer = setTimeout(() => {
          setDemoState((prev) => ({ ...prev, speakVisible: false }))
        }, 3500)
        actionTimersRef.current.set(`${timerId}-speak`, speakTimer)
        break
      }

      case 'highlight':
        setDemoState((prev) => ({
          ...prev,
          spotlightVisible: true,
          spotlightSelector: action.payload.selector || '',
          spotlightPosition: action.payload.position || 'top',
          spotlightMessage: action.payload.message || '',
        }))
        break

      case 'wait':
        break

      case 'click':
      case 'type':
      case 'custom':
        break
    }
  }, [setView])

  const playChapterRef = useRef<(index: number) => void>()

  const playChapter = useCallback((chapterIndex: number) => {
    const chapter = demoChapters[chapterIndex]
    if (!chapter) return

    currentChapterIndexRef.current = chapterIndex
    clearAllTimers()

    trackEvent('demo_chapter_start', {
      chapter_index: chapterIndex + 1,
      chapter_title: chapter.title,
      target_view: chapter.targetView,
    })

    let cumulativeDelay = 0
    let actionsCompleted = 0
    const totalActions = chapter.actions.length

    chapter.actions.forEach((action, actionIndex) => {
      const delay = action.delay || 1000
      cumulativeDelay += delay

      const timer = setTimeout(() => {
        executeAction(action, chapterIndex, actionIndex)
        actionsCompleted++

        const chapterProg = (actionsCompleted / totalActions) * 100
        const totalProgressBefore = demoChapters.slice(0, chapterIndex).reduce((sum, ch) => sum + ch.duration, 0)
        const totalDuration = demoChapters.reduce((sum, ch) => sum + ch.duration, 0)
        const currentChapterProgress = (chapterProg / 100) * chapter.duration
        const overallProgress = ((totalProgressBefore + currentChapterProgress) / totalDuration) * 100

        setDemoState((prev) => ({
          ...prev,
          currentActionIndex: actionIndex,
          chapterProgress: chapterProg,
          progress: overallProgress,
        }))

        setDemoMode({
          currentChapter: chapterIndex + 1,
          progress: overallProgress,
        })
      }, cumulativeDelay)

      timeoutsRef.current.push(timer)
    })

    const chapterEndTimer = setTimeout(() => {
      trackEvent('demo_chapter_complete', {
        chapter_index: chapterIndex + 1,
        chapter_title: chapter.title,
      })

      if (chapterIndex < demoChapters.length - 1) {
        setDemoState((prev) => ({
          ...prev,
          spotlightVisible: false,
          speakVisible: false,
        }))
        playChapterRef.current?.(chapterIndex + 1)
      } else {
        isPlayingRef.current = false
        const totalDuration = Date.now() - demoStartTimeRef.current - totalPausedDurationRef.current
        trackEvent('demo_complete', {
          total_chapters: demoChapters.length,
          total_duration_ms: totalDuration,
          total_duration_seconds: Math.round(totalDuration / 1000),
        })
        setDemoState((prev) => ({
          ...prev,
          isPlaying: false,
          isCompleted: true,
          spotlightVisible: false,
          speakVisible: false,
        }))
      }
    }, cumulativeDelay + 1000)

    timeoutsRef.current.push(chapterEndTimer)
  }, [clearAllTimers, executeAction, setDemoMode])

  useEffect(() => {
    playChapterRef.current = playChapter
  }, [playChapter])

  const startDemo = useCallback(() => {
    saveOriginalState()
    loadDemoData()
    isPlayingRef.current = true
    currentChapterIndexRef.current = 0
    demoStartTimeRef.current = Date.now()
    totalPausedDurationRef.current = 0

    trackEvent('demo_start', {
      total_chapters: demoChapters.length,
    })

    setDemoState({
      isPlaying: true,
      isActive: true,
      currentChapterIndex: 0,
      currentActionIndex: 0,
      progress: 0,
      chapterProgress: 0,
      isPaused: false,
      isCompleted: false,
      showConfirm: false,
      spotlightVisible: false,
      spotlightSelector: '',
      spotlightPosition: 'top',
      spotlightMessage: '',
      speakMessage: '',
      speakVisible: false,
    })

    setTimeout(() => {
      playChapter(0)
    }, 500)
  }, [saveOriginalState, loadDemoData, playChapter])

  const pauseDemo = useCallback(() => {
    clearAllTimers()
    isPlayingRef.current = false
    pausedTimeRef.current = Date.now()
    trackEvent('demo_pause', {
      current_chapter: currentChapterIndexRef.current + 1,
      progress: demoState.progress,
    })
    setDemoState((prev) => ({ ...prev, isPaused: true, isPlaying: false }))
  }, [clearAllTimers, demoState.progress])

  const resumeDemo = useCallback(() => {
    isPlayingRef.current = true
    if (pausedTimeRef.current > 0) {
      totalPausedDurationRef.current += Date.now() - pausedTimeRef.current
      pausedTimeRef.current = 0
    }
    trackEvent('demo_resume', {
      current_chapter: currentChapterIndexRef.current + 1,
      progress: demoState.progress,
    })
    setDemoState((prev) => ({ ...prev, isPaused: false, isPlaying: true }))
    playChapter(currentChapterIndexRef.current)
  }, [playChapter, demoState.progress])

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      pauseDemo()
    } else {
      resumeDemo()
    }
  }, [pauseDemo, resumeDemo])

  const nextChapter = useCallback(() => {
    if (currentChapterIndexRef.current < demoChapters.length - 1) {
      clearAllTimers()
      const nextIdx = currentChapterIndexRef.current + 1
      trackEvent('demo_skip_chapter', {
        from_chapter: currentChapterIndexRef.current + 1,
        to_chapter: nextIdx + 1,
        direction: 'next',
      })
      currentChapterIndexRef.current = nextIdx
      setDemoState((prev) => ({
        ...prev,
        currentChapterIndex: nextIdx,
        currentActionIndex: 0,
        chapterProgress: 0,
        spotlightVisible: false,
        speakVisible: false,
      }))
      playChapter(nextIdx)
    }
  }, [clearAllTimers, playChapter])

  const prevChapter = useCallback(() => {
    if (currentChapterIndexRef.current > 0) {
      clearAllTimers()
      const prevIdx = currentChapterIndexRef.current - 1
      trackEvent('demo_skip_chapter', {
        from_chapter: currentChapterIndexRef.current + 1,
        to_chapter: prevIdx + 1,
        direction: 'prev',
      })
      currentChapterIndexRef.current = prevIdx
      setDemoState((prev) => ({
        ...prev,
        currentChapterIndex: prevIdx,
        currentActionIndex: 0,
        chapterProgress: 0,
        spotlightVisible: false,
        speakVisible: false,
      }))
      playChapter(prevIdx)
    }
  }, [clearAllTimers, playChapter])

  const goToChapter = useCallback((index: number) => {
    if (index >= 0 && index < demoChapters.length) {
      clearAllTimers()
      trackEvent('demo_skip_chapter', {
        from_chapter: currentChapterIndexRef.current + 1,
        to_chapter: index + 1,
        direction: 'jump',
      })
      currentChapterIndexRef.current = index
      setDemoState((prev) => ({
        ...prev,
        currentChapterIndex: index,
        currentActionIndex: 0,
        chapterProgress: 0,
        spotlightVisible: false,
        speakVisible: false,
      }))
      playChapter(index)
    }
  }, [clearAllTimers, playChapter])

  const exitDemo = useCallback(() => {
    clearAllTimers()
    isPlayingRef.current = false

    const totalDuration = demoStartTimeRef.current > 0
      ? Date.now() - demoStartTimeRef.current - totalPausedDurationRef.current
      : 0

    trackEvent('demo_exit', {
      current_chapter: currentChapterIndexRef.current + 1,
      total_chapters: demoChapters.length,
      progress: demoState.progress,
      total_duration_ms: totalDuration,
      completed: demoState.isCompleted,
    })

    currentChapterIndexRef.current = 0
    restoreOriginalState()
    setDemoState({
      isPlaying: false,
      isActive: false,
      currentChapterIndex: 0,
      currentActionIndex: 0,
      progress: 0,
      chapterProgress: 0,
      isPaused: false,
      isCompleted: false,
      showConfirm: false,
      spotlightVisible: false,
      spotlightSelector: '',
      spotlightPosition: 'top',
      spotlightMessage: '',
      speakMessage: '',
      speakVisible: false,
    })
    setDemoMode({ isActive: false, currentChapter: 0, progress: 0 })
  }, [clearAllTimers, restoreOriginalState, setDemoMode, demoState.progress, demoState.isCompleted])

  const showConfirmDialog = useCallback(() => {
    setDemoState((prev) => ({ ...prev, showConfirm: true }))
  }, [])

  const hideConfirmDialog = useCallback(() => {
    setDemoState((prev) => ({ ...prev, showConfirm: false }))
  }, [])

  const restartDemo = useCallback(() => {
    clearAllTimers()
    startDemo()
  }, [clearAllTimers, startDemo])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!demoState.isActive) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextChapter()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevChapter()
          break
        case 'Escape':
          e.preventDefault()
          exitDemo()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [demoState.isActive, togglePlay, nextChapter, prevChapter, exitDemo])

  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [clearAllTimers])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalDuration = demoChapters.reduce((sum, ch) => sum + ch.duration, 0)
  const elapsedDuration = demoChapters.slice(0, demoState.currentChapterIndex).reduce((sum, ch) => sum + ch.duration, 0) +
    (currentChapter ? (demoState.chapterProgress / 100) * currentChapter.duration : 0)

  return {
    demoState,
    currentChapter,
    totalChapters: demoChapters.length,
    totalDuration,
    elapsedDuration,
    formattedTime: {
      current: formatTime(elapsedDuration),
      total: formatTime(totalDuration),
    },
    chapters: demoChapters,
    startDemo,
    pauseDemo,
    resumeDemo,
    togglePlay,
    nextChapter,
    prevChapter,
    goToChapter,
    exitDemo,
    showConfirmDialog,
    hideConfirmDialog,
    restartDemo,
  }
}

export default useDemoMode
