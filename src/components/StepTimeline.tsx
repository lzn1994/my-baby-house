import React from 'react'

export type StepStatus = 'completed' | 'current' | 'locked'

export interface TimelineStep {
  id: string | number
  title: string
  stage: string
  status: StepStatus
}

export interface StepTimelineProps {
  steps: TimelineStep[]
  currentStep?: string | number
  onStepClick?: (stepId: string | number) => void
  horizontal?: boolean
  className?: string
}

const StepTimeline: React.FC<StepTimelineProps> = ({
  steps,
  currentStep,
  onStepClick,
  horizontal = false,
  className = '',
}) => {
  const stages = Array.from(new Set(steps.map((s) => s.stage)))

  const getStatusStyles = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-zhuQing',
          line: 'bg-zhuQing',
          text: 'text-moHei',
        }
      case 'current':
        return {
          dot: 'bg-daiLan animate-pulse',
          line: 'bg-daiLan',
          text: 'text-daiLan font-semibold',
        }
      case 'locked':
      default:
        return {
          dot: 'bg-transparent border-2 border-gray-300',
          line: 'bg-gray-200',
          text: 'text-fuZhu',
        }
    }
  }

  const handleClick = (step: TimelineStep) => {
    if (step.status !== 'locked' && onStepClick) {
      onStepClick(step.id)
    }
  }

  if (horizontal) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="flex min-w-max p-md gap-0">
          {stages.map((stage, stageIndex) => {
            const stageSteps = steps.filter((s) => s.stage === stage)
            const isLastStage = stageIndex === stages.length - 1

            return (
              <div key={stage} className="flex-shrink-0">
                <div className="text-xs text-fuZhu font-medium mb-sm text-center">
                  {stage}
                </div>

                <div className="relative flex items-center">
                  {stageSteps.map((step, stepIndex) => {
                    const isLastStep = stepIndex === stageSteps.length - 1
                    const styles = getStatusStyles(step.status)
                    const isClickable = step.status !== 'locked'

                    return (
                      <div key={step.id} className="relative flex flex-col items-center">
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex-shrink-0 z-10 flex items-center justify-center text-xs font-medium ${styles.dot} ${
                              isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                            } ${currentStep === step.id ? 'ring-2 ring-daiLan ring-offset-2' : ''}`}
                            onClick={() => handleClick(step)}
                          >
                            {step.status === 'completed' && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {(!isLastStep || !isLastStage) && (
                            <div
                              className={`w-8 h-0.5 ${styles.line}`}
                            />
                          )}
                        </div>
                        <div
                          className={`mt-xs text-xs whitespace-nowrap ${styles.text} ${
                            isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                          }`}
                          onClick={() => handleClick(step)}
                        >
                          {step.title.length > 6 ? step.title.slice(0, 6) + '...' : step.title}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`p-md ${className}`}>
      {stages.map((stage, stageIndex) => {
        const stageSteps = steps.filter((s) => s.stage === stage)
        const isLastStage = stageIndex === stages.length - 1

        return (
          <div key={stage} className="mb-md last:mb-0">
            <div className="text-sm text-fuZhu font-medium mb-sm pl-6">
              {stage}
            </div>

            <div className="relative">
              {stageSteps.map((step, stepIndex) => {
                const isLastStep = stepIndex === stageSteps.length - 1
                const styles = getStatusStyles(step.status)
                const isClickable = step.status !== 'locked'

                return (
                  <div key={step.id} className="relative flex items-start min-h-8">
                    <div className="flex flex-col items-center mr-sm">
                      <div
                        className={`w-4 h-4 rounded-full flex-shrink-0 z-10 ${styles.dot} ${
                          isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                        onClick={() => handleClick(step)}
                      />
                      {(!isLastStep || !isLastStage) && (
                        <div
                          className={`w-0.5 flex-1 min-h-4 ${styles.line}`}
                        />
                      )}
                    </div>

                    <div
                      className={`pb-md text-sm ${styles.text} ${
                        isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                      }`}
                      onClick={() => handleClick(step)}
                    >
                      {step.title}
                      {currentStep === step.id && (
                        <span className="ml-xs text-xs bg-daiLan/10 text-daiLan px-xs py-0.5 rounded-sm">
                          当前
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StepTimeline
