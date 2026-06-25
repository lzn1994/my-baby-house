import React from 'react'
import NianAvatar from './NianAvatar'
import Button from './Button'

export interface ErrorStateProps {
  title?: string
  message?: string
  retryText?: string
  onRetry?: () => void
  className?: string
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = '出错了',
  message = '抱歉，出了点小问题，请重试一下吧~',
  retryText = '重新尝试',
  onRetry,
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
      <div className="mb-md">
        <NianAvatar emotion="confused" size="lg" />
      </div>
      <div className="text-base font-medium text-moHei mb-xs">
        {title}
      </div>
      <div className="text-sm text-fuZhu mb-md max-w-xs">
        {message}
      </div>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  )
}

export default ErrorState
