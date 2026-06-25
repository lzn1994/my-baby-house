import React, { memo, useCallback } from 'react'
import { useAppState } from '../hooks/useAppState'
import type { AppView } from '../types'

interface NavItem {
  id: AppView
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { id: 'onboarding', label: '首页', icon: '🏠' },
  { id: 'sop', label: 'SOP流程', icon: '📋' },
  { id: 'budget', label: '预算管理', icon: '💰' },
  { id: 'nian', label: '年兽养成', icon: '🦁' },
]

interface BottomNavProps {
  position?: 'top' | 'bottom'
  className?: string
  onSettingsClick?: () => void
}

const BottomNav: React.FC<BottomNavProps> = memo(({ position = 'top', className = '', onSettingsClick }) => {
  const { state, setView } = useAppState()

  const handleNavClick = useCallback((view: AppView) => {
    if (view !== state.currentView) {
      setView(view)
    }
  }, [state.currentView, setView])

  const isActive = useCallback((view: AppView) => {
    if (view === 'sop') {
      return state.currentView === 'sop' || state.currentView === 'demo'
    }
    return state.currentView === view
  }, [state.currentView])

  const positionClasses =
    position === 'top'
      ? 'top-0 left-0 right-0 border-b border-gray-200'
      : 'bottom-0 left-0 right-0 border-t border-gray-200'

  const isBottom = position === 'bottom'

  return (
    <nav
      className={`fixed ${positionClasses} z-40 h-16 bg-miBai/90 backdrop-blur-md ${className}`}
    >
      <div className={`h-full max-w-6xl mx-auto ${isBottom ? 'px-xs' : 'px-lg'} flex items-center justify-between`}>
        {!isBottom && (
          <div className="flex items-center gap-1">
            <span className="text-2xl mr-2">🏠</span>
            <span className="text-lg font-bold text-daiLan hidden sm:block">
              我的宝贝房子
            </span>
          </div>
        )}

        <div className={`flex items-center h-full ${isBottom ? 'w-full justify-around' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                relative h-16 ${isBottom ? 'flex-1' : 'px-md'} flex flex-col items-center justify-center
                transition-all duration-200 ease-out
                ${!isBottom ? 'hover:-translate-y-0.5' : ''}
                min-h-[44px]
                ${isActive(item.id)
                  ? 'text-daiLan'
                  : 'text-fuZhu hover:text-moHei'
                }
              `}
            >
              <span className={`${isBottom ? 'text-xl' : 'text-xl'} mb-0.5`}>{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive(item.id) && (
                <span
                  className={`
                    absolute ${isBottom ? 'top-0' : 'bottom-0'} left-1/2 -translate-x-1/2
                    w-8 h-0.5 bg-daiLan rounded-full
                  `}
                />
              )}
            </button>
          ))}
        </div>

        {!isBottom && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onSettingsClick}
              className="p-xs rounded-md text-fuZhu hover:text-daiLan hover:bg-miBai transition-colors"
              title="重置数据"
            >
              <span className="text-lg">⚙️</span>
            </button>
            <span className="text-sm text-fuZhu"> DEMO v0.1</span>
          </div>
        )}
      </div>
    </nav>
  )
})

export default BottomNav
