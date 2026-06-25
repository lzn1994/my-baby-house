import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import type { DemoChapter } from '../data/demo-script'

export interface DemoControlBarProps {
  visible: boolean
  isPlaying: boolean
  isPaused: boolean
  currentChapterIndex: number
  chapterProgress: number
  totalProgress: number
  chapters: DemoChapter[]
  currentTime: string
  totalTime: string
  onPlayPause: () => void
  onPrevChapter: () => void
  onNextChapter: () => void
  onExit: () => void
  onChapterClick?: (index: number) => void
}

const DemoControlBar: React.FC<DemoControlBarProps> = ({
  visible,
  isPlaying,
  isPaused,
  currentChapterIndex,
  chapterProgress,
  totalProgress,
  chapters,
  currentTime,
  totalTime,
  onPlayPause,
  onPrevChapter,
  onNextChapter,
  onExit,
  onChapterClick,
}) => {
  const barRef = useRef<HTMLDivElement>(null)
  const [showChapters, setShowChapters] = useState(false)
  const chaptersMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return

    if (visible) {
      gsap.fromTo(
        barRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    } else {
      gsap.to(barRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  }, [visible])

  useEffect(() => {
    if (!chaptersMenuRef.current) return

    if (showChapters) {
      gsap.fromTo(
        chaptersMenuRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
      )
    } else {
      gsap.to(chaptersMenuRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      })
    }
  }, [showChapters])

  const currentChapter = chapters[currentChapterIndex]

  if (!visible) return null

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[80] pointer-events-none"
    >
      <div className="max-w-5xl mx-auto px-2 md:px-4 pt-2 md:pt-4 pointer-events-auto">
        <div className="bg-moHei/80 backdrop-blur-md rounded-lg md:rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center px-sm md:px-md py-xs md:py-sm gap-xs md:gap-md">
            <div
              className="flex items-center gap-sm cursor-pointer hover:bg-white/10 px-sm py-xs rounded-md transition-colors flex-shrink-0"
              onClick={() => setShowChapters(!showChapters)}
            >
              <div className="w-8 h-8 rounded-full bg-zhuSha flex items-center justify-center text-white text-sm">
                {currentChapterIndex + 1}
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium text-sm truncate">
                  {currentChapter?.title || '演示模式'}
                </div>
                <div className="text-white/40 text-xs truncate max-w-[120px] md:max-w-[200px]">
                  {currentChapter?.description || ''}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-white/60 transition-transform flex-shrink-0 ${
                  showChapters ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex-1 flex items-center justify-center gap-xs md:gap-sm">
              <button
                onClick={onPrevChapter}
                disabled={currentChapterIndex === 0}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="上一章"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg>
              </button>

              <button
                onClick={onPlayPause}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-zhuSha hover:bg-zhuSha/90 transition-colors"
                title={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5 md:ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="下一章"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-xs md:gap-sm flex-shrink-0">
              <div className="text-white/80 text-xs md:text-sm font-mono hidden sm:block">
                {currentTime} / {totalTime}
              </div>
              <button
                onClick={onExit}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                title="退出演示 (ESC)"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="h-1 bg-white/10 relative">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-zhuSha to-zhuQing transition-all duration-300 ease-out"
              style={{ width: `${totalProgress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300"
              style={{ left: `calc(${totalProgress}% - 6px)` }}
            />
          </div>

          <div className="px-md py-xs bg-white/5 flex items-center gap-xs overflow-x-auto">
            {chapters.map((ch, index) => {
              const isCompleted = index < currentChapterIndex
              const isCurrent = index === currentChapterIndex
              return (
                <div
                  key={ch.id}
                  onClick={() => onChapterClick?.(index)}
                  className={`flex-shrink-0 px-sm py-1 rounded-md text-xs cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-zhuSha/30 text-white'
                      : isCompleted
                      ? 'bg-zhuQing/20 text-zhuQing hover:bg-zhuQing/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {isCompleted && '✓ '}
                  {ch.title}
                </div>
              )
            })}
          </div>
        </div>

        {showChapters && (
          <div
            ref={chaptersMenuRef}
            className="mt-sm bg-moHei/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-md">
              <h4 className="text-white font-semibold mb-sm">章节列表</h4>
              <div className="space-y-xs">
                {chapters.map((ch, index) => {
                  const isCompleted = index < currentChapterIndex
                  const isCurrent = index === currentChapterIndex
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        onChapterClick?.(index)
                        setShowChapters(false)
                      }}
                      className={`flex items-center gap-sm p-sm rounded-lg cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-zhuSha/30'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                          isCompleted
                            ? 'bg-zhuQing text-white'
                            : isCurrent
                            ? 'bg-zhuSha text-white'
                            : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            isCurrent || isCompleted ? 'text-white' : 'text-white/50'
                          }`}
                        >
                          {ch.title}
                        </div>
                        <div className="text-xs text-white/40">{ch.description}</div>
                      </div>
                      <div className="text-xs text-white/40 flex-shrink-0">
                        {ch.duration}秒
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DemoControlBar
