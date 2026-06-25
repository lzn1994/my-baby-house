import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import AILoading from '../AILoading'
import AIModal from '../AIModal'
import Card from '../Card'
import { floorPlanData } from '../../data/ai-content'
import { useAppState } from '../../hooks/useAppState'

export interface FloorPlanAIProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

const FloorPlanAI: React.FC<FloorPlanAIProps> = ({ isOpen, onClose, onConfirm }) => {
  const { setUserSession } = useAppState()
  const [phase, setPhase] = useState<'loading' | 'result'>('loading')
  const resultRef = useRef<HTMLDivElement>(null)
  const roomItemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setPhase('loading')
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

      roomItemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              delay: 0.2 + index * 0.08,
              ease: 'power2.out',
            }
          )
        }
      })
    }
  }, [phase])

  const handleConfirm = () => {
    setUserSession({
      floorPlan: {
        rooms: 3,
        area: floorPlanData.totalArea,
      },
      area: floorPlanData.totalArea,
    })
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const roomColors = [
    'bg-daiLan/20 border-daiLan/40',
    'bg-zhuSha/20 border-zhuSha/40',
    'bg-zhuQing/20 border-zhuQing/40',
    'bg-tanHe/20 border-tanHe/40',
    'bg-daiLan/15 border-daiLan/30',
    'bg-zhuQing/15 border-zhuQing/30',
    'bg-tanHe/15 border-tanHe/30',
  ]

  return (
    <AIModal
      isOpen={isOpen}
      title="AI户型识别"
      type="floorplan"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="确认结果"
      showConfirm={phase === 'result'}
    >
      {phase === 'loading' && (
        <AILoading
          text="AI正在识别户型图..."
          duration={2}
          onComplete={handleLoadingComplete}
        />
      )}

      {phase === 'result' && (
        <div ref={resultRef} className="space-y-md">
          <Card variant="success" title="识别结果">
            <div className="flex items-center justify-around mb-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-daiLan">{floorPlanData.layout}</div>
                <div className="text-sm text-fuZhu">户型格局</div>
              </div>
              <div className="w-px h-10 bg-miBai" />
              <div className="text-center">
                <div className="text-2xl font-bold text-zhuSha">{floorPlanData.totalArea}㎡</div>
                <div className="text-sm text-fuZhu">建筑面积</div>
              </div>
              <div className="w-px h-10 bg-miBai" />
              <div className="text-center">
                <div className="text-2xl font-bold text-zhuQing">{floorPlanData.innerArea}㎡</div>
                <div className="text-sm text-fuZhu">套内面积</div>
              </div>
            </div>
          </Card>

          <Card variant="info" title="户型示意图">
            <div className="relative w-full aspect-square bg-miBai rounded-md p-sm border border-gray-200">
              {floorPlanData.rooms.map((room, index) => (
                <div
                  key={`room-${index}`}
                  className={`absolute border-2 rounded-sm flex flex-col items-center justify-center ${roomColors[index % roomColors.length]}`}
                  style={{
                    left: `${room.position.x}%`,
                    top: `${room.position.y}%`,
                    width: `${room.position.w}%`,
                    height: `${room.position.h}%`,
                  }}
                >
                  <span className="text-xs font-medium text-moHei">{room.name}</span>
                  <span className="text-xs text-fuZhu">{room.area}㎡</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="info" title="房间明细">
            <div className="space-y-xs">
              {floorPlanData.rooms.map((room, index) => (
                <div
                  key={`room-detail-${index}`}
                  ref={(el) => { roomItemsRef.current[index] = el }}
                  className="flex items-center justify-between p-sm bg-miBai rounded-sm hover:bg-nuanBai transition-colors"
                >
                  <div className="flex items-center gap-sm">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: [
                          '#4A6FA5', '#C84A3E', '#5B8C5A', '#8B6F47',
                          '#4A6FA5', '#5B8C5A', '#8B6F47',
                        ][index % 7],
                      }}
                    />
                    <span className="text-base text-moHei">{room.name}</span>
                  </div>
                  <span className="text-base font-medium text-daiLan">{room.area}㎡</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </AIModal>
  )
}

export default FloorPlanAI
