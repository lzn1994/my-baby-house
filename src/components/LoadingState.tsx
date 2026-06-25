import React from 'react'
import NianAvatar from './NianAvatar'

export interface LoadingStateProps {
  text?: string
  className?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text = '加载中...',
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-lg px-md text-center
        ${className}
      `}
    >
      <div className="mb-md animate-spin">
        <NianAvatar emotion="happy" size="lg" />
      </div>
      <div className="text-sm text-fuZhu animate-pulse">
        {text}
      </div>
    </div>
  )
}

export default LoadingState
