import { useEffect, useRef, useCallback } from 'react'
import {
  trackPageView,
  trackEvent,
  trackFunnelStep,
  trackPerformance,
  setCommonTrackingProperties,
} from '../utils/tracking'

export function usePageView(pageName: string, properties?: Record<string, unknown>) {
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (hasTrackedRef.current) return
    hasTrackedRef.current = true

    trackPageView(pageName, properties)

    setCommonTrackingProperties({ current_view: pageName })
  }, [pageName, properties])
}

export function useFunnelTracking(funnelName: string) {
  const trackStep = useCallback(
    (step: number | string, properties?: Record<string, unknown>) => {
      trackFunnelStep(funnelName, step, properties)
    },
    [funnelName]
  )

  return { trackStep }
}

export function useDurationTracking(eventName: string) {
  const startTimeRef = useRef<number | null>(null)

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
  }, [])

  const end = useCallback(
    (properties?: Record<string, unknown>) => {
      if (startTimeRef.current === null) return 0

      const duration = Date.now() - startTimeRef.current
      trackEvent(`${eventName}_duration`, {
        duration_ms: duration,
        duration_seconds: Math.round(duration / 1000),
        ...properties,
      })

      trackPerformance(eventName, duration, { unit: 'ms', ...properties })

      startTimeRef.current = null
      return duration
    },
    [eventName]
  )

  const getDuration = useCallback(() => {
    if (startTimeRef.current === null) return 0
    return Date.now() - startTimeRef.current
  }, [])

  useEffect(() => {
    return () => {
      if (startTimeRef.current !== null) {
        end({ abandoned: true })
      }
    }
  }, [end])

  return { start, end, getDuration }
}

export function useTracking() {
  return {
    trackEvent,
    trackPageView,
    trackFunnelStep,
    trackPerformance,
  }
}

export default useTracking
