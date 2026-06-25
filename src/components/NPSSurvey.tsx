import React, { useState } from 'react'
import Button from './Button'
import { trackEvent } from '../utils/tracking'

export interface NPSSurveyProps {
  visible: boolean
  onClose?: () => void
  onSubmit?: (score: number) => void
}

const NPSSurvey: React.FC<NPSSurveyProps> = ({ visible, onClose, onSubmit }) => {
  const [score, setScore] = useState<number>(5)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const scoreLabel = score <= 6 ? 'detractor' : score <= 8 ? 'passive' : 'promoter'

    trackEvent('nps_score', {
      score,
      score_label: scoreLabel,
      is_detractor: score <= 6,
      is_passive: score > 6 && score <= 8,
      is_promoter: score > 8,
    })

    setSubmitted(true)
    onSubmit?.(score)
  }

  const handleClose = () => {
    if (!submitted) {
      trackEvent('nps_survey_dismissed', {
        score_before_dismiss: score,
      })
    }
    onClose?.()
  }

  const getScoreColor = () => {
    if (score <= 6) return '#C84A3E'
    if (score <= 8) return '#8B6F47'
    return '#5B8C5A'
  }

  const getScoreLabel = () => {
    if (score <= 6) return '贬损者'
    if (score <= 8) return '被动者'
    return '推荐者'
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-moHei/60 backdrop-blur-sm">
      <div className="bg-nuanBai rounded-2xl shadow-2xl p-lg max-w-md w-[90%] mx-md">
        {!submitted ? (
          <>
            <div className="text-center mb-md">
              <div className="w-16 h-16 mx-auto mb-md rounded-full bg-gradient-to-br from-daiLan to-zhuQing flex items-center justify-center text-3xl">
                📊
              </div>
              <h3 className="text-xl font-bold text-moHei mb-sm">NPS 满意度调查</h3>
              <p className="text-base text-fuZhu leading-relaxed">
                你有多大可能把这个装修助手推荐给朋友？
              </p>
            </div>

            <div className="mb-lg">
              <div className="text-center mb-md">
                <span
                  className="text-5xl font-bold"
                  style={{ color: getScoreColor() }}
                >
                  {score}
                </span>
                <span className="text-sm text-fuZhu ml-sm">/ 10 分</span>
                <div
                  className="text-sm mt-xs font-medium"
                  style={{ color: getScoreColor() }}
                >
                  {getScoreLabel()}
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-3 bg-miBai rounded-lg appearance-none cursor-pointer accent-daiLan"
                style={{
                  background: `linear-gradient(to right, ${getScoreColor()} 0%, ${getScoreColor()} ${score * 10}%, #F5F0E8 ${score * 10}%, #F5F0E8 100%)`,
                }}
              />

              <div className="flex justify-between text-xs text-fuZhu mt-sm">
                <span>0 完全不可能</span>
                <span>10 非常可能</span>
              </div>

              <div className="flex justify-between mt-md">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zhuSha mb-xs">贬损者</span>
                  <span className="text-xs text-fuZhu">0-6 分</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-tanHe mb-xs">被动者</span>
                  <span className="text-xs text-fuZhu">7-8 分</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zhuQing mb-xs">推荐者</span>
                  <span className="text-xs text-fuZhu">9-10 分</span>
                </div>
              </div>
            </div>

            <div className="flex gap-sm">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={handleClose}
              >
                稍后再说
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleSubmit}
              >
                提交评分
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-md">
            <div className="w-20 h-20 mx-auto mb-md rounded-full bg-zhuQing/10 flex items-center justify-center text-5xl">
              🎉
            </div>
            <h3 className="text-xl font-bold text-moHei mb-sm">感谢你的反馈！</h3>
            <p className="text-base text-fuZhu leading-relaxed mb-lg">
              你的意见对我们非常重要，我们会继续努力改进产品体验~
            </p>
            <Button size="md" onClick={handleClose}>
              知道了
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NPSSurvey
