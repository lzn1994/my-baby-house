import { useRef, useEffect, useState, memo, useCallback } from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import { useAppState } from './hooks/useAppState'
import OnboardingView from './views/OnboardingView'
import SOPView from './views/SOPView'
import BudgetView from './views/BudgetView'
import NianView from './views/NianView'
import BottomNav from './components/BottomNav'
import SideNav from './components/SideNav'
import DemoFloatingButton from './components/DemoFloatingButton'
import DemoControlBar from './components/DemoControlBar'
import Spotlight from './components/Spotlight'
import DemoCompleteModal from './components/DemoCompleteModal'
import ResetConfirmModal from './components/ResetConfirmModal'
import TrackingDebugPanel from './components/TrackingDebugPanel'
import useDemoMode from './hooks/useDemoMode'
import gsap from 'gsap'
import './styles/index.css'
import type { AppView } from './types'

const ViewRenderer = memo(({ view }: { view: AppView }) => {
  switch (view) {
    case 'onboarding':
      return <OnboardingView />
    case 'budget':
      return <BudgetView />
    case 'nian':
      return <NianView />
    case 'sop':
    case 'demo':
    default:
      return <SOPView />
  }
})

function AppContent() {
  const { state } = useAppContext()
  const { resetState } = useAppState()
  const viewContainerRef = useRef<HTMLDivElement>(null)
  const [displayView, setDisplayView] = useState<AppView | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const isAnimating = useRef(false)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const enterAnimationRef = useRef<gsap.core.Tween | null>(null)
  const initialRenderRef = useRef(true)

  // 初始化 displayView
  useEffect(() => {
    if (displayView === null && state.currentView) {
      setDisplayView(state.currentView)
    }
  }, [state.currentView, displayView])

  useEffect(() => {
    // 首次渲染跳过动画
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    if (state.currentView === displayView) return
    if (isAnimating.current) return
    if (displayView === null) return

    const container = viewContainerRef.current
    if (!container) return

    const currentChild = container.firstElementChild as HTMLElement
    if (!currentChild) {
      setDisplayView(state.currentView)
      return
    }

    isAnimating.current = true

    if (animationRef.current) {
      animationRef.current.kill()
    }

    animationRef.current = gsap.to(currentChild, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setDisplayView(state.currentView)
        animationRef.current = null
      },
    })

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
        animationRef.current = null
      }
    }
  }, [state.currentView, displayView])

  useEffect(() => {
    // 首次渲染跳过动画
    if (initialRenderRef.current) return

    const container = viewContainerRef.current
    if (!container) return

    const currentChild = container.firstElementChild as HTMLElement
    if (!currentChild) {
      isAnimating.current = false
      return
    }

    if (enterAnimationRef.current) {
      enterAnimationRef.current.kill()
    }

    enterAnimationRef.current = gsap.fromTo(currentChild,
      { x: 30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          isAnimating.current = false
          enterAnimationRef.current = null
        },
      }
    )

    return () => {
      if (enterAnimationRef.current) {
        enterAnimationRef.current.kill()
        enterAnimationRef.current = null
      }
    }
  }, [displayView])

  return (
    <div className="min-h-screen bg-nuanBai">
      <BottomNav position="top" className="hidden md:block" onSettingsClick={() => setShowResetModal(true)} />
      <BottomNav position="bottom" className="md:hidden" />
      <SideNav />

      <main
        className="
          pt-0 md:pt-16 xl:pl-60
          pb-16 md:pb-0
          min-h-screen
          transition-all duration-300
        "
      >
        <div
          ref={viewContainerRef}
          className="relative w-full min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-64px)]"
        >
          {displayView && <ViewRenderer view={displayView} />}
        </div>
      </main>

      <ResetConfirmModal
        visible={showResetModal}
        onConfirm={() => {
          resetState()
          setShowResetModal(false)
          window.location.reload()
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}

function DemoWrapper() {
  const demo = useDemoMode()

  return (
    <>
      <AppContent />

      <DemoFloatingButton
        visible={!demo.demoState.isActive}
        onClick={demo.startDemo}
      />

      <DemoControlBar
        visible={demo.demoState.isActive}
        isPlaying={demo.demoState.isPlaying}
        isPaused={demo.demoState.isPaused}
        currentChapterIndex={demo.demoState.currentChapterIndex}
        chapterProgress={demo.demoState.chapterProgress}
        totalProgress={demo.demoState.progress}
        chapters={demo.chapters}
        currentTime={demo.formattedTime.current}
        totalTime={demo.formattedTime.total}
        onPlayPause={demo.togglePlay}
        onPrevChapter={demo.prevChapter}
        onNextChapter={demo.nextChapter}
        onExit={demo.exitDemo}
        onChapterClick={demo.goToChapter}
      />

      <Spotlight
        visible={demo.demoState.spotlightVisible}
        targetSelector={demo.demoState.spotlightSelector}
        position={demo.demoState.spotlightPosition}
        message={demo.demoState.spotlightMessage}
      />

      <DemoCompleteModal
        visible={demo.demoState.isCompleted}
        onRestart={demo.restartDemo}
        onExit={demo.exitDemo}
      />

      <TrackingDebugPanel />
    </>
  )
}

function App() {
  return (
    <AppProvider>
      <DemoWrapper />
    </AppProvider>
  )
}

export default App
