import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export interface NianSpeechProps {
  visible: boolean
  message: string
  position?: 'top' | 'right'
  onComplete?: () => void
}

const encourageMessages = [
  '加油加油！装修一步步来~',
  '你真棒！又进步了一点！',
  '慢慢来，不着急~',
  '有我陪着你呢！',
  '今天也要元气满满哦！',
  '装修这件事，你很有天赋！',
  '一步一个脚印，稳稳的~',
  '我相信你可以的！',
  '哇，好厉害！',
  '继续保持这个节奏！',
]

export function getRandomEncourageMessage(): string {
  return encourageMessages[Math.floor(Math.random() * encourageMessages.length)]
}

const NianSpeech: React.FC<NianSpeechProps> = ({
  visible,
  message,
  position = 'top',
  onComplete,
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bubbleRef.current) return

    if (visible) {
      gsap.fromTo(
        bubbleRef.current,
        { opacity: 0, y: 10, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.5)',
        }
      )

      const timer = setTimeout(() => {
        if (onComplete) {
          gsap.to(bubbleRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onComplete,
          })
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [visible, message, onComplete])

  if (!visible) return null

  const positionClasses =
    position === 'top'
      ? '-top-2 left-1/2 -translate-x-1/2 -translate-y-full'
      : 'top-1/2 left-full -translate-y-1/2 ml-md'

  const arrowClass =
    position === 'top'
      ? '-bottom-2 left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white'
      : '-left-2 top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-white'

  return (
    <div
      ref={bubbleRef}
      className={`absolute ${positionClasses} z-10 pointer-events-none`}
    >
      <div className="bg-white rounded-md shadow-card px-md py-sm max-w-[200px]">
        <p className="text-sm text-moHei leading-relaxed whitespace-nowrap">{message}</p>
      </div>
      <div className={`absolute w-0 h-0 ${arrowClass}`} />
    </div>
  )
}

export default NianSpeech
