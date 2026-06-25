import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Button from './Button'

export interface DemoFloatingButtonProps {
  onClick?: () => void
  visible?: boolean
}

const DemoFloatingButton: React.FC<DemoFloatingButtonProps> = ({
  onClick,
  visible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const confirmModalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.to(containerRef.current, {
      y: -6,
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  }, [])

  useEffect(() => {
    if (!buttonRef.current || !textRef.current) return

    if (isExpanded) {
      gsap.to(buttonRef.current, {
        width: 160,
        borderRadius: 28,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.25, delay: 0.1, ease: 'power2.out' }
      )
    } else {
      gsap.to(buttonRef.current, {
        width: 56,
        borderRadius: 28,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(textRef.current, {
        opacity: 0,
        x: -10,
        duration: 0.15,
        ease: 'power2.in',
      })
    }
  }, [isExpanded])

  useEffect(() => {
    if (!confirmModalRef.current || !overlayRef.current) return

    if (showConfirm) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        confirmModalRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: 'back.out(1.2)' }
      )
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(confirmModalRef.current, {
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.in',
      })
    }
  }, [showConfirm])

  const handleClick = () => {
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    onClick?.()
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (!visible) return null

  return (
    <>
      <div
        ref={containerRef}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[90]"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button
          ref={buttonRef}
          onClick={handleClick}
          className="relative flex items-center justify-center h-14 bg-zhuSha text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
          style={{ width: 56, borderRadius: 28 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🐲
            </div>
            <span
              ref={textRef}
              className="whitespace-nowrap font-medium text-base opacity-0"
            >
              演示模式
            </span>
          </div>

          <div className="absolute inset-0 rounded-full pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-30" />
          </div>
        </button>
      </div>

      {showConfirm && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-moHei/50 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <div
            ref={confirmModalRef}
            className="bg-nuanBai rounded-xl shadow-2xl p-lg max-w-sm w-[90%] mx-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-md">
              <div className="w-16 h-16 mx-auto mb-md rounded-full bg-zhuSha/10 flex items-center justify-center text-3xl">
                🐲
              </div>
              <h3 className="text-xl font-bold text-moHei mb-sm">开启演示模式</h3>
              <p className="text-sm text-fuZhu leading-relaxed">
                年兽将带你体验装修助手的全部功能，约4分钟的精彩演示~
              </p>
            </div>

            <div className="bg-miBai rounded-md p-md mb-md space-y-sm">
              <div className="flex items-center gap-sm">
                <span className="text-daiLan">🎨</span>
                <span className="text-sm text-moHei">AI风格测试</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-zhuQing">📋</span>
                <span className="text-sm text-moHei">SOP标准流程</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-zhuSha">🤖</span>
                <span className="text-sm text-moHei">AI智能合同鉴别</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-tanHei">💰</span>
                <span className="text-sm text-moHei">智能预算管理</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-daiLan">🔍</span>
                <span className="text-sm text-moHei">AI质量检测</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-zhuSha">🐲</span>
                <span className="text-sm text-moHei">年兽养成系统</span>
              </div>
            </div>

            <div className="flex gap-sm">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={handleCancel}
              >
                稍后再说
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleConfirm}
              >
                开始演示
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DemoFloatingButton
