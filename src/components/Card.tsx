import React, { useRef, memo, useCallback } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, durations } from '../utils/animations'

export type CardVariant = 'info' | 'warning' | 'success'

export interface CardProps {
  variant?: CardVariant
  title?: string
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = memo(({ variant = 'info', title, children, className = '', hoverable = false, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (!hoverable || prefersReducedMotion() || !cardRef.current) return
    
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }
    
    hoverTweenRef.current = gsap.to(cardRef.current, {
      y: -2,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }, [hoverable])

  const handleMouseLeave = useCallback(() => {
    if (!hoverable || prefersReducedMotion() || !cardRef.current) return
    
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }
    
    hoverTweenRef.current = gsap.to(cardRef.current, {
      y: 0,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }, [hoverable])

  const variantStyles: Record<CardVariant, string> = {
    info: 'bg-white border border-gray-100',
    warning:
      'bg-zhuSha/10 border-l-4 border-l-zhuSha',
    success:
      'bg-zhuQing/10 border-l-4 border-l-zhuQing',
  }

  const titleColors: Record<CardVariant, string> = {
    info: 'text-moHei',
    warning: 'text-zhuSha',
    success: 'text-zhuQing',
  }

  const hoverClasses = hoverable
    ? 'cursor-pointer hover:shadow-hover transition-shadow duration-200 will-change-transform'
    : ''

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-md p-md shadow-card ${variantStyles[variant]} ${hoverClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {title && (
        <h3 className={`text-lg font-semibold mb-sm ${titleColors[variant]}`}>
          {title}
        </h3>
      )}
      <div className="text-base text-moHei">{children}</div>
    </div>
  )
})

export default Card
