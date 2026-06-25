import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, durations } from '../utils/animations'

export interface ImageOptionProps {
  id: string
  label: string
  emoji: string
  bgColor: string
  selected?: boolean
  onClick?: (id: string) => void
  className?: string
}

export const ImageOption: React.FC<ImageOptionProps> = ({
  id,
  label,
  emoji,
  bgColor,
  selected = false,
  onClick,
  className = '',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const prevSelectedRef = useRef(selected)

  useEffect(() => {
    if (selected && !prevSelectedRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.95 },
        { scale: 1, duration: durations.fast, ease: 'back.out(2)' }
      )
    }
    prevSelectedRef.current = selected
  }, [selected])

  const handleMouseEnter = () => {
    if (prefersReducedMotion()) return
    gsap.to(btnRef.current, {
      y: -2,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return
    gsap.to(btnRef.current, {
      y: 0,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  return (
    <button
      ref={btnRef}
      onClick={() => onClick?.(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-md overflow-hidden transition-all duration-200 hover:shadow-hover will-change-transform ${
        selected ? 'ring-2 ring-daiLan ring-offset-2' : ''
      } ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="aspect-square flex flex-col items-center justify-center p-sm">
        <span className="text-4xl mb-sm">{emoji}</span>
        <span className="text-sm text-moHei font-medium text-center">{label}</span>
      </div>
    </button>
  )
}

export interface TextOptionProps {
  id: string
  label: string
  selected?: boolean
  onClick?: (id: string) => void
  className?: string
}

export const TextOption: React.FC<TextOptionProps> = ({
  id,
  label,
  selected = false,
  onClick,
  className = '',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const prevSelectedRef = useRef(selected)

  useEffect(() => {
    if (selected && !prevSelectedRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.98 },
        { scale: 1, duration: durations.fast, ease: 'back.out(1.5)' }
      )
    }
    prevSelectedRef.current = selected
  }, [selected])

  const handleMouseEnter = () => {
    if (prefersReducedMotion() || selected) return
    gsap.to(btnRef.current, {
      x: 4,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return
    gsap.to(btnRef.current, {
      x: 0,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  return (
    <button
      ref={btnRef}
      onClick={() => onClick?.(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`w-full flex items-center gap-md p-md rounded-md bg-white border transition-all duration-200 hover:bg-miBai hover:border-daiLan/30 will-change-transform min-h-[44px] ${
        selected ? 'border-daiLan bg-daiLan/5' : 'border-gray-200'
      } ${className}`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          selected ? 'border-daiLan bg-daiLan' : 'border-gray-300'
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <span className="text-base text-moHei text-left">{label}</span>
    </button>
  )
}

export interface ChipButtonProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const ChipButton: React.FC<ChipButtonProps> = ({
  label,
  selected = false,
  onClick,
  className = '',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const prevSelectedRef = useRef(selected)

  useEffect(() => {
    if (selected && !prevSelectedRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.9 },
        { scale: 1, duration: durations.fast, ease: 'back.out(2)' }
      )
    }
    prevSelectedRef.current = selected
  }, [selected])

  const handleMouseEnter = () => {
    if (prefersReducedMotion() || selected) return
    gsap.to(btnRef.current, {
      y: -1,
      scale: 1.02,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return
    gsap.to(btnRef.current, {
      y: 0,
      scale: 1,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`px-md py-sm rounded-full text-sm font-medium transition-all duration-200 will-change-transform min-h-[44px] ${
        selected
          ? 'bg-daiLan text-white shadow-card'
          : 'bg-white text-moHei border border-gray-200 hover:border-daiLan/50 hover:text-daiLan hover:shadow-hover'
      } ${className}`}
    >
      {label}
    </button>
  )
}

export interface MultiSelectOptionProps {
  id: string
  label: string
  icon?: string
  selected?: boolean
  onClick?: (id: string) => void
  className?: string
}

export const MultiSelectOption: React.FC<MultiSelectOptionProps> = ({
  id,
  label,
  icon,
  selected = false,
  onClick,
  className = '',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const prevSelectedRef = useRef(selected)

  useEffect(() => {
    if (selected && !prevSelectedRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.98 },
        { scale: 1, duration: durations.fast, ease: 'back.out(1.5)' }
      )
    }
    prevSelectedRef.current = selected
  }, [selected])

  const handleMouseEnter = () => {
    if (prefersReducedMotion()) return
    gsap.to(btnRef.current, {
      y: -1,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return
    gsap.to(btnRef.current, {
      y: 0,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }

  return (
    <button
      ref={btnRef}
      onClick={() => onClick?.(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex items-center gap-sm px-md py-sm rounded-md border transition-all duration-200 will-change-transform min-h-[44px] ${
        selected
          ? 'border-daiLan bg-daiLan/5 text-daiLan shadow-card'
          : 'border-gray-200 bg-white text-moHei hover:border-daiLan/30 hover:shadow-hover'
      } ${className}`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`ml-auto w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          selected ? 'border-daiLan bg-daiLan' : 'border-gray-300'
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  )
}
