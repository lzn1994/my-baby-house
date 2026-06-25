import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useAppState } from '../hooks/useAppState'
import Card from '../components/Card'
import Button from '../components/Button'
import AnimatedNumber from '../components/AnimatedNumber'
import NianSpeech, { getRandomEncourageMessage } from '../components/NianSpeech'
import { achievements, isAchievementUnlocked } from '../data/achievements'
import { getLevelData, getLevelProgress, getStageName, defaultEquipment } from '../data/nian-levels'
import { prefersReducedMotion } from '../utils/animations'
import { usePageView } from '../hooks/useTracking'
import { trackEvent } from '../utils/tracking'

const NianView: React.FC = () => {
  const { state, updateNian, setView } = useAppState()
  const { nianProgress, sopProgress, userSession } = state

  usePageView('nian')

  const nianRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const nianCardRef = useRef<HTMLDivElement>(null)
  const sidePanelRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const [showSpeech, setShowSpeech] = useState(false)
  const [speechMessage, setSpeechMessage] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)
  const [isLevelUp, setIsLevelUp] = useState(false)
  const prevLevelRef = useRef(nianProgress.level)

  const levelData = getLevelData(nianProgress.level)
  const progress = getLevelProgress(nianProgress.spiritPoints, nianProgress.level)

  const equipment = nianProgress.equipment.length > 0
    ? nianProgress.equipment
    : defaultEquipment

  const achievementContext = {
    completedSteps: sopProgress.completedSteps.length,
    styleQuizDone: !!userSession.styleResult,
    budgetHealth: userSession.budgetTotal > 0 ? 85 : 0,
    qualityScore: 0,
  }

  const unlockedCount = achievements.filter((a) =>
    isAchievementUnlocked(a, achievementContext)
  ).length

  useEffect(() => {
    if (nianProgress.level > prevLevelRef.current) {
      setIsLevelUp(true)
      triggerLevelUpAnimation()
      prevLevelRef.current = nianProgress.level
      trackEvent('nian_level_up', {
        new_level: nianProgress.level,
        spirit_points: nianProgress.spiritPoints,
      })
    }
  }, [nianProgress.level, nianProgress.spiritPoints])

  useEffect(() => {
    if (nianProgress.streakDays === 0) {
      updateNian({ streakDays: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    if (prefersReducedMotion()) return

    const tl = gsap.timeline()

    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    }

    if (nianCardRef.current) {
      tl.fromTo(nianCardRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' },
        '-=0.3'
      )
    }

    if (sidePanelRef.current) {
      const cards = sidePanelRef.current.querySelectorAll('.rounded-md')
      if (cards.length > 0) {
        tl.fromTo(cards,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          '-=0.4'
        )
      }
    }
  }, [])

  useEffect(() => {
    if (nianRef.current) {
      gsap.to(nianRef.current, {
        y: -8,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }
  }, [])

  useEffect(() => {
    if (progressBarRef.current && progress.percent !== undefined) {
      gsap.to(progressBarRef.current, {
        width: `${progress.percent}%`,
        duration: 1,
        ease: 'power2.out',
      })
    }
  }, [progress.percent])

  const triggerLevelUpAnimation = () => {
    if (!confettiRef.current) return

    const colors = ['#C84A3E', '#D4AF37', '#5B8C5A', '#4A6FA5', '#8B6F47']
    const confettiPieces: HTMLDivElement[] = []

    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div')
      piece.style.position = 'absolute'
      piece.style.width = `${Math.random() * 8 + 4}px`
      piece.style.height = `${Math.random() * 8 + 4}px`
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
      piece.style.left = `${Math.random() * 100}%`
      piece.style.top = '50%'
      piece.style.opacity = '0'
      confettiRef.current.appendChild(piece)
      confettiPieces.push(piece)

      gsap.fromTo(
        piece,
        {
          y: 0,
          x: 0,
          rotation: 0,
          opacity: 1,
        },
        {
          y: Math.random() * 400 - 200,
          x: Math.random() * 600 - 300,
          rotation: Math.random() * 720 - 360,
          opacity: 0,
          duration: Math.random() * 2 + 1.5,
          ease: 'power2.out',
          delay: Math.random() * 0.3,
        }
      )
    }

    if (nianRef.current) {
      gsap.fromTo(
        nianRef.current,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 3,
        }
      )
    }

    setTimeout(() => {
      confettiPieces.forEach((p) => p.remove())
      setIsLevelUp(false)
    }, 3000)
  }

  const handleNianClick = () => {
    setSpeechMessage(getRandomEncourageMessage())
    setShowSpeech(true)
    trackEvent('nian_interaction', {
      interaction_type: 'click',
      nian_level: nianProgress.level,
      nian_emotion: nianProgress.emotion,
    })

    if (nianRef.current) {
      gsap.fromTo(
        nianRef.current,
        { y: -8, scale: 1 },
        {
          y: -20,
          scale: 1.1,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      )
    }
  }

  const handleSpeechComplete = () => {
    setShowSpeech(false)
  }

  const handleEquipmentClick = (equipId: string) => {
    setSelectedEquipment(selectedEquipment === equipId ? null : equipId)
    setSelectedAchievement(null)
  }

  const handleAchievementClick = (achievementId: string) => {
    setSelectedAchievement(selectedAchievement === achievementId ? null : achievementId)
    setSelectedEquipment(null)

    const achievement = achievements.find((a) => a.id === achievementId)
    const unlocked = achievement ? isAchievementUnlocked(achievement, achievementContext) : false
    trackEvent('achievement_view', {
      achievement_id: achievementId,
      achievement_name: achievement?.name,
      is_unlocked: unlocked,
    })
  }

  const getSelectedEquip = () => {
    if (!selectedEquipment) return null
    return equipment.find((e) => e.id === selectedEquipment)
  }

  const getSelectedAchievement = () => {
    if (!selectedAchievement) return null
    return achievements.find((a) => a.id === selectedAchievement)
  }

  return (
    <div className="min-h-screen bg-miBai font-zh relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, #D4AF37 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, #C84A3E 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #5B8C5A 0%, transparent 40%)
          `,
          backgroundSize: '200px 200px, 250px 250px, 300px 300px',
        }}
      />

      <div className="max-w-6xl mx-auto px-sm md:px-lg py-sm md:py-lg relative z-10">
        <header ref={headerRef} className="mb-md md:mb-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-moHei mb-xs">
                🐲 年兽养成
              </h1>
              <p className="text-xs md:text-sm text-fuZhu">
                陪同年兽一起成长，见证家的蜕变
              </p>
            </div>
            <div className="flex gap-sm">
              <Button variant="secondary" size="sm" onClick={() => setView('sop')}>
                装修流程
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setView('budget')}>
                预算管理
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-md md:gap-lg">
          <div className="flex-1 min-w-0">
            <div ref={nianCardRef} className="bg-nuanBai rounded-md shadow-card p-md md:p-lg relative min-h-[300px] md:min-h-[500px] flex flex-col items-center justify-center">
              <div ref={confettiRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

              {isLevelUp && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-tongQianJin text-white px-lg py-md rounded-md shadow-card text-center">
                    <div className="text-lg font-bold">🎉 升级啦！</div>
                    <div className="text-sm mt-xs">LV.{nianProgress.level} {levelData.title}</div>
                  </div>
                </div>
              )}

              <div className="absolute top-md left-md">
                <div className="bg-tongQianJin/10 border border-tongQianJin/30 rounded-md px-md py-sm">
                  <div className="text-tongQianJin font-bold text-lg">
                    LV.{nianProgress.level}
                  </div>
                  <div className="text-tanHe text-sm">
                    {levelData.title}
                  </div>
                  <div className="text-xs text-fuZhu mt-xs">
                    {getStageName(nianProgress.level)}
                  </div>
                </div>
              </div>

              <div className="relative cursor-pointer" onClick={handleNianClick}>
                <NianSpeech
                  visible={showSpeech}
                  message={speechMessage}
                  position="top"
                  onComplete={handleSpeechComplete}
                />

                <div ref={nianRef} className="relative flex items-center justify-center">
                  <div className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] flex items-center justify-center text-[50px] md:text-[100px] select-none">
                    {levelData.emoji}
                  </div>

                  <div className="absolute top-0 right-0 text-2xl md:text-3xl">
                    {equipment.length > 0 && equipment[0].icon}
                  </div>

                  {equipment.length > 1 && (
                    <div className="absolute top-0 left-0 text-xl md:text-2xl">
                      {equipment[1].icon}
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[140px] h-[24px] md:w-[200px] md:h-[30px]">
                  <div
                    className="w-full h-full rounded-[50%]"
                    style={{
                      background: `radial-gradient(ellipse at center, rgba(139, 111, 71, 0.2) 0%, rgba(139, 111, 71, 0.05) 50%, transparent 70%)`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-lg text-center">
                <p className="text-sm text-fuZhu">
                  点击年兽和它互动吧~
                </p>
              </div>

              <div className="absolute bottom-md left-md right-md">
                <div className="flex items-center justify-between text-sm mb-xs">
                  <span className="text-fuZhu">灵气值</span>
                  <span className="text-daiLan font-medium">
                    {nianProgress.spiritPoints} / {getLevelData(Math.min(15, nianProgress.level + 1)).spiritRequired}
                  </span>
                </div>
                <div className="h-3 bg-miBai rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full rounded-full"
                    style={{
                      width: '0%',
                      background: 'linear-gradient(90deg, #4A6FA5, #5B8C5A)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div ref={sidePanelRef} className="w-full md:w-[340px] md:flex-shrink-0 space-y-sm md:space-y-md">
            <Card variant="info" title="📊 属性面板">
              <div className="grid grid-cols-2 gap-sm">
                <div className="bg-miBai rounded-md p-sm text-center">
                  <div className="text-2xl mb-xs">✨</div>
                  <div className="text-xs text-fuZhu">灵气值</div>
                  <AnimatedNumber
                    value={nianProgress.spiritPoints}
                    className="text-lg font-bold text-daiLan"
                    duration={1.2}
                    useThousandSeparator
                  />
                </div>
                <div className="bg-miBai rounded-md p-sm text-center">
                  <div className="text-2xl mb-xs">🏠</div>
                  <div className="text-xs text-fuZhu">房屋评分</div>
                  <AnimatedNumber
                    value={nianProgress.houseScore}
                    className="text-lg font-bold text-zhuQing"
                    duration={1.2}
                  />
                </div>
                <div className="bg-miBai rounded-md p-sm text-center">
                  <div className="text-2xl mb-xs">📅</div>
                  <div className="text-xs text-fuZhu">连续签到</div>
                  <div className="text-lg font-bold text-zhuSha">
                    <AnimatedNumber
                      value={nianProgress.streakDays}
                      duration={1}
                      suffix=" 天"
                    />
                  </div>
                </div>
                <div className="bg-miBai rounded-md p-sm text-center">
                  <div className="text-2xl mb-xs">💎</div>
                  <div className="text-xs text-fuZhu">玉石数量</div>
                  <AnimatedNumber
                    value={nianProgress.jadeStones}
                    className="text-lg font-bold text-tongQianJin"
                    duration={1.2}
                  />
                </div>
              </div>
            </Card>

            <Card variant="info" title="🎀 装备栏">
              <div className="flex gap-sm overflow-x-auto pb-sm md:pb-0">
                {equipment.map((equip) => (
                  <div
                    key={equip.id}
                    onClick={() => handleEquipmentClick(equip.id)}
                    className={`cursor-pointer rounded-md p-sm border-2 transition-all flex-shrink-0 w-[80px] ${
                      selectedEquipment === equip.id
                        ? 'border-tongQianJin bg-tongQianJin/5'
                        : 'border-transparent bg-miBai hover:border-tanHe/30'
                    }`}
                  >
                    <div className="text-2xl text-center">{equip.icon}</div>
                    <div className="text-xs text-moHei text-center mt-xs">{equip.name}</div>
                    <div className="text-xs text-tongQianJin text-center">{equip.description}</div>
                  </div>
                ))}

                {equipment.length < 3 && (
                  <div className="rounded-md p-sm border-2 border-dashed border-gray-200 bg-miBai/50 flex-shrink-0 w-[80px]">
                    <div className="text-2xl text-center text-gray-300">🔒</div>
                    <div className="text-xs text-fuZhu text-center mt-xs">未解锁</div>
                    <div className="text-xs text-fuZhu text-center">升级解锁</div>
                  </div>
                )}
              </div>

              {getSelectedEquip() && (
                <div className="mt-sm p-sm bg-tongQianJin/5 rounded-md border border-tongQianJin/20">
                  <div className="text-sm font-medium text-moHei">
                    {getSelectedEquip()?.icon} {getSelectedEquip()?.name}
                  </div>
                  <div className="text-xs text-fuZhu mt-xs">
                    {getSelectedEquip()?.description}
                  </div>
                </div>
              )}
            </Card>

            <Card variant="info" title={`🏆 成就徽章 (${unlockedCount}/${achievements.length})`}>
              <div className="grid grid-cols-3 gap-sm">
                {achievements.map((achievement) => {
                  const unlocked = isAchievementUnlocked(achievement, achievementContext)
                  const isSelected = selectedAchievement === achievement.id

                  return (
                    <div
                      key={achievement.id}
                      onClick={() => handleAchievementClick(achievement.id)}
                      className={`cursor-pointer rounded-md p-sm text-center transition-all ${
                        unlocked
                          ? isSelected
                            ? 'bg-tongQianJin/10 border-2 border-tongQianJin'
                            : 'bg-miBai border-2 border-tongQianJin/40 hover:border-tongQianJin'
                          : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`text-xl md:text-2xl ${unlocked ? '' : 'grayscale'}`}>
                        {unlocked ? achievement.icon : '🔒'}
                      </div>
                      <div className={`text-xs mt-xs ${unlocked ? 'text-moHei' : 'text-fuZhu'}`}>
                        {achievement.name}
                      </div>
                    </div>
                  )
                })}
              </div>

              {getSelectedAchievement() && (
                <div className={`mt-sm p-sm rounded-md border ${
                  isAchievementUnlocked(getSelectedAchievement()!, achievementContext)
                    ? 'bg-tongQianJin/5 border-tongQianJin/20'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-sm font-medium text-moHei">
                    {getSelectedAchievement()?.icon} {getSelectedAchievement()?.name}
                  </div>
                  <div className="text-xs text-fuZhu mt-xs">
                    {getSelectedAchievement()?.description}
                  </div>
                  <div className="text-xs text-tongQianJin mt-xs">
                    奖励：
                    {getSelectedAchievement()?.reward.spiritPoints && `灵气+${getSelectedAchievement()?.reward.spiritPoints}`}
                    {getSelectedAchievement()?.reward.jadeStones && ` 玉石+${getSelectedAchievement()?.reward.jadeStones}`}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NianView
