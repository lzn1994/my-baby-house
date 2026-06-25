import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import ChatBubble from '../components/ChatBubble'
import { ImageOption, TextOption, ChipButton, MultiSelectOption } from '../components/QuizOptions'
import Button from '../components/Button'
import NianAvatar from '../components/NianAvatar'
import { prefersReducedMotion } from '../utils/animations'
import { styleQuizQuestions, styleResults, defaultStyleResult } from '../data/style-quiz'
import { useDialogFlow } from '../hooks/useDialogFlow'
import { useAppState } from '../hooks/useAppState'
import { usePageView, useDurationTracking, useFunnelTracking } from '../hooks/useTracking'
import { trackEvent } from '../utils/tracking'
import type { StyleResult } from '../types'

type OnboardingPhase =
  | 'welcome'
  | 'quiz'
  | 'result'
  | 'budget'
  | 'city'
  | 'area'
  | 'specialNeeds'
  | 'floorPlan'

const imageOptionsQ1 = [
  { id: 'a', label: '留白墙面+胡桃木家具', emoji: '🎋', bgColor: '#E8DFD0' },
  { id: 'b', label: '温暖原木+布艺沙发', emoji: '🛋️', bgColor: '#F0E6D3' },
  { id: 'c', label: '裸露管线+冷灰调', emoji: '🏭', bgColor: '#D5D8DC' },
  { id: 'd', label: '繁花壁纸+水晶吊灯', emoji: '🌸', bgColor: '#F5DEE8' },
]

const textOptionsQ2 = [
  { id: 'a', label: '米白浅灰原木色' },
  { id: 'b', label: '深蓝墨绿暖棕' },
  { id: 'c', label: '明亮撞色活力橙黄' },
]

const textOptionsQ3 = [
  { id: 'a', label: '阳台泡茶看晨光' },
  { id: 'b', label: '开放式厨房做早午餐' },
  { id: 'c', label: '窝沙发追剧点外卖' },
  { id: 'd', label: '书房看书需要独处' },
]

const textOptionsQ4 = [
  { id: 'a', label: '微水泥的细腻质感' },
  { id: 'b', label: '胡桃木的温暖触感' },
  { id: 'c', label: '金属的冷峻光泽' },
  { id: 'd', label: '大理石的奢华感' },
]

const binaryOptionsQ5 = [
  { id: 'a', label: '现代中式（格栅+微水泥）', emoji: '🎋', bgColor: '#E8DFD0' },
  { id: 'b', label: '北欧简约（白墙+原木）', emoji: '🛋️', bgColor: '#F0E6D3' },
]

const budgetOptions = ['10万以下', '10-20万', '20-30万', '30万以上']

const cityOptions = [
  '北上广深一线城市',
  '杭州成都等新一线',
  '其他二三线城市',
]

const areaQuickOptions = [80, 90, 100, 120, 140, 160]

const specialNeedsOptions = [
  { id: 'kids', label: '儿童房', icon: '🧒' },
  { id: 'elderly', label: '老人房', icon: '👴' },
  { id: 'pets', label: '宠物', icon: '🐱' },
  { id: 'work', label: '居家办公', icon: '💻' },
  { id: 'smart', label: '智能家居', icon: '🏠' },
]

const insightMessages: Record<number, string> = {
  1: '感觉你是个喜欢安静有质感空间的人呢~',
  3: '你的偏好越来越清晰了！',
}

const OnboardingView: React.FC = () => {
  const { setView, setStyleResult, setUserSession } = useAppState()
  const dialogFlow = useDialogFlow(styleQuizQuestions)
  const [phase, setPhase] = useState<OnboardingPhase>('welcome')
  const [showNianFeedback, setShowNianFeedback] = useState(false)
  const [nianFeedbackText, setNianFeedbackText] = useState('')
  const [computedResult, setComputedResult] = useState<StyleResult>(defaultStyleResult)
  const [matchScoreDisplay, setMatchScoreDisplay] = useState(0)

  usePageView('onboarding')
  const quizDuration = useDurationTracking('style_quiz')
  const onboardingFunnel = useFunnelTracking('onboarding_conversion')

  const [selectedBudget, setSelectedBudget] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [areaInput, setAreaInput] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])

  const [floorPlanStage, setFloorPlanStage] = useState<'uploading' | 'scanning' | 'done'>('uploading')
  const [floorPlanResult, setFloorPlanResult] = useState<{ rooms: string; area: number } | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const welcomeRef = useRef<HTMLDivElement>(null)
  const welcomeAnimatedRef = useRef(false)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [phase, dialogFlow.currentIndex, showNianFeedback, selectedBudget, selectedCity, areaInput, selectedNeeds, floorPlanStage])

  useEffect(() => {
    if (phase === 'welcome' && !welcomeAnimatedRef.current && welcomeRef.current) {
      welcomeAnimatedRef.current = true

      if (prefersReducedMotion()) return

      const nianEl = welcomeRef.current.querySelector('.welcome-nian')
      const titleEl = welcomeRef.current.querySelector('.welcome-title')
      const descEl = welcomeRef.current.querySelector('.welcome-desc')
      const btnEl = welcomeRef.current.querySelector('.welcome-btn')

      const tl = gsap.timeline()

      if (nianEl) {
        tl.fromTo(nianEl,
          { y: 40, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }
        )
      }
      if (titleEl) {
        tl.fromTo(titleEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.3'
        )
      }
      if (descEl) {
        tl.fromTo(descEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
      }
      if (btnEl) {
        tl.fromTo(btnEl,
          { y: 20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' },
          '-=0.2'
        )
      }
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'result') {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: computedResult.matchScore,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          setMatchScoreDisplay(Math.round(obj.value))
        },
      })
    }
  }, [phase, computedResult.matchScore])

  const calculateStyleResult = (): StyleResult => {
    const scores: Record<string, number> = {}

    Object.keys(styleResults).forEach((style) => {
      scores[style] = 0
    })

    styleQuizQuestions.forEach((question) => {
      const answerId = dialogFlow.answers[question.id]
      if (answerId) {
        const option = question.options.find((o) => o.id === answerId)
        if (option) {
          Object.entries(option.styleWeights).forEach(([style, weight]) => {
            scores[style] = (scores[style] || 0) + weight
          })
        }
      }
    })

    let maxScore = 0
    let maxStyle = '现代中式'

    Object.entries(scores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score
        maxStyle = style
      }
    })

    return styleResults[maxStyle] || defaultStyleResult
  }

  const handleQuizAnswer = (optionId: string) => {
    if (!dialogFlow.currentQuestion) return
    
    dialogFlow.setAnswer(dialogFlow.currentQuestion.id, optionId)

    trackEvent('quiz_answer', {
      question_id: dialogFlow.currentQuestion.id,
      question_index: dialogFlow.currentIndex + 1,
      option_id: optionId,
    })

    if (dialogFlow.isLast) {
      setTimeout(() => {
        const result = calculateStyleResult()
        setComputedResult(result)
        setStyleResult(result)
        setPhase('result')

        const duration = quizDuration.end()
        trackEvent('style_quiz_complete', {
          style_name: result.styleName,
          match_score: result.matchScore,
          total_questions: dialogFlow.totalSteps,
          duration_ms: duration,
        })
        onboardingFunnel.trackStep('style_quiz_complete', {
          style_name: result.styleName,
          match_score: result.matchScore,
        })
      }, 500)
    } else {
      const currentQIndex = dialogFlow.currentIndex
      const insight = insightMessages[currentQIndex + 1]
      if (insight) {
        setNianFeedbackText(insight)
        setShowNianFeedback(true)
        setTimeout(() => {
          setShowNianFeedback(false)
          dialogFlow.goNext()
        }, 1200)
      } else {
        setTimeout(() => {
          dialogFlow.goNext()
        }, 200)
      }
    }
  }

  const handleResultConfirm = () => {
    setPhase('budget')
    trackEvent('style_result_confirm', {
      style_name: computedResult.styleName,
      match_score: computedResult.matchScore,
    })
  }

  const handleBudgetSelect = (budget: string) => {
    setSelectedBudget(budget)
    trackEvent('budget_select', { budget_range: budget })
    setTimeout(() => {
      setPhase('city')
    }, 300)
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    trackEvent('city_select', { city_type: city })
    setTimeout(() => {
      setPhase('area')
    }, 300)
  }

  const handleAreaSelect = (area: number) => {
    setAreaInput(String(area))
  }

  const handleAreaConfirm = () => {
    const areaNum = Number(areaInput)
    if (areaNum > 0 && areaNum <= 1000) {
      trackEvent('area_confirm', { area: areaNum })
      setPhase('specialNeeds')
    }
  }

  const toggleNeed = (needId: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(needId) ? prev.filter((n) => n !== needId) : [...prev, needId]
    )
  }

  const handleNeedsConfirm = () => {
    const needsLabels = selectedNeeds.map(
      (id) => specialNeedsOptions.find((o) => o.id === id)?.label || ''
    )
    trackEvent('special_needs_confirm', {
      needs_count: selectedNeeds.length,
      needs: needsLabels,
    })
    setUserSession({
      budgetTotal: parseBudget(selectedBudget),
      city: selectedCity,
      area: Number(areaInput) || 0,
      specialNeeds: needsLabels,
    })
    setPhase('floorPlan')
    startFloorPlanSimulation()
  }

  const parseBudget = (budgetStr: string): number => {
    if (budgetStr === '10万以下') return 80000
    if (budgetStr === '10-20万') return 150000
    if (budgetStr === '20-30万') return 250000
    if (budgetStr === '30万以上') return 350000
    return 0
  }

  const startFloorPlanSimulation = () => {
    setFloorPlanStage('uploading')
    trackEvent('floor_plan_scan_start')
    setTimeout(() => {
      setFloorPlanStage('scanning')
    }, 1500)
    setTimeout(() => {
      setFloorPlanStage('done')
      setFloorPlanResult({ rooms: '3室2厅', area: 100 })
      setUserSession({
        floorPlan: { rooms: 3, area: 100 },
      })
      trackEvent('floor_plan_scan_complete', {
        rooms: 3,
        area: 100,
      })
    }, 3500)
  }

  const handleFloorPlanContinue = () => {
    trackEvent('sop_first_step_enter', {
      from: 'onboarding',
      style_name: computedResult.styleName,
    })
    onboardingFunnel.trackStep('sop_enter', {
      style_name: computedResult.styleName,
    })
    setView('sop')
  }

  const renderWelcome = () => (
    <div ref={welcomeRef} className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="mb-lg welcome-nian">
        <NianAvatar size="lg" animation="breathe" />
      </div>
      <h1 className="text-xl font-bold text-moHei mb-md welcome-title">嗨！我是年兽</h1>
      <p className="text-base text-fuZhu text-center mb-lg max-w-sm welcome-desc">
        接下来我会问你几个简单的问题，帮你找到最适合的装修风格~
      </p>
      <div className="welcome-btn">
        <Button size="lg" onClick={() => {
          setPhase('quiz')
          quizDuration.start()
          trackEvent('style_quiz_start')
          onboardingFunnel.trackStep('quiz_start')
        }}>
          开始吧
        </Button>
      </div>
    </div>
  )

  const renderQuestion = () => {
    const q = dialogFlow.currentQuestion
    if (!q) return null
    
    const questionIndex = dialogFlow.currentIndex + 1

    return (
      <>
        {questionIndex > 1 && (
          <ChatBubble type="nian" content={q.title} />
        )}
        {questionIndex === 1 && (
          <>
            <ChatBubble type="nian" content="我们先来看看，哪种空间感觉最吸引你？" />
            <ChatBubble type="nian" content={q.title} />
          </>
        )}

        {showNianFeedback && (
          <ChatBubble type="nian" content={nianFeedbackText} />
        )}

        {q.type === 'image-choice' && (
          <div className="grid grid-cols-2 gap-sm md:gap-md mb-sm md:mb-md overflow-hidden">
            {imageOptionsQ1.map((opt) => (
              <ImageOption
                key={opt.id}
                id={opt.id}
                label={opt.label}
                emoji={opt.emoji}
                bgColor={opt.bgColor}
                selected={dialogFlow.getAnswer(q.id) === opt.id}
                onClick={handleQuizAnswer}
              />
            ))}
          </div>
        )}

        {q.type === 'text-choice' && q.id === 2 && (
          <div className="flex flex-col gap-sm mb-md">
            {textOptionsQ2.map((opt) => (
              <TextOption
                key={opt.id}
                id={opt.id}
                label={opt.label}
                selected={dialogFlow.getAnswer(q.id) === opt.id}
                onClick={handleQuizAnswer}
              />
            ))}
          </div>
        )}

        {q.type === 'text-choice' && q.id === 3 && (
          <div className="flex flex-col gap-sm mb-md">
            {textOptionsQ3.map((opt) => (
              <TextOption
                key={opt.id}
                id={opt.id}
                label={opt.label}
                selected={dialogFlow.getAnswer(q.id) === opt.id}
                onClick={handleQuizAnswer}
              />
            ))}
          </div>
        )}

        {q.type === 'text-choice' && q.id === 4 && (
          <div className="flex flex-col gap-sm mb-md">
            {textOptionsQ4.map((opt) => (
              <TextOption
                key={opt.id}
                id={opt.id}
                label={opt.label}
                selected={dialogFlow.getAnswer(q.id) === opt.id}
                onClick={handleQuizAnswer}
              />
            ))}
          </div>
        )}

        {q.type === 'binary' && (
          <div className="grid grid-cols-2 gap-sm md:gap-md mb-sm md:mb-md overflow-hidden">
            {binaryOptionsQ5.map((opt) => (
              <ImageOption
                key={opt.id}
                id={opt.id}
                label={opt.label}
                emoji={opt.emoji}
                bgColor={opt.bgColor}
                selected={dialogFlow.getAnswer(q.id) === opt.id}
                onClick={handleQuizAnswer}
              />
            ))}
          </div>
        )}

        <div className="h-16" />
      </>
    )
  }

  const renderResult = () => (
    <div className="py-lg">
      <ChatBubble type="nian" content="好啦！根据你的选择，我觉得最适合你的风格是..." />

      <div className="bg-white rounded-md shadow-card p-md md:p-lg mb-md overflow-hidden">
        <div className="text-center overflow-hidden">
          <div className="text-5xl mb-sm">
            {computedResult.styleName === '现代中式' && '🏮'}
            {computedResult.styleName === '北欧' && '🌿'}
            {computedResult.styleName === '日式' && '🎋'}
            {computedResult.styleName === '轻奢' && '✨'}
            {computedResult.styleName === '工业风' && '🏭'}
          </div>
          <h2 className="text-xl font-bold text-moHei mb-xs">{computedResult.styleName}</h2>
          <div className="text-3xl font-bold text-daiLan mb-sm">
            <span>{matchScoreDisplay}</span>%
            <span className="text-sm font-normal text-fuZhu ml-xs">匹配度</span>
          </div>
          <p className="text-base text-tanHe mb-md">
            追求静气与秩序的东方生活家
          </p>
          <div className="flex flex-wrap gap-sm justify-center mb-md">
            {computedResult.tags.map((tag) => (
              <span
                key={tag}
                className="px-md py-xs bg-miBai text-daiLan rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={handleResultConfirm}>
          确认，继续
        </Button>
      </div>
    </div>
  )

  const renderBudget = () => (
    <>
      <ChatBubble type="nian" content="好的，风格定下来了！接下来聊聊预算吧~" />
      <ChatBubble type="nian" content="你大概的装修预算是多少呢？" />
      <div className="flex flex-wrap gap-sm justify-end mb-md">
        {budgetOptions.map((opt) => (
          <ChipButton
            key={opt}
            label={opt}
            selected={selectedBudget === opt}
            onClick={() => handleBudgetSelect(opt)}
          />
        ))}
      </div>
      <div className="h-16" />
    </>
  )

  const renderCity = () => (
    <>
      <ChatBubble type="nian" content="了解~ 你在哪个城市呢？" />
      <div className="flex flex-col gap-sm mb-md">
        {cityOptions.map((opt) => (
          <TextOption
            key={opt}
            id={opt}
            label={opt}
            selected={selectedCity === opt}
            onClick={handleCitySelect}
          />
        ))}
      </div>
      <div className="h-16" />
    </>
  )

  const renderArea = () => (
    <>
      <ChatBubble type="nian" content="房子多大面积呀？" />
      <div className="bg-white rounded-md shadow-card p-md mb-md overflow-hidden">
        <div className="flex items-center gap-sm mb-md">
          <input
            type="number"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            placeholder="请输入面积"
            className="flex-1 px-md py-sm border border-gray-200 rounded-sm text-base focus:outline-none focus:border-daiLan min-h-[44px]"
          />
          <span className="text-fuZhu">㎡</span>
        </div>
        <div className="text-sm text-fuZhu mb-sm">快速选择：</div>
        <div className="flex flex-wrap gap-sm overflow-hidden">
          {areaQuickOptions.map((area) => (
            <ChipButton
              key={area}
              label={`${area}㎡`}
              selected={areaInput === String(area)}
              onClick={() => handleAreaSelect(area)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleAreaConfirm} disabled={!areaInput || Number(areaInput) <= 0 || Number(areaInput) > 1000}>
          下一步
        </Button>
      </div>
      <div className="h-16" />
    </>
  )

  const renderSpecialNeeds = () => (
    <>
      <ChatBubble type="nian" content="有什么特殊需求吗？可以多选哦~" />
      <div className="flex flex-col gap-sm mb-md">
        {specialNeedsOptions.map((opt) => (
          <MultiSelectOption
            key={opt.id}
            id={opt.id}
            label={opt.label}
            icon={opt.icon}
            selected={selectedNeeds.includes(opt.id)}
            onClick={toggleNeed}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleNeedsConfirm}>
          下一步
        </Button>
      </div>
      <div className="h-16" />
    </>
  )

  const renderFloorPlan = () => (
    <>
      <ChatBubble type="nian" content="最后一步！让我帮你识别一下户型图~" />

      <div className="bg-white rounded-md shadow-card p-md md:p-lg mb-md overflow-hidden">
        {floorPlanStage === 'uploading' && (
          <div className="text-center py-lg">
            <div className="text-4xl mb-md animate-bounce">📄</div>
            <p className="text-base text-moHei mb-sm">正在上传户型图...</p>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-daiLan animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {floorPlanStage === 'scanning' && (
          <div className="text-center py-lg">
            <div className="relative inline-block mb-md">
              <div className="text-4xl">📐</div>
              <div className="absolute inset-0 animate-ping text-4xl opacity-50">📐</div>
            </div>
            <p className="text-base text-moHei mb-sm">AI 正在扫描识别...</p>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-zhuQing animate-pulse" style={{ width: '85%' }} />
            </div>
          </div>
        )}

        {floorPlanStage === 'done' && floorPlanResult && (
          <div className="text-center py-md">
            <div className="text-4xl mb-md">✅</div>
            <p className="text-base text-moHei mb-sm">识别完成！</p>
            <div className="bg-miBai rounded-sm p-md inline-block">
              <div className="text-xl font-bold text-daiLan mb-xs">
                {floorPlanResult.rooms}
              </div>
              <div className="text-lg font-semibold text-moHei">
                {floorPlanResult.area} ㎡
              </div>
            </div>
          </div>
        )}
      </div>

      {floorPlanStage === 'done' && (
        <div className="flex justify-end">
          <Button size="lg" onClick={handleFloorPlanContinue}>
            开始装修之旅
          </Button>
        </div>
      )}

      <div className="h-16" />
    </>
  )

  const totalQuizSteps = dialogFlow.totalSteps
  const progressPercent =
    phase === 'welcome'
      ? 0
      : phase === 'quiz'
      ? dialogFlow.progress
      : phase === 'result'
      ? 50
      : phase === 'budget'
      ? 60
      : phase === 'city'
      ? 70
      : phase === 'area'
      ? 80
      : phase === 'specialNeeds'
      ? 90
      : 100

  return (
    <div className="min-h-screen bg-miBai flex flex-col">
      <div className="bg-white border-b border-gray-100 px-md py-sm sticky top-0 z-10">
        <div className="max-w-[768px] mx-auto">
          <div className="flex items-center gap-sm mb-xs">
            <span className="text-xs text-fuZhu">
              {phase === 'welcome'
                ? '准备开始'
                : phase === 'quiz'
                ? `第 ${dialogFlow.currentIndex + 1}/${totalQuizSteps} 题`
                : phase === 'result'
                ? '风格结果'
                : phase === 'budget'
                ? '预算'
                : phase === 'city'
                ? '城市'
                : phase === 'area'
                ? '面积'
                : phase === 'specialNeeds'
                ? '特殊需求'
                : '户型识别'}
            </span>
            <span className="text-xs text-fuZhu ml-auto">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-daiLan transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-xs sm:px-sm py-sm sm:py-md"
      >
        <div className="max-w-[768px] mx-auto">
          {phase === 'welcome' && renderWelcome()}
          {phase === 'quiz' && renderQuestion()}
          {phase === 'result' && renderResult()}
          {phase === 'budget' && renderBudget()}
          {phase === 'city' && renderCity()}
          {phase === 'area' && renderArea()}
          {phase === 'specialNeeds' && renderSpecialNeeds()}
          {phase === 'floorPlan' && renderFloorPlan()}
        </div>
      </div>
    </div>
  )
}

export default OnboardingView
