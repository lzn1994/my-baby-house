import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Button from './Button'

export type AIType = 'floorplan' | 'contract' | 'quality'
export type AIModalState = 'loading' | 'result' | 'error'

export interface AIModalProps {
  isOpen: boolean
  type?: AIType
  title: string
  state?: AIModalState
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  showConfirm?: boolean
  children: React.ReactNode
}

const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  type = 'floorplan',
  title,
  state = 'result',
  onClose,
  onConfirm,
  confirmText = '确认',
  showConfirm = true,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        modalRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
      )
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(modalRef.current, { y: 100, opacity: 0, duration: 0.25 })
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-moHei/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-nuanBai rounded-t-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-md border-b border-miBai flex-shrink-0">
          <div className="flex items-center gap-sm">
            <span className="text-xl">✨</span>
            <h3 className="text-lg font-bold text-moHei">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-miBai transition-colors text-fuZhu hover:text-moHei"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-md">
          {children}
        </div>

        {showConfirm && (
          <div className="p-md border-t border-miBai bg-miBai/30 flex-shrink-0">
            <Button variant="primary" size="lg" className="w-full" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIModal
