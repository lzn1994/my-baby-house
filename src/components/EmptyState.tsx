import React from 'react'
import NianAvatar from './NianAvatar'
import Button from './Button'

export interface EmptyStateProps {
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description = '这里还没有内容哦~',
  actionText,
  onAction,
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
        <NianAvatar emotion="sleepy" size="lg" />
      </div>
      <div className="text-base font-medium text-moHei mb-xs">
        {title}
      </div>
      <div className="text-sm text-fuZhu mb-md max-w-xs">
        {description}
      </div>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
