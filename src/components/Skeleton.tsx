import React from 'react'
import { prefersReducedMotion } from '../utils/animations'

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card'
  width?: string | number
  height?: string | number
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseClasses = prefersReducedMotion()
    ? 'bg-gray-200'
    : 'bg-gray-200 relative overflow-hidden'

  const variantClasses: Record<string, string> = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-md',
    card: 'rounded-md h-32',
  }

  const style: React.CSSProperties = {}
  if (width !== undefined) {
    style.width = typeof width === 'number' ? `${width}px` : width
  }
  if (height !== undefined) {
    style.height = typeof height === 'number' ? `${height}px` : height
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {!prefersReducedMotion() && (
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
        />
      )}
    </div>
  )
}

export const SkeletonCard: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-md p-md shadow-card ${className}`}>
      <Skeleton variant="rect" width="100%" height={120} className="mb-md" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
          className={i < lines - 1 ? 'mb-sm' : ''}
        />
      ))}
    </div>
  )
}

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-sm ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-sm">
          <Skeleton variant="circle" width={40} height={40} />
          <div className="flex-1 space-y-xs">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Skeleton
