import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import { useAppState } from '../hooks/useAppState'
import { sopSteps, sopStages } from '../data/sop-steps'
import StepTimeline, { TimelineStep } from '../components/StepTimeline'
import Card from '../components/Card'
import Button from '../components/Button'
import NianAvatar from '../components/NianAvatar'
import FloorPlanAI from '../components/ai/FloorPlanAI'
import ContractAI from '../components/ai/ContractAI'
import QualityAI from '../components/ai/QualityAI'
import AnimatedNumber from '../components/AnimatedNumber'
import { coinParticles, heartParticles, prefersReducedMotion } from '../utils/animations'
import { usePageView, useDurationTracking } from '../hooks/useTracking'
import { trackEvent } from '../utils/tracking'
import type { SOPStep, EmotionType } from '../types'

interface ProcurementReminder {
  stageId: number
  title: string
  items: string[]
}

const procurementReminders: ProcurementReminder[] = [
  {
    stageId: 2,
    title: '水电改造前 · 主材采购提醒',
    items: [
      '需确认橱柜方案（初测完成）',
      'PPR水管品牌型号确认',
      '地漏型号和数量确认',
      '开关面板数量和款式预估',
    ],
  },
  {
    stageId: 3,
    title: '泥工进场前 · 主材采购提醒',
    items: [
      '墙地砖需到场（客厅/厨房/卫生间/阳台）',
      '门槛石/窗台石需定制下单',
      '确认美缝方案和颜色',
      '瓷砖背胶、十字卡等辅材确认',
    ],
  },
  {
    stageId: 4,
    title: '木工进场前 · 主材采购提醒',
    items: [
      '木门商家需复测门洞尺寸',
      '全屋定制最终方案确认下单',
      '吊顶材料（龙骨/石膏板）确认',
      '定制衣柜板材和五金确认',
    ],
  },
  {
    stageId: 5,
    title: '油工进场前 · 主材采购提醒',
    items: [
      '涂料/壁纸需选购确认',
      '确认色号（建议先刷样板）',
      '腻子、砂纸等辅材确认',
      '墙纸基膜和胶选择',
    ],
  },
  {
    stageId: 6,
    title: '安装季 · 主材采购提醒',
    items: [
      '按顺序预约：厨卫吊顶 → 橱柜 → 木门 → 地板',
      '开关灯具需到场',
      '洁具卫浴需到场',
      '五金挂件提前准备',
    ],
  },
]

const chineseStyleTips: Record<number, string> = {
  14: '【现代中式施工提示】无主灯设计：吊顶阶段需预埋灯槽和变压器位置，格栅安装节点需木工阶段同步安装，收口处理要提前规划。',
  15: '【现代中式施工提示】微水泥工艺：基层平整度要求高，养护周期需7天以上，建议安排专人负责养护。',
  17: '【现代中式施工提示】胡桃木材质选择：地板、家具、柜体建议统一色系，注意控制色差，安装前先排版确认。',
}

type StepViewState = 'intro' | 'guide' | 'completing'

const QUALITY_STEP_IDS = [10, 12, 13, 15]

const SOPView: React.FC = () => {
  const { state, completeStep, updateSOPStep, updateNian } = useAppState()
  // 防御性代码：确保 selectedStepId 始终是有效的步骤 ID
  const initialStepId = state.sopProgress.currentStep > 0 && state.sopProgress.currentStep <= 20
    ? state.sopProgress.currentStep
    : 1
  const [selectedStepId, setSelectedStepId] = useState<number>(initialStepId)
  const [viewState, setViewState] = useState<StepViewState>('intro')
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({})
  const [showProcurement, setShowProcurement] = useState(false)
  const [showFloorPlanAI, setShowFloorPlanAI] = useState(false)
  const [showContractAI, setShowContractAI] = useState(false)
  const [showQualityAI, setShowQualityAI] = useState(false)
  const [qualityStepId, setQualityStepId] = useState(10)
  const [contractAck, setContractAck] = useState(false)
  const [triggeredSteps, setTriggeredSteps] = useState<Set<number>>(new Set())

  usePageView('sop')
  const stepDuration = useDurationTracking('sop_step')
  const prevStepRef = useRef<number | null>(null)
  const prevStageRef = useRef<number | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const nianBottomRef = useRef<HTMLDivElement>(null)
  const nianIntroRef = useRef<HTMLDivElement>(null)
  const inkDropRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const completeAnimationRef = useRef<gsap.core.Timeline | null>(null)
  const initialAnimationRef = useRef<gsap.core.Timeline | null>(null)

  const currentStep = useMemo(() => sopSteps.find((s) => s.id === selectedStepId) as SOPStep, [selectedStepId])
  const currentStageId = currentStep?.stageId || 1

  const isStepCompleted = useCallback((stepId: number) => state.sopProgress.completedSteps.includes(stepId), [state.sopProgress.completedSteps])
  const isStepCurrent = useCallback((stepId: number) => stepId === state.sopProgress.currentStep, [state.sopProgress.currentStep])
  const isStepLocked = useCallback((stepId: number) => {
    const step = sopSteps.find((s) => s.id === stepId)
    if (!step) return true
    return !state.sopProgress.stageUnlockStatus[step.stageId] || stepId > state.sopProgress.currentStep + 1
  }, [state.sopProgress.stageUnlockStatus, state.sopProgress.currentStep])

  const getStepStatus = useCallback((stepId: number): 'completed' | 'current' | 'locked' => {
    if (isStepCompleted(stepId)) return 'completed'
    if (isStepCurrent(stepId)) return 'current'
    return 'locked'
  }, [isStepCompleted, isStepCurrent])

  const timelineSteps: TimelineStep[] = useMemo(() => sopSteps.map((step) => ({
    id: step.id,
    title: step.title,
    stage: step.stageName,
    status: getStepStatus(step.id),
  })), [getStepStatus])

  const handleStepClick = (stepId: string | number) => {
    const id = Number(stepId)
    if (isStepLocked(id)) return

    if (prevStepRef.current !== null && prevStepRef.current !== id) {
      stepDuration.end({ step_id: prevStepRef.current, action: 'switch' })
    }

    setSelectedStepId(id)
    setViewState(isStepCompleted(id) ? 'guide' : 'intro')
    setChecklistState({})

    const step = sopSteps.find((s) => s.id === id)
    trackEvent('step_enter', {
      step_id: id,
      step_title: step?.title,
      stage_id: step?.stageId,
      stage_name: step?.stageName,
      is_completed: isStepCompleted(id),
    })

    if (step && prevStageRef.current !== step.stageId) {
      if (prevStageRef.current !== null) {
        trackEvent('stage_end', { stage_id: prevStageRef.current })
      }
      trackEvent('stage_start', { stage_id: step.stageId, stage_name: step.stageName })
      prevStageRef.current = step.stageId
    }

    prevStepRef.current = id
    stepDuration.start()
  }

  const handleGotIt = () => {
    setViewState('guide')
    if (currentStep && !triggeredSteps.has(currentStep.id)) {
      setTriggeredSteps((prev) => new Set(prev).add(currentStep.id))
      if (currentStep.id === 1) {
        setShowFloorPlanAI(true)
        trackEvent('ai_shown', {
          ai_type: 'floor_plan',
          step_id: currentStep.id,
          step_title: currentStep.title,
        })
        trackEvent('ai_triggered', {
          ai_type: 'floor_plan',
          step_id: currentStep.id,
          trigger: 'auto',
        })
      } else if (currentStep.id === 3) {
        setShowContractAI(true)
        trackEvent('ai_shown', {
          ai_type: 'contract',
          step_id: currentStep.id,
          step_title: currentStep.title,
        })
        trackEvent('ai_triggered', {
          ai_type: 'contract',
          step_id: currentStep.id,
          trigger: 'auto',
        })
      } else if (QUALITY_STEP_IDS.includes(currentStep.id)) {
        setQualityStepId(currentStep.id)
        setShowQualityAI(true)
        trackEvent('ai_shown', {
          ai_type: 'quality',
          step_id: currentStep.id,
          step_title: currentStep.title,
        })
        trackEvent('ai_triggered', {
          ai_type: 'quality',
          step_id: currentStep.id,
          trigger: 'auto',
        })
      }
    }
  }

  const toggleChecklistItem = (index: number) => {
    setChecklistState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleFloorPlanConfirm = () => {
    setShowFloorPlanAI(false)
    trackEvent('ai_confirmed', {
      ai_type: 'floor_plan',
      step_id: currentStep?.id,
    })
  }

  const handleContractAck = () => {
    setContractAck(true)
    setShowContractAI(false)
    trackEvent('ai_confirmed', {
      ai_type: 'contract',
      step_id: currentStep?.id,
    })
  }

  const handleQualityConfirm = () => {
    setShowQualityAI(false)
    trackEvent('ai_confirmed', {
      ai_type: 'quality',
      step_id: qualityStepId,
    })
  }

  const handleComplete = () => {
    if (!currentStep || isStepCompleted(currentStep.id) || viewState === 'completing') return
    if (currentStep.id === 3 && !contractAck) {
      setShowContractAI(true)
      return
    }

    const duration = stepDuration.end({ step_id: currentStep.id, action: 'complete' })
    trackEvent('step_complete', {
      step_id: currentStep.id,
      step_title: currentStep.title,
      stage_id: currentStep.stageId,
      stage_name: currentStep.stageName,
      duration_ms: duration,
    })

    const stepStageId = currentStep.stageId
    const stepId = currentStep.id
    const completedCountBefore = state.sopProgress.completedSteps.length
    const stepsInStage = sopSteps.filter((s) => s.stageId === stepStageId)
    const completedInStageBefore = stepsInStage.filter((s) =>
      state.sopProgress.completedSteps.includes(s.id)
    ).length

    setViewState('completing')
    updateNian({ emotion: 'excited' })

    if (completeAnimationRef.current) {
      completeAnimationRef.current.kill()
    }

    const tl = gsap.timeline()

    if (inkDropRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const buttonRect = (document.activeElement as HTMLElement)?.getBoundingClientRect()
      const centerX = buttonRect ? buttonRect.left - rect.left + buttonRect.width / 2 : rect.width / 2
      const centerY = buttonRect ? buttonRect.top - rect.top + buttonRect.height / 2 : rect.height / 2

      gsap.set(inkDropRef.current, {
        left: centerX,
        top: centerY,
        width: 0,
        height: 0,
        opacity: 0.8,
      })

      tl.to(inkDropRef.current, {
        width: Math.max(rect.width, rect.height) * 2,
        height: Math.max(rect.width, rect.height) * 2,
        duration: 0.8,
        ease: 'power2.out',
        xPercent: -50,
        yPercent: -50,
      }, 0)

      if (!prefersReducedMotion() && cardRef.current) {
        for (let i = 0; i < 3; i++) {
          const ripple = document.createElement('div')
          ripple.style.position = 'absolute'
          ripple.style.left = `${centerX}px`
          ripple.style.top = `${centerY}px`
          ripple.style.width = '0'
          ripple.style.height = '0'
          ripple.style.borderRadius = '50%'
          ripple.style.border = '2px solid rgba(91, 140, 90, 0.5)'
          ripple.style.pointerEvents = 'none'
          ripple.style.transform = 'translate(-50%, -50%)'
          ripple.style.zIndex = '11'
          inkDropRef.current.parentNode?.appendChild(ripple)

          gsap.to(ripple, {
            width: Math.max(rect.width, rect.height) * 1.5,
            height: Math.max(rect.width, rect.height) * 1.5,
            opacity: 0,
            duration: 1,
            delay: 0.15 * i,
            ease: 'power2.out',
            onComplete: () => {
              ripple.remove()
            },
          })
        }
      }
    }

    if (nianBottomRef.current) {
      const nianEl = nianBottomRef.current

      tl.to(nianEl, {
        y: -30,
        scale: 1.15,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.2)
      tl.to(nianEl, {
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: 'bounce.out',
      })
      tl.to(nianEl, {
        y: -15,
        scale: 1.08,
        duration: 0.2,
        ease: 'power2.out',
      })
      tl.to(nianEl, {
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'bounce.out',
      })

      if (!prefersReducedMotion()) {
        tl.call(() => {
          heartParticles(nianEl, { count: 10, color: '#C84A3E' })
        }, 0.3)
      }
    }

    if (cardRef.current && !prefersReducedMotion()) {
      tl.call(() => {
        coinParticles(cardRef.current, { count: 4 })
      }, 0.4)
    }

    tl.call(() => {
      completeStep(currentStep.id)
    })

    tl.to({}, { duration: 1 })

    tl.call(() => {
      const nextStepId = Math.min(currentStep.id + 1, 20)
      if (nextStepId <= 20 && !isStepLocked(nextStepId)) {
        setSelectedStepId(nextStepId)
        updateSOPStep(nextStepId)
        setViewState('intro')
        setChecklistState({})
      }
      updateNian({ emotion: 'happy' })

      const nextStep = sopSteps.find((s) => s.id === nextStepId)
      if (nextStep && nextStep.stageId !== currentStep.stageId) {
        setShowProcurement(true)
        trackEvent('stage_complete', {
          stage_id: currentStep.stageId,
          stage_name: currentStep.stageName,
          completed_steps: stepsInStage.length,
        })
      }

      if (prevStepRef.current !== nextStepId) {
        prevStepRef.current = nextStepId
        stepDuration.start()
      }
    })

    completeAnimationRef.current = tl
  }

  const getProcurementReminder = () => {
    return procurementReminders.find((r) => r.stageId === currentStageId)
  }

  const getChineseStyleTip = () => {
    return chineseStyleTips[currentStep?.id || 0]
  }

  const getNianEmotion = (): EmotionType => {
    if (viewState === 'completing') return 'happy'
    if (isStepCompleted(selectedStepId)) return 'happy'
    return 'happy'
  }

  useEffect(() => {
    if (currentStep) {
      setViewState(isStepCompleted(currentStep.id) ? 'guide' : 'intro')
      setChecklistState({})
      if (currentStep.id === 3) {
        setContractAck(isStepCompleted(3))
      }
      if (currentStep.id === 1 && !isStepCompleted(1) && !triggeredSteps.has(1)) {
        setTriggeredSteps((prev) => new Set(prev).add(1))
        setShowFloorPlanAI(true)
      }
    }
  }, [selectedStepId])

  useEffect(() => {
    if (showProcurement) {
      const timer = setTimeout(() => setShowProcurement(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showProcurement])

  useEffect(() => {
    if (hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    if (prefersReducedMotion()) return

    if (initialAnimationRef.current) {
      initialAnimationRef.current.kill()
    }

    const tl = gsap.timeline()

    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    }

    if (sidebarRef.current && window.innerWidth >= 768) {
      const steps = sidebarRef.current.querySelectorAll('[class*="relative flex items-start"]')
      if (steps.length > 0) {
        tl.fromTo(steps,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: 'power2.out' },
          '-=0.3'
        )
      }
    }

    if (cardRef.current) {
      tl.fromTo(cardRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      )
    }

    if (nianBottomRef.current) {
      tl.fromTo(nianBottomRef.current,
        { y: 30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
        '-=0.3'
      )
    }

    initialAnimationRef.current = tl

    return () => {
      if (initialAnimationRef.current) {
        initialAnimationRef.current.kill()
        initialAnimationRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (currentStep && prevStepRef.current === null) {
      trackEvent('step_enter', {
        step_id: currentStep.id,
        step_title: currentStep.title,
        stage_id: currentStep.stageId,
        stage_name: currentStep.stageName,
        is_completed: isStepCompleted(currentStep.id),
      })
      trackEvent('stage_start', {
        stage_id: currentStep.stageId,
        stage_name: currentStep.stageName,
      })
      prevStepRef.current = currentStep.id
      prevStageRef.current = currentStep.stageId
      stepDuration.start()
    }
  }, [currentStep, stepDuration])

  const completedCount = state.sopProgress.completedSteps.length
  const progressPercent = (completedCount / sopSteps.length) * 100

  return (
    <div className="min-h-screen bg-miBai font-zh">
      <div className="max-w-7xl mx-auto px-sm md:px-lg py-sm md:py-lg">
        <header ref={headerRef} className="mb-md md:mb-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-moHei mb-xs">
                🐲 装修SOP流程
              </h1>
              <p className="text-xs md:text-sm text-fuZhu">
                20步标准化装修流程，跟着年兽轻松装新家
              </p>
            </div>
            <div className="flex items-center gap-sm md:gap-md">
              <div className="text-right">
                <div className="text-xs text-fuZhu">整体进度</div>
                <div className="text-base md:text-lg font-semibold text-daiLan">
                  {completedCount}/{sopSteps.length} 步
                </div>
              </div>
              <div className="w-20 md:w-32 h-2 bg-miBai rounded-full overflow-hidden">
                <div
                  className="h-full bg-zhuQing rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="md:hidden mb-sm">
          <div className="bg-nuanBai rounded-md shadow-card">
            <StepTimeline
              steps={timelineSteps}
              currentStep={state.sopProgress.currentStep}
              onStepClick={handleStepClick}
              horizontal
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-md md:gap-lg overflow-hidden">
          <aside ref={sidebarRef} className="hidden md:block w-[200px] lg:w-[280px] flex-shrink-0 overflow-hidden">
            <div className="bg-nuanBai rounded-md shadow-card sticky top-lg max-h-[calc(100vh-120px)] overflow-y-auto overflow-hidden">
              <div className="p-md border-b border-miBai">
                <h2 className="text-base font-semibold text-moHei">装修流程</h2>
                <p className="text-xs text-fuZhu mt-xs">6大阶段 · 20个关键节点</p>
              </div>
              <StepTimeline
                steps={timelineSteps}
                currentStep={state.sopProgress.currentStep}
                onStepClick={handleStepClick}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0 overflow-hidden">
            <div ref={cardRef} className="relative bg-nuanBai rounded-md shadow-card overflow-hidden">
              {viewState === 'completing' && (
                <div
                  ref={inkDropRef}
                  className="absolute rounded-full bg-zhuQing pointer-events-none z-10"
                  style={{ borderRadius: '50%' }}
                />
              )}

              {currentStep && (
                <>
                  <div className="p-md md:p-lg border-b border-miBai overflow-hidden">
                    <div className="flex items-start justify-between overflow-hidden">
                      <div>
                        <div className="flex items-center gap-sm mb-xs">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-daiLan text-white text-sm font-semibold">
                            {currentStep.id}
                          </span>
                          <h2 className="text-lg font-bold text-moHei">
                            {currentStep.title}
                          </h2>
                        </div>
                        <span className="inline-block px-sm py-0.5 bg-tanHei/10 text-tanHei text-xs rounded-sm">
                          {currentStep.stageName}
                        </span>
                        {currentStep.aiTrigger && (
                          <span className="inline-block ml-sm px-sm py-0.5 bg-daiLan/10 text-daiLan text-xs rounded-sm">
                            ✨ AI自动触发
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-fuZhu">第 {currentStep.id} / 20 步</div>
                        <div className="text-xs text-fuZhu mt-xs">
                          阶段 {currentStep.stageId} / {sopStages.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-md md:p-lg overflow-hidden">
                    {viewState === 'intro' && !isStepCompleted(currentStep.id) && (
                      <div className="flex items-start gap-md overflow-hidden">
                        <div ref={nianIntroRef}>
                          <NianAvatar emotion={getNianEmotion()} size="lg" animation="breathe" />
                        </div>
                        <div className="flex-1">
                          <div className="relative bg-white rounded-md p-md shadow-card">
                            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
                            <p className="text-base text-moHei leading-relaxed">
                              接下来我们要做「<span className="text-daiLan font-medium">{currentStep.title}</span>」，
                              这是{currentStep.stageName}的重要环节哦！
                            </p>
                            <p className="text-sm text-fuZhu mt-sm">
                              {currentStep.description}
                            </p>
                          </div>
                          <div className="mt-md flex justify-end">
                            <Button size="md" onClick={handleGotIt}>
                              知道了，开始吧 →
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {(viewState === 'guide' || viewState === 'completing' || isStepCompleted(currentStep.id)) && (
                      <div className="space-y-md overflow-hidden">
                        <Card variant="info" title="📋 做什么">
                          <p className="text-base text-moHei leading-relaxed">
                            {currentStep.description}
                          </p>
                        </Card>

                        <Card variant="info" title="📝 怎么做">
                          <p className="text-base text-moHei leading-relaxed">
                            {currentStep.guideText}
                          </p>
                        </Card>

                        <Card variant="info" title="✅ 验收标准">
                          <div className="space-y-sm">
                            {currentStep.checklist.map((item, index) => (
                              <div
                                key={index}
                                className={`flex items-start gap-sm p-sm rounded-sm cursor-pointer transition-colors ${
                                  checklistState[index] ? 'bg-zhuQing/5' : 'hover:bg-miBai'
                                } ${isStepCompleted(currentStep.id) ? 'opacity-60' : ''}`}
                                onClick={() => !isStepCompleted(currentStep.id) && toggleChecklistItem(index)}
                              >
                                <div
                                  className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    checklistState[index] || isStepCompleted(currentStep.id)
                                      ? 'bg-zhuQing border-zhuQing'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {(checklistState[index] || isStepCompleted(currentStep.id)) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={`text-base ${
                                    checklistState[index] || isStepCompleted(currentStep.id)
                                      ? 'text-fuZhu line-through'
                                      : 'text-moHei'
                                  }`}
                                >
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Card>

                        {getChineseStyleTip() && (
                          <Card variant="warning" title="🏮 现代中式施工提示">
                            <p className="text-base text-moHei leading-relaxed">
                              {getChineseStyleTip()}
                            </p>
                          </Card>
                        )}

                        {showProcurement && getProcurementReminder() && (
                          <Card variant="warning" title={getProcurementReminder()!.title}>
                            <ul className="space-y-xs">
                              {getProcurementReminder()!.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-sm text-base text-moHei">
                                  <span className="text-zhuSha">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-md md:p-lg border-t border-miBai bg-miBai/50 overflow-hidden">
                    <div className="flex items-center justify-between overflow-hidden">
                      <div className="flex items-center gap-sm">
                        <NianAvatar emotion={getNianEmotion()} size="sm" animation="breathe" />
                        <div className="text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          <span className="text-fuZhu">灵气值：</span>
                          <AnimatedNumber
                            value={state.nianProgress.spiritPoints}
                            className="text-daiLan font-medium"
                            duration={1}
                            useThousandSeparator
                          />
                          <span className="text-fuZhu ml-sm">房屋评分：</span>
                          <AnimatedNumber
                            value={state.nianProgress.houseScore}
                            className="text-zhuQing font-medium"
                            duration={1}
                          />
                        </div>
                      </div>

                      <div className="flex gap-sm">
                        {isStepCompleted(currentStep.id) ? (
                          <div className="flex items-center gap-xs text-zhuQing">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">已完成</span>
                          </div>
                        ) : isStepLocked(currentStep.id) ? (
                          <Button variant="secondary" size="md" disabled>
                            <svg className="w-4 h-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            已锁定
                          </Button>
                        ) : (
                          <Button
                            size="md"
                            onClick={handleComplete}
                            disabled={viewState === 'completing'}
                          >
                            {viewState === 'completing' ? '完成中...' : '✓ 已完成'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>

        <div ref={nianBottomRef} className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-20">
          <div className="relative">
            <NianAvatar emotion={getNianEmotion()} size="md" pulse={viewState === 'completing'} className="w-12 h-12 md:w-16 md:h-16" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-zhuQing text-white text-xs rounded-full flex items-center justify-center font-medium">
              +10
            </div>
          </div>
        </div>

        <FloorPlanAI
          isOpen={showFloorPlanAI}
          onClose={() => setShowFloorPlanAI(false)}
          onConfirm={handleFloorPlanConfirm}
        />

        <ContractAI
          isOpen={showContractAI}
          onClose={() => setShowContractAI(false)}
          onConfirm={handleContractAck}
        />

        <QualityAI
          isOpen={showQualityAI}
          stepId={qualityStepId}
          onClose={() => setShowQualityAI(false)}
          onConfirm={handleQualityConfirm}
        />
      </div>
    </div>
  )
}

export default SOPView
