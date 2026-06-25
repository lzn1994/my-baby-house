import React, { useRef, memo, useCallback } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, durations } from '../utils/animations'

export type ButtonVariant = 'primary' | 'secondary' | 'text'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = memo(({ variant = 'primary', size = 'md', disabled = false, onClick, children, className = '' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (disabled || prefersReducedMotion() || !buttonRef.current) return
    
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }
    
    hoverTweenRef.current = gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }, [disabled])

  const handleMouseLeave = useCallback(() => {
    if (disabled || prefersReducedMotion() || !buttonRef.current) return
    
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }
    
    hoverTweenRef.current = gsap.to(buttonRef.current, {
      scale: 1,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }, [disabled])

  const handleMouseDown = useCallback(() => {
    if (disabled || prefersReducedMotion() || !buttonRef.current) return
    
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }
    
    hoverTweenRef.current = gsap.to(buttonRef.current, {
      scale: 0.97,
      duration: 0.1,
      ease: 'power2.in',
    })
  }, [disabled])

  const handleMouseUp = useCallback(() => {
    if (disabled || prefersReducedMotion() || !buttonRef.current) return
    
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }
    
    hoverTweenRef.current = gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: durations.fast,
      ease: 'power2.out',
    })
  }, [disabled])

  const baseClasses = 'font-medium rounded-sm transition-shadow duration-200 inline-flex items-center justify-center select-none will-change-transform'

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-sm py-xs text-sm min-h-[44px]',
    md: 'px-md py-sm text-base min-h-[44px]',
    lg: 'px-lg py-md text-lg min-h-[48px]',
  }

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-daiLan text-white shadow-card hover:shadow-hover active:brightness-95',
    secondary:
      'bg-miBai text-daiLan border border-daiLan hover:bg-nuanBai hover:shadow-hover active:bg-miBai',
    text:
      'bg-transparent text-daiLan hover:bg-miBai active:bg-miBai/70',
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none'

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseLeave}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
    >
      {children}
    </button>
  )
})

export default Button
