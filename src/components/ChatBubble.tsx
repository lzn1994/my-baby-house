import React, { useEffect, useState } from 'react'
import NianAvatar from './NianAvatar'

export type ChatBubbleType = 'nian' | 'user'

export interface ChatBubbleProps {
  type: ChatBubbleType
  content?: string
  children?: React.ReactNode
  className?: string
  delay?: number
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  content,
  children,
  className = '',
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const isNian = type === 'nian'

  return (
    <div
      className={`flex gap-xs mb-md ${
        isNian ? 'justify-start' : 'justify-end'
      } ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      }}
    >
      {isNian && (
        <div className="flex-shrink-0 self-end">
          <NianAvatar size="sm" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-md py-sm text-base ${
          isNian
            ? 'bg-white text-moHei rounded-t-md rounded-r-md rounded-bl-none'
            : 'bg-daiLan text-white rounded-t-md rounded-l-md rounded-br-none'
        } shadow-card`}
      >
        {content && <p>{content}</p>}
        {children}
      </div>
      {!isNian && <div className="flex-shrink-0 w-8" />}
    </div>
  )
}

export default ChatBubble
