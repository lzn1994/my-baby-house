import React, { useState, useEffect, useCallback } from 'react'
import { addTrackingListener, clearTrackingEvents, getTrackingEvents, type TrackingEvent } from '../utils/tracking'

const TrackingDebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [events, setEvents] = useState<TrackingEvent[]>([])

  const refreshEvents = useCallback(() => {
    setEvents(getTrackingEvents(10))
  }, [])

  useEffect(() => {
    refreshEvents()
    const unsubscribe = addTrackingListener(() => {
      refreshEvents()
    })
    return unsubscribe
  }, [refreshEvents])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const handleClear = () => {
    clearTrackingEvents()
    refreshEvents()
  }

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-sans">
      {isExpanded ? (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-gray-800 text-sm">埋点调试面板</span>
              <span className="text-xs text-gray-500">({events.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                清空
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {events.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                暂无埋点事件
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => console.log('[Tracking Detail]', event)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-daiLan truncate max-w-[180px]">
                      {event.name}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {Object.entries(event.properties)
                      .filter(([key]) => !['appVersion', 'deviceType', 'browser', 'os', 'screenResolution', 'language', 'sessionId'].includes(key))
                      .slice(0, 3)
                      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
                      .join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <p className="text-[10px] text-gray-400 text-center">
              点击事件查看详情 · 最多显示 10 条
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-daiLan text-white px-4 py-2 rounded-full shadow-lg hover:bg-daiLan/90 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          埋点调试
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {events.length}
          </span>
        </button>
      )}
    </div>
  )
}

export default TrackingDebugPanel
