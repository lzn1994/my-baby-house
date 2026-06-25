import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export interface SpotlightProps {
  visible: boolean
  targetSelector?: string
  targetRect?: { x: number; y: number; width: number; height: number }
  padding?: number
  borderRadius?: number
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  message?: string
  showArrow?: boolean
  onClick?: () => void
}

const Spotlight: React.FC<SpotlightProps> = ({
  visible,
  targetSelector,
  targetRect,
  padding = 8,
  borderRadius = 8,
  position = 'top',
  message,
  showArrow = true,
  onClick,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  useEffect(() => {
    if (!visible) {
      setRect(null)
      return
    }

    const updateRect = () => {
      if (targetRect) {
        setRect({
          x: targetRect.x - padding,
          y: targetRect.y - padding,
          width: targetRect.width + padding * 2,
          height: targetRect.height + padding * 2,
        })
      } else if (targetSelector) {
        const el = document.querySelector(targetSelector) as HTMLElement
        if (el) {
          const r = el.getBoundingClientRect()
          setRect({
            x: r.left - padding,
            y: r.top - padding,
            width: r.width + padding * 2,
            height: r.height + padding * 2,
          })
        } else {
          const vw = window.innerWidth
          const vh = window.innerHeight
          setRect({
            x: vw / 2 - 100,
            y: vh / 2 - 100,
            width: 200,
            height: 200,
          })
        }
      } else {
        const vw = window.innerWidth
        const vh = window.innerHeight
        setRect({
          x: vw / 2 - 100,
          y: vh / 2 - 100,
          width: 200,
          height: 200,
        })
      }
    }

    updateRect()

    if (targetSelector) {
      window.addEventListener('resize', updateRect)
      window.addEventListener('scroll', updateRect, true)
      return () => {
        window.removeEventListener('resize', updateRect)
        window.removeEventListener('scroll', updateRect, true)
      }
    }
  }, [visible, targetSelector, targetRect, padding])

  useEffect(() => {
    if (!overlayRef.current) return

    if (visible) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
    }
  }, [visible])

  useEffect(() => {
    if (!highlightRef.current || !rect) return

    gsap.to(highlightRef.current, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      borderRadius: borderRadius,
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [rect, borderRadius])

  useEffect(() => {
    if (!highlightRef.current || !visible) return

    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(highlightRef.current, {
      boxShadow: '0 0 0 3px rgba(200, 74, 62, 0.6), 0 0 20px rgba(200, 74, 62, 0.4)',
      duration: 1.5,
      ease: 'sine.inOut',
    })

    return () => {
      tl.kill()
    }
  }, [visible])

  useEffect(() => {
    if (!bubbleRef.current || !rect || !visible) return

    let bubbleX = 0
    let bubbleY = 0
    let arrowX = 0
    let arrowY = 0

    const bubble = bubbleRef.current
    const bubbleWidth = bubble.offsetWidth || 280
    const bubbleHeight = bubble.offsetHeight || 80

    switch (position) {
      case 'top':
        bubbleX = rect.x + rect.width / 2 - bubbleWidth / 2
        bubbleY = rect.y - bubbleHeight - 16
        arrowX = bubbleWidth / 2
        arrowY = bubbleHeight
        break
      case 'bottom':
        bubbleX = rect.x + rect.width / 2 - bubbleWidth / 2
        bubbleY = rect.y + rect.height + 16
        arrowX = bubbleWidth / 2
        arrowY = 0
        break
      case 'left':
        bubbleX = rect.x - bubbleWidth - 16
        bubbleY = rect.y + rect.height / 2 - bubbleHeight / 2
        arrowX = bubbleWidth
        arrowY = bubbleHeight / 2
        break
      case 'right':
        bubbleX = rect.x + rect.width + 16
        bubbleY = rect.y + rect.height / 2 - bubbleHeight / 2
        arrowX = 0
        arrowY = bubbleHeight / 2
        break
      case 'center':
        bubbleX = rect.x + rect.width / 2 - bubbleWidth / 2
        bubbleY = rect.y + rect.height / 2 - bubbleHeight / 2
        break
    }

    const vw = window.innerWidth
    const vh = window.innerHeight
    bubbleX = Math.max(16, Math.min(bubbleX, vw - bubbleWidth - 16))
    bubbleY = Math.max(16, Math.min(bubbleY, vh - bubbleHeight - 16))

    gsap.to(bubbleRef.current, {
      x: bubbleX,
      y: bubbleY,
      duration: 0.5,
      ease: 'power2.out',
    })

    if (arrowRef.current) {
      gsap.set(arrowRef.current, {
        left: position === 'right' ? -8 : position === 'left' ? 'auto' : arrowX,
        right: position === 'left' ? -8 : 'auto',
        top: position === 'bottom' ? -8 : position === 'top' ? 'auto' : arrowY,
        bottom: position === 'top' ? -8 : 'auto',
      })
    }
  }, [rect, position, visible])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-moHei/60 backdrop-blur-[2px]"
        style={{
          clipPath: rect
            ? `polygon(
                0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                ${rect.x}px ${rect.y}px,
                ${rect.x}px ${rect.y + rect.height}px,
                ${rect.x + rect.width}px ${rect.y + rect.height}px,
                ${rect.x + rect.width}px ${rect.y}px,
                ${rect.x}px ${rect.y}px
              )`
            : 'none',
        }}
      />

      <div
        ref={highlightRef}
        className="absolute pointer-events-none"
        style={{
          border: '2px solid #C84A3E',
          boxShadow: '0 0 0 2px rgba(200, 74, 62, 0.4), inset 0 0 20px rgba(200, 74, 62, 0.1)',
          x: -1000,
          y: -1000,
        }}
      />

      {message && (
        <div
          ref={bubbleRef}
          className="absolute max-w-[280px] bg-white rounded-lg shadow-2xl p-md pointer-events-auto"
          style={{ x: -1000, y: -1000 }}
        >
          {showArrow && position !== 'center' && (
            <div
              ref={arrowRef}
              className="absolute w-4 h-4 bg-white rotate-45"
              style={{
                boxShadow: position === 'right' || position === 'bottom' ? '-2px -2px 4px rgba(0,0,0,0.05)' : '2px 2px 4px rgba(0,0,0,0.05)',
              }}
            />
          )}
          <div className="flex items-start gap-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zhuSha flex items-center justify-center text-white text-lg">
              🐲
            </div>
            <div className="flex-1">
              <p className="text-sm text-moHei leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Spotlight
