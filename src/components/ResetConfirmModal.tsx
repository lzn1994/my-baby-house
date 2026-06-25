import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Button from './Button'

export interface ResetConfirmModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return

    if (visible) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        modalRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
        }
      )
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(modalRef.current, {
        y: 10,
        opacity: 0,
        scale: 0.98,
        duration: 0.2,
        ease: 'power2.in',
      })
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-moHei/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        ref={modalRef}
        className="bg-nuanBai rounded-2xl shadow-2xl p-lg max-w-sm w-[90%] mx-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-md">
          <div className="w-16 h-16 mx-auto mb-md rounded-full bg-zhuQing/10 flex items-center justify-center text-3xl">
            ⚠️
          </div>
          <h3 className="text-xl font-bold text-moHei mb-sm">确认重置？</h3>
          <p className="text-sm text-fuZhu leading-relaxed">
            此操作将清除所有进度数据，包括装修风格、预算信息、SOP进度和年兽状态。
            <br />
            <span className="text-zhuQing font-medium">数据无法恢复</span>，请确认是否继续。
          </p>
        </div>

        <div className="flex gap-sm">
          <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>
            取消
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={onConfirm}>
            确认重置
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResetConfirmModal
