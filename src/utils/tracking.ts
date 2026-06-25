export interface TrackingEvent {
  id: string
  name: string
  properties: Record<string, unknown>
  timestamp: number
  sessionId: string
}

export interface TrackingOptions {
  enableConsole: boolean
  enableStorage: boolean
  maxEvents: number
}

class TrackingManager {
  private events: TrackingEvent[] = []
  private commonProperties: Record<string, unknown> = {}
  private options: TrackingOptions = {
    enableConsole: true,
    enableStorage: true,
    maxEvents: 100,
  }
  private sessionId: string
  private thirdPartyAdapters: Map<string, (event: TrackingEvent) => void> = new Map()
  private listeners: Set<(event: TrackingEvent) => void> = new Set()

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initCommonProperties()
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private initCommonProperties() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
      deviceType = 'mobile'
    } else if (/iPad|Tablet/i.test(ua)) {
      deviceType = 'tablet'
    }

    const browser = this.detectBrowser(ua)

    this.commonProperties = {
      appVersion: '0.1.0',
      deviceType,
      browser,
      os: this.detectOS(ua),
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
    }
  }

  private detectBrowser(ua: string): string {
    if (/Edg\//.test(ua)) return 'Edge'
    if (/Chrome\//.test(ua)) return 'Chrome'
    if (/Firefox\//.test(ua)) return 'Firefox'
    if (/Safari\//.test(ua)) return 'Safari'
    return 'Unknown'
  }

  private detectOS(ua: string): string {
    if (/Windows NT/.test(ua)) return 'Windows'
    if (/Mac OS X/.test(ua)) return 'macOS'
    if (/Android/.test(ua)) return 'Android'
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
    if (/Linux/.test(ua)) return 'Linux'
    return 'Unknown'
  }

  setOptions(options: Partial<TrackingOptions>) {
    this.options = { ...this.options, ...options }
  }

  setCommonProperties(properties: Record<string, unknown>) {
    this.commonProperties = { ...this.commonProperties, ...properties }
  }

  getCommonProperties(): Record<string, unknown> {
    return { ...this.commonProperties, sessionId: this.sessionId }
  }

  getSessionId(): string {
    return this.sessionId
  }

  addListener(callback: (event: TrackingEvent) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  removeListener(callback: (event: TrackingEvent) => void) {
    this.listeners.delete(callback)
  }

  registerAdapter(name: string, adapter: (event: TrackingEvent) => void) {
    this.thirdPartyAdapters.set(name, adapter)
  }

  unregisterAdapter(name: string) {
    this.thirdPartyAdapters.delete(name)
  }

  trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
    const event: TrackingEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: eventName,
      properties: { ...this.commonProperties, ...properties },
      timestamp: Date.now(),
      sessionId: this.sessionId,
    }

    this.events.unshift(event)
    if (this.events.length > this.options.maxEvents) {
      this.events = this.events.slice(0, this.options.maxEvents)
    }

    if (this.options.enableConsole) {
      console.log(`[Tracking] ${eventName}`, event.properties)
    }

    this.thirdPartyAdapters.forEach((adapter) => {
      try {
        adapter(event)
      } catch (e) {
        console.error(`[Tracking] Adapter error:`, e)
      }
    })

    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (e) {
        console.error(`[Tracking] Listener error:`, e)
      }
    })

    return event
  }

  trackPageView(pageName: string, properties: Record<string, unknown> = {}) {
    return this.trackEvent('page_view', {
      page_name: pageName,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      ...properties,
    })
  }

  trackFunnelStep(funnelName: string, step: number | string, properties: Record<string, unknown> = {}) {
    return this.trackEvent('funnel_step', {
      funnel_name: funnelName,
      funnel_step: step,
      ...properties,
    })
  }

  trackPerformance(metricName: string, value: number, properties: Record<string, unknown> = {}) {
    return this.trackEvent('performance', {
      metric_name: metricName,
      metric_value: value,
      ...properties,
    })
  }

  getEvents(limit = 10): TrackingEvent[] {
    return this.events.slice(0, limit)
  }

  getAllEvents(): TrackingEvent[] {
    return [...this.events]
  }

  clearEvents() {
    this.events = []
  }

  getEventCount(): number {
    return this.events.length
  }
}

const tracking = new TrackingManager()

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  return tracking.trackEvent(eventName, properties)
}

export function trackPageView(pageName: string, properties?: Record<string, unknown>) {
  return tracking.trackPageView(pageName, properties)
}

export function trackFunnelStep(funnelName: string, step: number | string, properties?: Record<string, unknown>) {
  return tracking.trackFunnelStep(funnelName, step, properties)
}

export function trackPerformance(metricName: string, value: number, properties?: Record<string, unknown>) {
  return tracking.trackPerformance(metricName, value, properties)
}

export function setCommonTrackingProperties(properties: Record<string, unknown>) {
  tracking.setCommonProperties(properties)
}

export function getCommonTrackingProperties() {
  return tracking.getCommonProperties()
}

export function addTrackingListener(callback: (event: TrackingEvent) => void) {
  return tracking.addListener(callback)
}

export function getTrackingEvents(limit?: number) {
  return tracking.getEvents(limit)
}

export function clearTrackingEvents() {
  tracking.clearEvents()
}

export function registerTrackingAdapter(name: string, adapter: (event: TrackingEvent) => void) {
  tracking.registerAdapter(name, adapter)
}

export default tracking
