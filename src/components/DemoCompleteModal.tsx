import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import Button from './Button'
import NPSSurvey from './NPSSurvey'

export interface DemoCompleteModalProps {
  visible: boolean
  onRestart: () => void
  onExit: () => void
}

const DemoCompleteModal: React.FC<DemoCompleteModalProps> = ({
  visible,
  onRestart,
  onExit,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const [showNPS, setShowNPS] = useState(false)

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return

    if (visible) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      gsap.fromTo(
        modalRef.current,
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out(1.2)',
        }
      )

      if (confettiRef.current) {
        const colors = ['#C84A3E', '#D4AF37', '#5B8C5A', '#4A6FA5', '#8B6F47']
        const pieces: HTMLDivElement[] = []

        for (let i = 0; i < 60; i++) {
          const piece = document.createElement('div')
          piece.style.position = 'absolute'
          piece.style.width = `${Math.random() * 10 + 5}px`
          piece.style.height = `${Math.random() * 10 + 5}px`
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
          piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
          piece.style.left = `${Math.random() * 100}%`
          piece.style.top = '-20px'
          piece.style.opacity = '0'
          confettiRef.current.appendChild(piece)
          pieces.push(piece)

          gsap.fromTo(
            piece,
            {
              y: 0,
              x: 0,
              rotation: 0,
              opacity: 1,
            },
            {
              y: Math.random() * 400 + 200,
              x: Math.random() * 400 - 200,
              rotation: Math.random() * 720 - 360,
              opacity: 0,
              duration: Math.random() * 2 + 2,
              ease: 'power2.out',
              delay: Math.random() * 0.5,
            }
          )
        }

        return () => {
          pieces.forEach((p) => p.remove())
        }
      }
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
      gsap.to(modalRef.current, {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-moHei/60 backdrop-blur-sm overflow-hidden"
      onClick={onExit}
    >
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      <div
        ref={modalRef}
        className="bg-nuanBai rounded-2xl shadow-2xl p-lg max-w-md w-[90%] mx-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-md">
          <div className="w-20 h-20 mx-auto mb-md rounded-full bg-gradient-to-br from-zhuSha to-tanHe flex items-center justify-center text-4xl relative">
            🐲
            <div className="absolute -top-1 -right-1 text-2xl">🎉</div>
          </div>
          <h3 className="text-2xl font-bold text-moHei mb-sm">演示完成！</h3>
          <p className="text-base text-fuZhu leading-relaxed">
            感谢你体验装修助手的演示！
            <br />
            年兽已经迫不及待要陪你一起装修新家了~
          </p>
        </div>

        <div className="bg-miBai rounded-xl p-md mb-md space-y-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fuZhu">演示章节</span>
            <span className="text-sm font-semibold text-moHei">6 / 6</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fuZhu">总时长</span>
            <span className="text-sm font-semibold text-moHei">约 4 分钟</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fuZhu">解锁功能</span>
            <span className="text-sm font-semibold text-zhuQing">全部体验</span>
          </div>
        </div>

        <div className="flex gap-sm mb-sm">
          <Button variant="secondary" size="md" className="flex-1" onClick={onExit}>
            返回首页
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={onRestart}>
            再看一遍
          </Button>
        </div>

        <Button
          variant="text"
          size="sm"
          className="w-full text-daiLan"
          onClick={() => setShowNPS(true)}
        >
          📊 参与满意度调查
        </Button>
      </div>

      <NPSSurvey
        visible={showNPS}
        onClose={() => setShowNPS(false)}
        onSubmit={() => {}}
      />
    </div>
  )
}

export default DemoCompleteModal
