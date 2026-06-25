import { gsap } from 'gsap'

export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
}

export const easings = {
  standard: 'power2.out',
  in: 'power2.in',
  inOut: 'power2.inOut',
  back: 'back.out(1.2)',
  bounce: 'bounce.out',
  elastic: 'elastic.out(1, 0.5)',
  sine: 'sine.inOut',
}

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const getAnimationConfig = <T extends gsap.TweenVars>(config: T): T => {
  if (prefersReducedMotion()) {
    return { ...config, duration: 0, delay: 0 } as T
  }
  return config
}

export const fadeIn = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.standard, onComplete } = options
  return gsap.fromTo(
    target,
    { opacity: 0 },
    getAnimationConfig({ opacity: 1, duration, delay, ease, onComplete })
  )
}

export const fadeOut = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.standard, onComplete } = options
  return gsap.to(target, getAnimationConfig({ opacity: 0, duration, delay, ease, onComplete }))
}

export const slideInUp = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; distance?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.standard, distance = 30, onComplete } = options
  return gsap.fromTo(
    target,
    { opacity: 0, y: distance },
    getAnimationConfig({ opacity: 1, y: 0, duration, delay, ease, onComplete })
  )
}

export const slideInDown = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; distance?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.standard, distance = 30, onComplete } = options
  return gsap.fromTo(
    target,
    { opacity: 0, y: -distance },
    getAnimationConfig({ opacity: 1, y: 0, duration, delay, ease, onComplete })
  )
}

export const slideInLeft = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; distance?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.standard, distance = 30, onComplete } = options
  return gsap.fromTo(
    target,
    { opacity: 0, x: -distance },
    getAnimationConfig({ opacity: 1, x: 0, duration, delay, ease, onComplete })
  )
}

export const slideInRight = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; distance?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.standard, distance = 30, onComplete } = options
  return gsap.fromTo(
    target,
    { opacity: 0, x: distance },
    getAnimationConfig({ opacity: 1, x: 0, duration, delay, ease, onComplete })
  )
}

export const scaleIn = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; ease?: string; fromScale?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.normal, delay = 0, ease = easings.back, fromScale = 0.8, onComplete } = options
  return gsap.fromTo(
    target,
    { opacity: 0, scale: fromScale },
    getAnimationConfig({ opacity: 1, scale: 1, duration, delay, ease, onComplete })
  )
}

export const bounce = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; distance?: number; repeat?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.slow, delay = 0, distance = -20, repeat = 0, onComplete } = options
  return gsap.fromTo(
    target,
    { y: 0 },
    getAnimationConfig({
      y: distance,
      duration: duration / 2,
      delay,
      ease: 'power2.out',
      yoyo: true,
      repeat: repeat * 2 + 1,
      onComplete,
    })
  )
}

export const pulse = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; scale?: number; repeat?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.slow, delay = 0, scale = 1.05, repeat = -1, onComplete } = options
  return gsap.fromTo(
    target,
    { scale: 1 },
    getAnimationConfig({
      scale,
      duration: duration / 2,
      delay,
      ease: 'sine.inOut',
      yoyo: true,
      repeat,
      onComplete,
    })
  )
}

export const staggerList = (
  targets: gsap.TweenTarget,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
    duration?: number
    stagger?: number
    delay?: number
    ease?: string
    distance?: number
    onComplete?: () => void
  } = {}
): gsap.core.Timeline => {
  const {
    direction = 'up',
    duration = durations.normal,
    stagger = 0.08,
    delay = 0,
    ease = easings.standard,
    distance = 20,
    onComplete,
  } = options

  const tl = gsap.timeline({ delay, onComplete })

  const fromVars: gsap.TweenVars = { opacity: 0 }

  switch (direction) {
    case 'up':
      fromVars.y = distance
      break
    case 'down':
      fromVars.y = -distance
      break
    case 'left':
      fromVars.x = -distance
      break
    case 'right':
      fromVars.x = distance
      break
    case 'scale':
      fromVars.scale = 0.9
      break
  }

  if (prefersReducedMotion()) {
    tl.to(targets, { opacity: 1, duration: 0, stagger: 0 })
  } else {
    tl.fromTo(targets, fromVars, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      stagger,
      ease,
    })
  }

  return tl
}

export const shake = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; intensity?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = 0.5, delay = 0, intensity = 5, onComplete } = options
  return gsap.fromTo(
    target,
    { x: 0 },
    getAnimationConfig({
      x: intensity,
      duration: duration / 10,
      delay,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 9,
      onComplete,
    })
  )
}

export const swing = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; angle?: number; repeat?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = durations.slow, delay = 0, angle = 5, repeat = -1, onComplete } = options
  return gsap.fromTo(
    target,
    { rotation: -angle },
    getAnimationConfig({
      rotation: angle,
      duration: duration / 2,
      delay,
      ease: 'sine.inOut',
      yoyo: true,
      repeat,
      onComplete,
    })
  )
}

export const float = (
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; distance?: number; onComplete?: () => void } = {}
): gsap.core.Tween => {
  const { duration = 2, delay = 0, distance = 8, onComplete } = options
  return gsap.fromTo(
    target,
    { y: 0 },
    getAnimationConfig({
      y: -distance,
      duration: duration / 2,
      delay,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      onComplete,
    })
  )
}

export const heartParticles = (
  container: HTMLElement,
  options: { count?: number; color?: string } = {}
): void => {
  const { count = 8, color = '#C84A3E' } = options

  if (prefersReducedMotion()) return

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.textContent = '❤'
    particle.style.position = 'absolute'
    particle.style.fontSize = `${Math.random() * 12 + 12}px`
    particle.style.color = color
    particle.style.left = '50%'
    particle.style.bottom = '50%'
    particle.style.pointerEvents = 'none'
    particle.style.willChange = 'transform, opacity'
    container.appendChild(particle)

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const distance = Math.random() * 60 + 40
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance - 30

    gsap.fromTo(
      particle,
      { x: 0, y: 0, opacity: 1, scale: 0.5 },
      {
        x,
        y,
        opacity: 0,
        scale: 1.2,
        duration: 1.2 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove()
        },
      }
    )
  }
}

export const coinParticles = (
  container: HTMLElement,
  options: { count?: number } = {}
): void => {
  const { count = 5 } = options

  if (prefersReducedMotion()) return

  for (let i = 0; i < count; i++) {
    const coin = document.createElement('div')
    coin.textContent = '🪙'
    coin.style.position = 'absolute'
    coin.style.fontSize = `${Math.random() * 8 + 16}px`
    coin.style.left = `${30 + Math.random() * 40}%`
    coin.style.top = '-20px'
    coin.style.pointerEvents = 'none'
    coin.style.willChange = 'transform, opacity'
    container.appendChild(coin)

    const xOffset = (Math.random() - 0.5) * 80
    const rotation = Math.random() * 720 - 360

    gsap.fromTo(
      coin,
      { y: 0, x: 0, rotation: 0, opacity: 1 },
      {
        y: 120 + Math.random() * 40,
        x: xOffset,
        rotation,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power2.in',
        delay: i * 0.1,
        onComplete: () => {
          coin.remove()
        },
      }
    )
  }
}

export const rippleEffect = (
  container: HTMLElement,
  x: number,
  y: number,
  options: { color?: string; size?: number; duration?: number } = {}
): void => {
  const { color = 'rgba(74, 111, 165, 0.3)', size = 100, duration = 0.6 } = options

  if (prefersReducedMotion()) return

  const ripple = document.createElement('div')
  ripple.style.position = 'absolute'
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.width = '0'
  ripple.style.height = '0'
  ripple.style.borderRadius = '50%'
  ripple.style.backgroundColor = color
  ripple.style.pointerEvents = 'none'
  ripple.style.transform = 'translate(-50%, -50%)'
  ripple.style.willChange = 'width, height, opacity'
  container.appendChild(ripple)

  gsap.to(ripple, {
    width: size,
    height: size,
    opacity: 0,
    duration,
    ease: 'power2.out',
    onComplete: () => {
      ripple.remove()
    },
  })
}

export const numberTween = (
  target: { value: number },
  endValue: number,
  options: {
    duration?: number
    ease?: string
    delay?: number
    onUpdate?: (value: number) => void
    onComplete?: () => void
    prefix?: string
    suffix?: string
    decimals?: number
    useThousandSeparator?: boolean
  } = {}
): gsap.core.Tween => {
  const {
    duration = 1.5,
    ease = easings.standard,
    delay = 0,
    onUpdate,
    onComplete,
    prefix = '',
    suffix = '',
    decimals = 0,
    useThousandSeparator = false,
  } = options

  const formatNumber = (val: number): string => {
    let formatted = val.toFixed(decimals)
    if (useThousandSeparator) {
      const parts = formatted.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      formatted = parts.join('.')
    }
    return prefix + formatted + suffix
  }

  return gsap.to(target, {
    value: endValue,
    duration,
    delay,
    ease,
    onUpdate: () => {
      onUpdate?.(target.value)
    },
    onComplete,
    snap: decimals === 0 ? { value: 1 } : undefined,
  })
}

export const killTweensOf = (target: gsap.TweenTarget): void => {
  gsap.killTweensOf(target)
}

export const clearProps = (target: gsap.TweenTarget, props?: string): void => {
  gsap.set(target, { clearProps: props || 'all' })
}

export const setWillChange = (target: HTMLElement | HTMLElement[], properties: string[] = ['transform', 'opacity']): void => {
  const elements = Array.isArray(target) ? target : [target]
  elements.forEach((el) => {
    if (el && el.style) {
      el.style.willChange = properties.join(', ')
    }
  })
}

export const clearWillChange = (target: HTMLElement | HTMLElement[]): void => {
  const elements = Array.isArray(target) ? target : [target]
  elements.forEach((el) => {
    if (el && el.style) {
      el.style.willChange = ''
    }
  })
}
