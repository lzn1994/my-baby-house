import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, durations } from '../utils/animations'

export type Emotion = 'happy' | 'sleepy' | 'confused' | 'worried' | 'excited' | 'thinking' | 'surprised' | 'satisfied'
export type AvatarSize = 'sm' | 'md' | 'lg'
export type AnimationMode = 'idle' | 'breathe' | 'bounce' | 'shake' | 'swing' | 'pulse'

export interface NianAvatarProps {
  emotion?: Emotion
  size?: AvatarSize
  animation?: AnimationMode
  pulse?: boolean
  className?: string
  onClick?: () => void
}

const NianAvatar: React.FC<NianAvatarProps> = ({
  emotion = 'happy',
  size = 'md',
  animation = 'breathe',
  pulse = false,
  className = '',
  onClick,
}) => {
  const avatarRef = useRef<HTMLDivElement>(null)
  const emotionRef = useRef(emotion)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const sizeMap: Record<AvatarSize, string> = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  }

  const emotionEmojis: Record<Emotion, string> = {
    happy: '🐲',
    sleepy: '😴',
    confused: '❓',
    worried: '😰',
    excited: '🤩',
    thinking: '🤔',
    surprised: '😲',
    satisfied: '🥰',
  }

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    if (prefersReducedMotion()) return

    gsap.set(avatar, { clearProps: 'transform' })

    const effectiveAnimation = pulse ? 'pulse' : animation

    switch (effectiveAnimation) {
      case 'breathe': {
        const tl = gsap.timeline({ repeat: -1, yoyo: true })
        tl.to(avatar, {
          y: -3,
          scale: 1.03,
          duration: 2,
          ease: 'sine.inOut',
        })
        tlRef.current = tl
        break
      }
      case 'bounce': {
        const tl = gsap.timeline({ repeat: -1 })
        tl.to(avatar, {
          y: -8,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        })
        tl.to(avatar, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'bounce.out',
        })
        tl.to({}, { duration: 0.8 })
        tlRef.current = tl
        break
      }
      case 'shake': {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
        tl.to(avatar, {
          x: 3,
          rotation: 5,
          duration: 0.08,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 5,
        })
        tlRef.current = tl
        break
      }
      case 'swing': {
        const tl = gsap.timeline({ repeat: -1, yoyo: true })
        tl.to(avatar, {
          rotation: -6,
          x: -2,
          duration: 0.6,
          ease: 'sine.inOut',
        })
        tl.to(avatar, {
          rotation: 6,
          x: 2,
          duration: 0.6,
          ease: 'sine.inOut',
        })
        tlRef.current = tl
        break
      }
      case 'pulse': {
        const tl = gsap.timeline({ repeat: -1, yoyo: true })
        tl.to(avatar, {
          scale: 1.08,
          duration: 0.8,
          ease: 'sine.inOut',
        })
        tlRef.current = tl
        break
      }
      default:
        break
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [animation, pulse])

  useEffect(() => {
    if (emotion === emotionRef.current) return

    const avatar = avatarRef.current
    if (!avatar || prefersReducedMotion()) {
      emotionRef.current = emotion
      return
    }

    const tl = gsap.timeline()
    tl.to(avatar, {
      scale: 0.8,
      rotation: -10,
      duration: 0.15,
      ease: 'power2.in',
    })
    tl.call(() => {
      emotionRef.current = emotion
    })
    tl.to(avatar, {
      scale: 1,
      rotation: 0,
      duration: 0.25,
      ease: 'back.out(2)',
    })
  }, [emotion])

  const handleClick = () => {
    if (!onClick) return

    const avatar = avatarRef.current
    if (avatar && !prefersReducedMotion()) {
      gsap.fromTo(
        avatar,
        { scale: 1, y: 0 },
        {
          y: -6,
          scale: 1.1,
          duration: durations.fast,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      )
    }
    onClick()
  }

  return (
    <div
      ref={avatarRef}
      onClick={handleClick}
      className={`rounded-full bg-zhuSha flex items-center justify-center select-none will-change-transform ${sizeMap[size]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <span role="img" aria-label={emotion} className="pointer-events-none">
        {emotionEmojis[emotion]}
      </span>
    </div>
  )
}

export default NianAvatar
