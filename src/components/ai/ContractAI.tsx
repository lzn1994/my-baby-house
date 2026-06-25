import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import AILoading from '../AILoading'
import AIModal from '../AIModal'
import Card from '../Card'
import NianAvatar from '../NianAvatar'
import { contractRisks, contractSuggestions } from '../../data/ai-content'
import type { RiskLevel } from '../../data/ai-content'

export interface ContractAIProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

const ContractAI: React.FC<ContractAIProps> = ({ isOpen, onClose, onConfirm }) => {
  const [phase, setPhase] = useState<'loading' | 'result'>('loading')
  const resultRef = useRef<HTMLDivElement>(null)
  const nianRef = useRef<HTMLDivElement>(null)
  const riskRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setPhase('loading')
      riskRefs.current = []
    }
  }, [isOpen])

  const handleLoadingComplete = () => {
    setPhase('result')
  }

  useEffect(() => {
    if (phase === 'result' && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )

      riskRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: 0.3 + index * 0.1,
              ease: 'power2.out',
            }
          )
        }
      })

      if (nianRef.current) {
        gsap.fromTo(
          nianRef.current,
          { x: 100, opacity: 0, rotation: -15 },
          {
            x: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            delay: 0.8,
            ease: 'back.out(1.5)',
          }
        )
        gsap.fromTo(
          nianRef.current,
          { y: 0 },
          {
            y: -8,
            duration: 0.5,
            delay: 1.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        )
      }
    }
  }, [phase])

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const getRiskCount = (level: RiskLevel) =>
    contractRisks.filter((r) => r.level === level).length

  const levelConfig: Record<RiskLevel, { icon: string; color: string; bgColor: string; label: string }> = {
    high: {
      icon: '🔴',
      color: 'text-zhuSha',
      bgColor: 'bg-zhuSha/10',
      label: '高风险',
    },
    medium: {
      icon: '🟡',
      color: 'text-tanHe',
      bgColor: 'bg-tanHe/10',
      label: '中风险',
    },
    low: {
      icon: '🟢',
      color: 'text-zhuQing',
      bgColor: 'bg-zhuQing/10',
      label: '低风险',
    },
  }

  const sortedRisks = [...contractRisks].sort((a, b) => {
    const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 }
    return order[a.level] - order[b.level]
  })

  return (
    <AIModal
      isOpen={isOpen}
      title="AI合同风险鉴别"
      type="contract"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="已了解，继续"
      showConfirm={phase === 'result'}
    >
      {phase === 'loading' && (
        <AILoading
          text="AI正在扫描合同风险..."
          duration={2.5}
          onComplete={handleLoadingComplete}
        />
      )}

      {phase === 'result' && (
        <div ref={resultRef} className="space-y-md relative">
          <div className="flex items-center justify-between">
            <div className="flex gap-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-zhuSha">{getRiskCount('high')}</div>
                <div className="text-xs text-fuZhu">高风险</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tanHe">{getRiskCount('medium')}</div>
                <div className="text-xs text-fuZhu">中风险</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zhuQing">{getRiskCount('low')}</div>
                <div className="text-xs text-fuZhu">低风险</div>
              </div>
            </div>
            <div ref={nianRef} className="relative opacity-0">
              <div className="relative">
                <NianAvatar emotion="happy" size="md" />
                <div className="absolute -top-1 -right-1 text-lg">👍</div>
              </div>
            </div>
          </div>

          <div className="space-y-sm">
            {sortedRisks.map((risk, index) => {
              const config = levelConfig[risk.level]
              return (
                <div
                  key={risk.id}
                  ref={(el) => { riskRefs.current[index] = el }}
                  className={`p-sm rounded-md border-l-4 ${config.bgColor} border-l-current cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]`}
                >
                  <div className="flex items-start gap-sm">
                    <span className="text-lg flex-shrink-0">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-sm mb-xs">
                        <span className={`font-semibold ${config.color}`}>{risk.title}</span>
                        <span className={`text-xs px-xs py-0.5 rounded ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-fuZhu mb-xs">{risk.description}</p>
                      <p className="text-sm text-moHei">
                        <span className="text-daiLan font-medium">建议：</span>
                        {risk.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Card variant="success" title="✨ AI优化建议">
            <div className="space-y-xs">
              {contractSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-sm">
                  <span className="text-zhuQing flex-shrink-0 mt-0.5">•</span>
                  <span className="text-sm text-moHei">{suggestion}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </AIModal>
  )
}

export default ContractAI
