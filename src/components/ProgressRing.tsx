import React from 'react'

export type ProgressStatus = 'healthy' | 'warning' | 'danger'

export interface ProgressRingProps {
  progress: number
  status?: ProgressStatus
  size?: number
  showNian?: boolean
  className?: string
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  status = 'healthy',
  size = 120,
  showNian = false,
  className = '',
}) => {
  const statusColors: Record<ProgressStatus, string> = {
    healthy: 'var(--color-zhuQing)',
    warning: 'var(--color-tanHe)',
    danger: 'var(--color-zhuSha)',
  }

  const strokeWidth = 8
  const outerRadius = size / 2 - strokeWidth / 2
  const innerSquareSize = size * 0.35
  const circumference = 2 * Math.PI * outerRadius
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const offset = circumference - (clampedProgress / 100) * circumference
  const center = size / 2

  const segments = 6
  const segmentLabels = ['设计', '拆改', '水电', '泥木', '油漆', '软装']
  const segmentProgress = Math.min(clampedProgress / 100, 1)

  const getSegmentColor = (index: number) => {
    const threshold = (index + 1) / segments
    if (segmentProgress >= threshold) return statusColors[status]
    if (segmentProgress >= index / segments) {
      const segmentFilled = (segmentProgress - index / segments) * segments
      return statusColors[status]
    }
    return 'var(--color-miBai)'
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="var(--color-miBai)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={statusColors[status]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <rect
          x={center - innerSquareSize / 2}
          y={center - innerSquareSize / 2}
          width={innerSquareSize}
          height={innerSquareSize}
          fill="var(--color-miBai)"
          rx="4"
        />
        <rect
          x={center - innerSquareSize / 2}
          y={center - innerSquareSize / 2}
          width={innerSquareSize}
          height={innerSquareSize}
          fill="none"
          stroke={statusColors[status]}
          strokeWidth="2"
          rx="4"
          opacity="0.3"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showNian ? (
          <span className="text-2xl">🐲</span>
        ) : (
          <>
            <span className="text-xl font-bold" style={{ color: statusColors[status] }}>
              {Math.round(clampedProgress)}%
            </span>
          </>
        )}
      </div>

      <div className="absolute -bottom-6 left-0 right-0 flex justify-around">
        {segmentLabels.map((label, index) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="w-2 h-2 rounded-full mb-0.5"
              style={{ backgroundColor: getSegmentColor(index) }}
            />
            <span className="text-xs text-fuZhu">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressRing
