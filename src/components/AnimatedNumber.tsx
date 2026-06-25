import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, easings } from '../utils/animations'

export interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
  useThousandSeparator?: boolean
  className?: string
  ease?: string
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1.5,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  useThousandSeparator = false,
  className = '',
  ease = easings.standard,
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const valueRef = useRef({ value: 0 })
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const prevValueRef = useRef(0)

  const formatNumber = (val: number): string => {
    let formatted = val.toFixed(decimals)
    if (useThousandSeparator) {
      const parts = formatted.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      formatted = parts.join('.')
    }
    return prefix + formatted + suffix
  }

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayValue(value)
      return
    }

    if (tweenRef.current) {
      tweenRef.current.kill()
    }

    const startValue = prevValueRef.current || 0
    valueRef.current.value = startValue
    setDisplayValue(startValue)

    tweenRef.current = gsap.to(valueRef.current, {
      value,
      duration,
      delay,
      ease,
      onUpdate: () => {
        setDisplayValue(valueRef.current.value)
      },
      onComplete: () => {
        prevValueRef.current = value
      },
      snap: decimals === 0 ? { value: 1 } : undefined,
    })

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [value, duration, delay, decimals, ease])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatNumber(displayValue)}
    </span>
  )
}

export default AnimatedNumber
