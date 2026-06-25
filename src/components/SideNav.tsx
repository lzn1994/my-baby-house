import React, { useState } from 'react'
import { useAppState } from '../hooks/useAppState'
import type { AppView } from '../types'
import NianAvatar from './NianAvatar'

interface NavItem {
  id: AppView
  label: string
  icon: string
  description: string
}

const navItems: NavItem[] = [
  { id: 'onboarding', label: '风格测试', icon: '🏠', description: '找到你的专属风格' },
  { id: 'sop', label: 'SOP流程', icon: '📋', description: '装修全流程指引' },
  { id: 'budget', label: '预算管理', icon: '💰', description: '智能预算规划' },
  { id: 'nian', label: '年兽养成', icon: '🦁', description: '陪伴你的装修之旅' },
]

interface SideNavProps {
  className?: string
}

const SideNav: React.FC<SideNavProps> = ({ className = '' }) => {
  const { state, setView } = useAppState()
  const [collapsed, setCollapsed] = useState(false)

  const handleNavClick = (view: AppView) => {
    if (view !== state.currentView) {
      setView(view)
    }
  }

  const isActive = (view: AppView) => {
    if (view === 'sop') {
      return state.currentView === 'sop' || state.currentView === 'demo'
    }
    return state.currentView === view
  }

  const styleResult = state.userSession.styleResult
  const budgetTotal = state.userSession.budgetTotal

  return (
    <aside
      className={`
        hidden xl:flex flex-col
        fixed left-0 top-0 bottom-0 z-30
        ${collapsed ? 'w-20' : 'w-60'}
        bg-miBai/90 backdrop-blur-md
        border-r border-gray-200
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      <div className="h-16 flex items-center px-md border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          {!collapsed && (
            <span className="text-lg font-bold text-daiLan">我的宝贝房子</span>
          )}
        </div>
      </div>

      <div className="flex-1 py-md overflow-y-auto">
        <div className="space-y-1 px-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-md py-sm
                rounded-md transition-all duration-200 ease-out
                ${isActive(item.id)
                  ? 'bg-daiLan text-white shadow-md'
                  : 'text-moHei hover:bg-nuanBai hover:shadow-sm'
                }
              `}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div
                    className={`
                      text-xs mt-0.5 truncate
                      ${isActive(item.id) ? 'text-white/70' : 'text-fuZhu'}
                    `}
                  >
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 p-md">
        <div
          className={`
            flex items-center gap-3
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <NianAvatar emotion="happy" size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-moHei truncate">
                {styleResult ? styleResult.styleName : '新中式探索者'}
              </div>
              <div className="text-xs text-fuZhu mt-0.5">
                {budgetTotal > 0
                  ? `预算 ¥${(budgetTotal / 10000).toFixed(1)}万`
                  : '点击开启装修之旅'}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            mt-md w-full flex items-center justify-center
            py-xs text-xs text-fuZhu hover:text-moHei
            transition-colors duration-200
          "
        >
          {collapsed ? '→' : '← 收起'}
        </button>
      </div>
    </aside>
  )
}

export default SideNav
