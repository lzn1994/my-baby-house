import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import AILoading from '../AILoading'
import AIModal from '../AIModal'
import Card from '../Card'
import { qualityInspectionData } from '../../data/ai-content'
import type { QualityInspectionData } from '../../data/ai-content'

export interface QualityAIProps {
  isOpen: boolean
  stepId: number
  onClose: () => void
  onConfirm?: () => void
}

const QualityAI: React.FC<QualityAIProps> = ({ isOpen, stepId, onClose, onConfirm }) => {
  const [phase, setPhase] = useState<'loading' | 'result'>('loading')
  const resultRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const photoRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])

  const data: QualityInspectionData | undefined = qualityInspectionData[stepId]

  useEffect(() => {
    if (isOpen) {
      setPhase('loading')
      itemRefs.current = []
      boxRefs.current = []
    }
  }, [isOpen, stepId])

  const handleLoadingComplete = () => {
    setPhase('result')
  }

  useEffect(() => {
    if (phase === 'result' && resultRef.current && data) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )

      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' }
        )
      }

      boxRefs.current.forEach((box, index) => {
        if (box) {
          gsap.fromTo(
            box,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              delay: 0.5 + index * 0.15,
              ease: 'back.out(1.5)',
            }
          )
        }
      })

      itemRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              delay: 0.4 + index * 0.1,
              ease: 'power2.out',
            }
          )
        }
      })
    }
  }, [phase, data])

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const getScoreColorClass = (color: string) => {
    switch (color) {
      case 'zhuQing':
        return 'text-zhuQing'
      case 'tanHe':
        return 'text-tanHe'
      case 'zhuSha':
        return 'text-zhuSha'
      default:
        return 'text-daiLan'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <span className="text-zhuQing">✅</span>
      case 'warning':
        return <span className="text-tanHe">⚠️</span>
      case 'fail':
        return <span className="text-zhuSha">❌</span>
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pass':
        return '合格'
      case 'warning':
        return '注意'
      case 'fail':
        return '不合格'
      default:
        return ''
    }
  }

  if (!data) {
    return null
  }

  const photoGradients: Record<number, string> = {
    10: 'linear-gradient(135deg, #4A6FA5 0%, #6B8FB5 50%, #8BA8C5 100%)',
    12: 'linear-gradient(135deg, #5B8C5A 0%, #7BA67A 50%, #9BC09A 100%)',
    13: 'linear-gradient(135deg, #8B6F47 0%, #A68A67 50%, #C1A587 100%)',
    15: 'linear-gradient(135deg, #C84A3E 0%, #D86A5E 50%, #E88A7E 100%)',
  }

  return (
    <AIModal
      isOpen={isOpen}
      title={`AI施工质检 - ${data.stepName}`}
      type="quality"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="验收通过"
      showConfirm={phase === 'result'}
    >
      {phase === 'loading' && (
        <AILoading
          text="AI正在检测施工质量..."
          duration={2}
          onComplete={handleLoadingComplete}
        />
      )}

      {phase === 'result' && data && (
        <div ref={resultRef} className="space-y-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-fuZhu mb-xs">综合评分</div>
              <div className={`text-4xl font-bold ${getScoreColorClass(data.scoreColor)}`}>
                {data.score}
                <span className="text-lg text-fuZhu font-normal">/100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-fuZhu mb-xs">检测项目</div>
              <div className="text-2xl font-bold text-daiLan">
                {data.items.length}
                <span className="text-base text-fuZhu font-normal">项</span>
              </div>
            </div>
          </div>

          <Card variant="info" title="📷 质检照片">
            <div
              ref={photoRef}
              className="relative w-full aspect-video rounded-md overflow-hidden"
              style={{ background: photoGradients[stepId] || photoGradients[10] }}
            >
              {data.detectionBoxes.map((box, index) => (
                <div
                  key={index}
                  ref={(el) => { boxRefs.current[index] = el }}
                  className="absolute border-2 border-zhuQing rounded-sm"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                    boxShadow: '0 0 0 1px rgba(91,140,90,0.3), inset 0 0 20px rgba(91,140,90,0.2)',
                  }}
                >
                  <div className="absolute -top-5 left-0 bg-zhuQing text-white text-xs px-xs py-0.5 rounded-sm whitespace-nowrap">
                    {box.label}
                  </div>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-zhuQing" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-zhuQing" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-zhuQing" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-zhuQing" />
                </div>
              ))}
              <div className="absolute bottom-xs right-xs bg-moHei/60 text-white text-xs px-xs py-0.5 rounded-sm">
                AI识别中
              </div>
            </div>
          </Card>

          <Card variant="info" title="📋 检测项目">
            <div className="space-y-xs">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => { itemRefs.current[index] = el }}
                  className="flex items-center justify-between p-sm bg-miBai rounded-sm hover:bg-nuanBai transition-colors"
                >
                  <div className="flex items-center gap-sm">
                    {getStatusIcon(item.status)}
                    <span className="text-base text-moHei">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    {item.detail && (
                      <span className="text-sm text-tanHe">{item.detail}</span>
                    )}
                    <span className={`text-sm font-medium ${
                      item.status === 'pass' ? 'text-zhuQing' :
                      item.status === 'warning' ? 'text-tanHe' : 'text-zhuSha'
                    }`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </AIModal>
  )
}

export default QualityAI
