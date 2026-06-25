import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import NianAvatar from './NianAvatar'

export interface AILoadingProps {
  text?: string
  duration?: number
  onComplete?: () => void
}

const AILoading: React.FC<AILoadingProps> = ({
  text = 'AI分析中...',
  duration = 2.5,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')
  const inkRing1Ref = useRef<HTMLDivElement>(null)
  const inkRing2Ref = useRef<HTMLDivElement>(null)
  const inkRing3Ref = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    const progressObj = { value: 0 }
    gsap.to(progressObj, {
      value: 100,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(Math.round(progressObj.value))
      },
      onComplete: () => {
        if (!completedRef.current && onComplete) {
          completedRef.current = true
          onComplete()
        }
      },
    })

    return () => {
      gsap.killTweensOf(progressObj)
    }
  }, [duration, onComplete])

  useEffect(() => {
    const rings = [inkRing1Ref.current, inkRing2Ref.current, inkRing3Ref.current]
    rings.forEach((ring, index) => {
      if (ring) {
        gsap.fromTo(
          ring,
          { scale: 0.3, opacity: 0.8 },
          {
            scale: 2.5,
            opacity: 0,
            duration: 2,
            repeat: -1,
            delay: index * 0.6,
            ease: 'power1.out',
          }
        )
      }
    })
  }, [])

  useEffect(() => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, {
        rotation: 360,
        duration: 1.5,
        repeat: -1,
        ease: 'linear',
      })
    }
    return () => {
      if (avatarRef.current) {
        gsap.killTweensOf(avatarRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 400)
    return () => clearInterval(dotInterval)
  }, [])

  useEffect(() => {
    if (progressBarRef.current) {
      const progressInner = progressBarRef.current.querySelector('.brush-progress-inner')
      if (progressInner) {
        gsap.set(progressInner, { width: `${progress}%` })
      }
    }
  }, [progress])

  return (
    <div className="flex flex-col items-center justify-center py-lg">
      <div className="relative w-40 h-40 flex items-center justify-center mb-lg">
        <div
          ref={inkRing1Ref}
          className="absolute w-24 h-24 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(74,111,165,0.3) 0%, rgba(74,111,165,0) 70%)',
          }}
        />
        <div
          ref={inkRing2Ref}
          className="absolute w-28 h-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,111,71,0.25) 0%, rgba(139,111,71,0) 70%)',
          }}
        />
        <div
          ref={inkRing3Ref}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(91,140,90,0.2) 0%, rgba(91,140,90,0) 70%)',
          }}
        />

        <div ref={avatarRef} className="relative z-10">
          <NianAvatar emotion="happy" size="lg" />
        </div>
      </div>

      <p className="text-lg font-medium text-daiLan mb-md">
        {text}{dots}
      </p>

      <div className="w-64">
        <div
          ref={progressBarRef}
          className="relative h-3 bg-miBai rounded-full overflow-hidden"
          style={{
            borderRadius: '20px',
          }}
        >
          <div
            className="brush-progress-inner h-full absolute top-0 left-0"
            style={{
              background: 'linear-gradient(90deg, #4A6FA5 0%, #5B8C5A 100%)',
              borderRadius: '20px',
              width: '0%',
              transition: 'width 0.1s ease-out',
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 256 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0,6 Q32,2 64,6 T128,6 T192,6 T256,6"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex justify-between mt-xs text-sm text-fuZhu">
          <span>分析中</span>
          <span className="font-medium text-daiLan">{progress}%</span>
        </div>
      </div>
    </div>
  )
}

export default AILoading
