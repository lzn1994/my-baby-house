import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useAppState } from '../hooks/useAppState'
import { useBudget } from '../hooks/useBudget'
import Card from '../components/Card'
import Button from '../components/Button'
import NianAvatar from '../components/NianAvatar'
import ProgressRing from '../components/ProgressRing'
import { prefersReducedMotion } from '../utils/animations'
import { usePageView } from '../hooks/useTracking'
import { trackEvent } from '../utils/tracking'
import type { BudgetWarningLevel } from '../types'
import type { EmotionType } from '../types'

const formatMoney = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

const BudgetView: React.FC = () => {
  const { state, updateNian, setUserSession } = useAppState()

  // 空状态保护：确保默认值生效
  const effectiveBudget = state.userSession.budgetTotal || 200000
  const effectiveCity = state.userSession.city || '杭州'
  const effectiveArea = state.userSession.area || 100

  const {
    adjustedBudget,
    cityMultiplier,
    perSquareMeter,
    healthStatus,
    healthPercent,
    spentAmount,
    remainingAmount,
    breakdown532,
    stageReleases,
    totalReleasedPercent,
    warnings,
  } = useBudget(effectiveBudget, effectiveCity, effectiveArea, 3)

  usePageView('budget')

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    basic: true,
    materials: true,
    soft: false,
  })
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [adjustedTotal, setAdjustedTotal] = useState(effectiveBudget)
  const [hoveredStage, setHoveredStage] = useState<number | null>(null)
  const [nianMessage, setNianMessage] = useState<string>('')
  const [showNianTip, setShowNianTip] = useState(false)
  const healthStatusTrackedRef = useRef(false)
  const numberAnimationRefs = useRef<gsap.core.Tween[]>([])
  const barAnimationRefs = useRef<gsap.core.Tween[]>([])
  const initialAnimationRef = useRef<gsap.core.Timeline | null>(null)
  const nianClickAnimationRef = useRef<gsap.core.Tween | null>(null)

  const totalBudgetRef = useRef<HTMLSpanElement>(null)
  const spentRef = useRef<HTMLSpanElement>(null)
  const remainingRef = useRef<HTMLSpanElement>(null)
  const barRefs = useRef<(HTMLDivElement | null)[]>([])
  const warningCardRef = useRef<HTMLDivElement>(null)
  const nianRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const mainContentRef = useRef<HTMLElement>(null)
  const hasAnimatedRef = useRef(false)

  const getNianEmotion = (): EmotionType => {
    if (warnings.length > 0) return 'worried'
    if (healthStatus === 'danger') return 'worried'
    if (healthStatus === 'warning') return 'confused'
    return 'happy'
  }

  const getNianBudgetTip = (): string => {
    if (healthStatus === 'danger') {
      return '预算紧张啦！建议优化一下主材选择，或者考虑分期购买软装~'
    }
    if (healthStatus === 'warning') {
      return '预算还行，记得控制好主材支出，别超支哦！'
    }
    if (warnings.length > 0) {
      return `有${warnings.length}项预算预警，点击查看详情吧~`
    }
    return '预算很健康！继续保持，我们一起把家装得美美的~'
  }

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleNianClick = () => {
    setNianMessage(getNianBudgetTip())
    setShowNianTip(true)
    updateNian({ emotion: getNianEmotion() })

    if (nianRef.current) {
      if (nianClickAnimationRef.current) {
        nianClickAnimationRef.current.kill()
      }
      
      nianClickAnimationRef.current = gsap.fromTo(
        nianRef.current,
        { y: 0, scale: 1 },
        { y: -10, scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
      )
    }

    setTimeout(() => setShowNianTip(false), 4000)
  }

  const handleAdjustBudget = () => {
    setAdjustedTotal(effectiveBudget)
    setShowAdjustModal(true)
    trackEvent('budget_adjust_open')
  }

  const handleConfirmAdjust = () => {
    const oldBudget = effectiveBudget
    const newBudget = adjustedTotal
    trackEvent('budget_adjust', {
      old_budget: oldBudget,
      new_budget: newBudget,
      change_amount: newBudget - oldBudget,
      change_percent: ((newBudget - oldBudget) / oldBudget) * 100,
    })
    setUserSession({ budgetTotal: adjustedTotal })
    setShowAdjustModal(false)
  }

  const getWarningColor = (level: BudgetWarningLevel): string => {
    switch (level) {
      case 'high':
        return '#C84A3E'
      case 'medium':
        return '#8B6F47'
      case 'low':
        return '#5B8C5A'
    }
  }

  const getWarningBgColor = (level: BudgetWarningLevel): string => {
    switch (level) {
      case 'high':
        return 'bg-zhuSha/10'
      case 'medium':
        return 'bg-tanHe/10'
      case 'low':
        return 'bg-zhuQing/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-5 h-5 rounded-full bg-zhuQing flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'in_progress':
        return (
          <div className="w-5 h-5 rounded-full bg-daiLan flex items-center justify-center flex-shrink-0 relative">
            <div className="absolute inset-0 rounded-full bg-daiLan animate-ping opacity-50" />
            <div className="w-2 h-2 rounded-full bg-white relative z-10" />
          </div>
        )
      case 'pending':
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )
    }
  }

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

    if (sidebarRef.current) {
      const cards = sidebarRef.current.querySelectorAll('.rounded-md')
      if (cards.length > 0) {
        tl.fromTo(cards,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          '-=0.3'
        )
      }
    }

    if (mainContentRef.current) {
      const cards = mainContentRef.current.querySelectorAll('.rounded-md')
      if (cards.length > 0) {
        tl.fromTo(cards,
          { y: 20, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.1)' },
          '-=0.4'
        )
      }
    }

    if (nianRef.current) {
      tl.fromTo(nianRef.current,
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
    if (!healthStatusTrackedRef.current && healthStatus) {
      healthStatusTrackedRef.current = true
      trackEvent('budget_health_view', {
        health_status: healthStatus,
        health_percent: healthPercent,
        total_budget: adjustedBudget,
        warnings_count: warnings.length,
      })
    }
  }, [healthStatus, healthPercent, adjustedBudget, warnings.length])

  useEffect(() => {
    numberAnimationRefs.current.forEach(tween => tween.kill())
    numberAnimationRefs.current = []
    barAnimationRefs.current.forEach(tween => tween.kill())
    barAnimationRefs.current = []

    if (totalBudgetRef.current) {
      const target = adjustedBudget
      const tween = gsap.fromTo(
        totalBudgetRef.current,
        { textContent: '0' },
        {
          textContent: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            if (totalBudgetRef.current) {
              totalBudgetRef.current.textContent = formatMoney(
                Math.round(parseFloat(totalBudgetRef.current.textContent.replace(/,/g, '')))
              )
            }
          },
        }
      )
      numberAnimationRefs.current.push(tween)
    }

    if (spentRef.current) {
      const target = spentAmount
      const tween = gsap.fromTo(
        spentRef.current,
        { textContent: '0' },
        {
          textContent: target,
          duration: 1.5,
          delay: 0.3,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            if (spentRef.current) {
              spentRef.current.textContent = formatMoney(
                Math.round(parseFloat(spentRef.current.textContent.replace(/,/g, '')))
              )
            }
          },
        }
      )
      numberAnimationRefs.current.push(tween)
    }

    if (remainingRef.current) {
      const target = remainingAmount
      const tween = gsap.fromTo(
        remainingRef.current,
        { textContent: '0' },
        {
          textContent: target,
          duration: 1.5,
          delay: 0.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            if (remainingRef.current) {
              remainingRef.current.textContent = formatMoney(
                Math.round(parseFloat(remainingRef.current.textContent.replace(/,/g, '')))
              )
            }
          },
        }
      )
      numberAnimationRefs.current.push(tween)
    }

    barRefs.current.forEach((bar, index) => {
      if (bar) {
        const tween = gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: bar.dataset.width || '0%',
            duration: 1,
            delay: 0.5 + index * 0.1,
            ease: 'power2.out',
          }
        )
        barAnimationRefs.current.push(tween)
      }
    })

    if (warningCardRef.current && warnings.length > 0) {
      const tween = gsap.fromTo(
        warningCardRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.8, ease: 'back.out(1.2)' }
      )
      numberAnimationRefs.current.push(tween)
    }

    return () => {
      numberAnimationRefs.current.forEach(tween => tween.kill())
      barAnimationRefs.current.forEach(tween => tween.kill())
    }
  }, [adjustedBudget, spentAmount, remainingAmount, warnings.length])

  const totalSpentPercent = Math.round((spentAmount / adjustedBudget) * 100)

  return (
    <div className="min-h-screen bg-miBai font-zh">
      <div className="max-w-[1400px] mx-auto px-sm md:px-lg py-sm md:py-lg">
        <header ref={headerRef} className="mb-md md:mb-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-moHei mb-xs">💰 预算管理中心</h1>
              <p className="text-xs md:text-sm text-fuZhu">
                智能532拆解 · 6阶段释放 · 实时预警，让装修预算明明白白
              </p>
            </div>
            <div className="flex items-center gap-sm md:gap-md">
              <div className="text-right">
                <div className="text-xs text-fuZhu">预算健康度</div>
                <div
                  className="text-base md:text-lg font-semibold"
                  style={{
                    color:
                      healthStatus === 'healthy'
                        ? '#5B8C5A'
                        : healthStatus === 'warning'
                        ? '#8B6F47'
                        : '#C84A3E',
                  }}
                >
                  {healthStatus === 'healthy' ? '健康' : healthStatus === 'warning' ? '注意' : '紧张'}
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleAdjustBudget} className="md:px-md md:py-sm md:text-base">
                + 调整预算
              </Button>
            </div>
          </div>
        </header>

        {warnings.length > 0 && (
          <div ref={warningCardRef} className="mb-md md:mb-lg">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className={`p-sm md:p-md rounded-md border-l-4 ${getWarningBgColor(warning.level)}`}
                style={{ borderLeftColor: getWarningColor(warning.level) }}
              >
                <div className="flex items-start gap-sm">
                  <span className="text-lg md:text-xl">⚠️</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-sm mb-xs">
                      <span className="font-semibold text-moHei text-sm md:text-base">{warning.title}</span>
                      <span
                        className="text-xs px-sm py-0.5 rounded-sm flex-shrink-0"
                        style={{
                          backgroundColor: getWarningColor(warning.level) + '20',
                          color: getWarningColor(warning.level),
                        }}
                      >
                        超支 {formatMoney(warning.overrunAmount)}元
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-fuZhu mb-xs">
                      原计划 {formatMoney(warning.plannedAmount)}元，实际 {formatMoney(warning.actualAmount)}元
                    </p>
                    <p className="text-xs md:text-sm text-moHei">
                      <span className="text-zhuQing">💡 建议：</span>
                      {warning.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-md md:gap-lg overflow-hidden">
          <aside ref={sidebarRef} className="w-full lg:w-[280px] flex-shrink-0 space-y-sm md:space-y-md overflow-hidden">
            <Card className="!p-md md:!p-lg">
              <div className="flex flex-col items-center">
                <h3 className="text-sm md:text-base font-semibold text-moHei mb-sm md:mb-md w-full">预算健康度</h3>
                <ProgressRing
                  progress={healthPercent}
                  status={healthStatus}
                  size={100}
                  showNian={false}
                  className="md:w-[140px] md:h-[140px]"
                />
                <div className="mt-8 text-center">
                  <div className="text-xs text-fuZhu mb-xs">总预算</div>
                  <div className="text-2xl font-bold text-moHei">
                    ¥<span ref={totalBudgetRef}>0</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="!p-md">
              <div className="space-y-md">
                <div>
                  <div className="flex justify-between items-center mb-xs">
                    <span className="text-sm text-fuZhu">已花费</span>
                    <span className="text-sm font-medium text-zhuSha">
                      ¥<span ref={spentRef}>0</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-miBai rounded-full overflow-hidden">
                    <div
                      ref={(el) => {
                        barRefs.current[0] = el
                      }}
                      data-width={`${totalSpentPercent}%`}
                      className="h-full bg-zhuSha rounded-full"
                      style={{ width: 0 }}
                    />
                  </div>
                  <div className="text-xs text-fuZhu mt-xs text-right">{totalSpentPercent}%</div>
                </div>

                <div className="pt-md border-t border-miBai">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="text-sm text-fuZhu">剩余预算</span>
                    <span className="text-sm font-semibold text-zhuQing">
                      ¥<span ref={remainingRef}>0</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="!p-md">
              <h3 className="text-base font-semibold text-moHei mb-md">基础信息</h3>
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fuZhu">城市</span>
                  <div className="flex items-center gap-xs">
                    <span className="text-sm text-moHei">{effectiveCity}</span>
                    <span className="text-xs px-xs py-0.5 bg-daiLan/10 text-daiLan rounded-sm">
                      {cityMultiplier.toFixed(2)}x
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fuZhu">面积</span>
                  <span className="text-sm text-moHei">{effectiveArea}㎡</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fuZhu">每平米造价</span>
                  <span className="text-sm font-medium text-daiLan">¥{formatMoney(perSquareMeter)}/㎡</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fuZhu">装修类型</span>
                  <span className="text-sm text-moHei">半包</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fuZhu">装修风格</span>
                  <span className="text-sm text-tanHei">现代中式</span>
                </div>
              </div>
            </Card>

            <Card className="!p-md" variant="info">
              <div className="flex items-center gap-sm mb-sm">
                <span className="text-lg">🏮</span>
                <h3 className="text-base font-semibold text-tanHei">中式风格加成</h3>
              </div>
              <div className="space-y-xs mb-md">
                {breakdown532.styleAddons.slice(0, 3).map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <span className="text-fuZhu">{item.name}</span>
                    <span className="text-moHei">+¥{formatMoney(item.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-sm border-t border-miBai flex justify-between items-center">
                <span className="text-sm text-fuZhu">风格合计</span>
                <span className="text-sm font-semibold text-tanHei">
                  ¥{formatMoney(breakdown532.styleTotal)}
                  <span className="text-xs text-fuZhu ml-xs">
                    ({Math.round((breakdown532.styleTotal / adjustedBudget) * 100)}%)
                  </span>
                </span>
              </div>
              <Button variant="text" size="sm" className="w-full mt-sm text-tanHei">
                查看风格建议 →
              </Button>
            </Card>
          </aside>

          <main ref={mainContentRef} className="flex-1 min-w-0 space-y-sm md:space-y-md overflow-hidden">
            <Card className="!p-md md:!p-lg">
              <div className="mb-md">
                <div className="flex items-center justify-between mb-xs">
                  <h3 className="text-lg font-bold text-moHei flex items-center gap-sm">
                    <span>📊</span>
                    532智能拆解
                  </h3>
                  <span className="text-xs text-fuZhu">
                    基础硬装50% · 主材设备30% · 软装家电20%
                  </span>
                </div>
                <p className="text-sm text-fuZhu">
                  基于10万+装修大数据的智能分配模型，让每一分钱都花在刀刃上
                </p>
              </div>

              <div className="relative mb-lg overflow-hidden">
                <div className="flex h-10 rounded-md overflow-hidden shadow-inner">
                  {breakdown532.categories.map((cat, index) => (
                    <div
                      key={cat.key}
                      ref={(el) => {
                        barRefs.current[index + 1] = el
                      }}
                      data-width={`${cat.ratio * 100}%`}
                      className="h-full flex items-center justify-center text-white text-sm font-medium transition-all cursor-pointer hover:brightness-110"
                      style={{
                        width: 0,
                        backgroundColor: cat.color,
                      }}
                      onClick={() => toggleCategory(cat.key)}
                    >
                      <span className="truncate px-sm">{cat.name}</span>
                      <span className="ml-xs text-white/80">¥{formatMoney(cat.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-xs text-xs text-fuZhu">
                  {breakdown532.categories.map((cat) => (
                    <span key={cat.key}>{Math.round(cat.ratio * 100)}%</span>
                  ))}
                </div>
              </div>

              <div className="space-y-md">
                {breakdown532.categories.map((category) => (
                  <div
                    key={category.key}
                    className="border border-miBai rounded-md overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-md cursor-pointer hover:bg-miBai/50 transition-colors"
                      onClick={() => toggleCategory(category.key)}
                    >
                      <div className="flex items-center gap-sm">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-semibold text-moHei">{category.name}</span>
                        <span className="text-xs px-sm py-0.5 bg-miBai text-fuZhu rounded-sm">
                          {Math.round(category.ratio * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-sm">
                        <span className="font-semibold" style={{ color: category.color }}>
                          ¥{formatMoney(category.amount)}
                        </span>
                        <svg
                          className={`w-4 h-4 text-fuZhu transition-transform ${
                            expandedCategories[category.key] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {expandedCategories[category.key] && (
                      <div className="px-md pb-md border-t border-miBai">
                        <div className="pt-md space-y-sm">
                          {category.items.map((item, idx) => (
                            <div key={item.name} className="flex items-center gap-sm">
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-xs">
                                  <span className="text-sm text-moHei">{item.name}</span>
                                  <div className="flex items-center gap-sm">
                                    <span className="text-sm font-medium text-moHei">
                                      ¥{formatMoney(item.amount)}
                                    </span>
                                    <span className="text-xs text-fuZhu">
                                      {Math.round(item.ratio * 100)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full h-1.5 bg-miBai rounded-full overflow-hidden">
                                  <div
                                    ref={(el) => {
                                      barRefs.current[10 + idx] = el
                                    }}
                                    data-width={`${item.ratio * 100}%`}
                                    className="h-full rounded-full"
                                    style={{
                                      width: 0,
                                      backgroundColor: category.color + '80',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="!p-lg">
              <div className="flex items-center gap-sm mb-md">
                <span className="text-xl">🏮</span>
                <h3 className="text-lg font-bold text-tanHei">现代中式专项预算</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md overflow-hidden">
                {breakdown532.styleAddons.map((item) => (
                  <div
                    key={item.name}
                    className="p-md rounded-md bg-tanHei/5 border border-tanHei/20 hover:shadow-hover transition-shadow overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-xs">
                      <span className="font-medium text-moHei">{item.name}</span>
                      <span className="text-tanHei font-semibold">¥{formatMoney(item.amount)}</span>
                    </div>
                    <p className="text-xs text-fuZhu">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>

          </main>

          <aside className="w-full lg:w-[320px] lg:flex-shrink-0 overflow-hidden">
            <Card className="!p-md md:!p-lg sticky top-lg overflow-hidden">
              <div className="mb-md">
                <h3 className="text-lg font-bold text-moHei flex items-center gap-sm mb-xs">
                  <span>🔓</span>
                  6阶段释放
                </h3>
                <p className="text-sm text-fuZhu">
                  按施工节点分阶段释放预算，资金更安全
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-miBai" />

                <div className="space-y-0">
                  {stageReleases.map((stage) => (
                    <div
                      key={stage.stage}
                      className={`relative flex gap-sm p-sm -mx-sm rounded-md cursor-pointer transition-colors ${
                        hoveredStage === stage.stage ? 'bg-miBai' : 'hover:bg-miBai/50'
                      }`}
                      onMouseEnter={() => setHoveredStage(stage.stage)}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        {getStatusIcon(stage.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-xs">
                          <span
                            className={`text-sm font-medium ${
                              stage.status === 'completed'
                                ? 'text-zhuQing'
                                : stage.status === 'in_progress'
                                ? 'text-daiLan'
                                : 'text-fuZhu'
                            }`}
                          >
                            阶段{stage.stage} {stage.stageName}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              stage.status === 'completed'
                                ? 'text-zhuQing'
                                : stage.status === 'in_progress'
                                ? 'text-daiLan'
                                : 'text-fuZhu'
                            }`}
                          >
                            {Math.round(stage.releaseRatio * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-fuZhu">{stage.purpose}</span>
                          <span
                            className={`text-sm font-semibold ${
                              stage.status === 'completed'
                                ? 'text-zhuQing'
                                : stage.status === 'in_progress'
                                ? 'text-daiLan'
                                : 'text-gray-400'
                            }`}
                          >
                            ¥{formatMoney(stage.amount)}
                          </span>
                        </div>

                        {hoveredStage === stage.stage && stage.sopSteps.length > 0 && (
                          <div className="mt-sm pt-sm border-t border-miBai">
                            <div className="text-xs text-fuZhu mb-xs">包含SOP步骤：</div>
                            <div className="flex flex-wrap gap-xs">
                              {stage.sopSteps.map((step) => (
                                <span
                                  key={step}
                                  className="text-xs px-xs py-0.5 bg-daiLan/10 text-daiLan rounded-sm"
                                >
                                  {step}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-lg pt-md border-t border-miBai">
                <div className="flex justify-between items-center mb-sm">
                  <span className="text-sm text-fuZhu">累计释放进度</span>
                  <span className="text-sm font-semibold text-daiLan">{totalReleasedPercent}%</span>
                </div>
                <div className="w-full h-2 bg-miBai rounded-full overflow-hidden">
                  <div
                    ref={(el) => {
                      barRefs.current[20] = el
                    }}
                    data-width={`${totalReleasedPercent}%`}
                    className="h-full bg-gradient-to-r from-daiLan to-zhuQing rounded-full"
                    style={{ width: 0 }}
                  />
                </div>
                <div className="flex justify-between mt-xs text-xs text-fuZhu">
                  <span>
                    已释放 ¥{formatMoney(
                      stageReleases
                        .filter((s) => s.status === 'completed')
                        .reduce((sum, s) => sum + s.amount, 0)
                    )}
                  </span>
                  <span>
                    待释放 ¥{formatMoney(
                      stageReleases
                        .filter((s) => s.status === 'pending')
                        .reduce((sum, s) => sum + s.amount, 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-md space-y-xs">
                <div className="flex items-center gap-xs text-xs">
                  <div className="w-3 h-3 rounded-full bg-zhuQing" />
                  <span className="text-fuZhu">已释放</span>
                </div>
                <div className="flex items-center gap-xs text-xs">
                  <div className="w-3 h-3 rounded-full bg-daiLan" />
                  <span className="text-fuZhu">进行中</span>
                </div>
                <div className="flex items-center gap-xs text-xs">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-fuZhu">待释放</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <div ref={nianRef} className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-20 cursor-pointer" onClick={handleNianClick}>
        <div className="relative">
          <NianAvatar emotion={getNianEmotion()} size="lg" pulse={healthStatus === 'danger'} className="w-14 h-14 md:w-16 md:h-16" />

          {showNianTip && nianMessage && (
            <div className="absolute -top-16 right-0 w-64 p-sm bg-white rounded-md shadow-hover text-sm text-moHei">
              <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-white border-r-8 border-r-transparent" />
              {nianMessage}
            </div>
          )}

          <div className="absolute -top-2 -right-2 w-6 h-6 bg-tongQianJin text-white text-xs rounded-full flex items-center justify-center font-medium shadow-card">
            💰
          </div>
        </div>
      </div>

      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-nuanBai rounded-md p-lg w-[400px] shadow-hover">
            <h3 className="text-lg font-bold text-moHei mb-md">调整总预算</h3>
            <div className="mb-lg">
              <div className="flex justify-between items-center mb-sm">
                <span className="text-sm text-fuZhu">总预算</span>
                <span className="text-xl font-bold text-daiLan">¥{formatMoney(adjustedTotal)}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={adjustedTotal}
                onChange={(e) => setAdjustedTotal(Number(e.target.value))}
                className="w-full h-2 bg-miBai rounded-lg appearance-none cursor-pointer accent-daiLan"
              />
              <div className="flex justify-between text-xs text-fuZhu mt-xs">
                <span>5万</span>
                <span>50万</span>
              </div>
            </div>
            <div className="flex gap-sm">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setShowAdjustModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleConfirmAdjust}
              >
                确认调整
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetView
