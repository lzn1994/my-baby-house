import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/animations'

export interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useScrollAnimation = <T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (prefersReducedMotion()) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (triggerOnce && hasTriggeredRef.current) return
            setIsVisible(true)
            hasTriggeredRef.current = true
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}

export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up')
      setScrollY(currentScrollY)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, scrollDirection }
}
