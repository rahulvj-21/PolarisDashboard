import { format } from 'date-fns'

import type { MeteringSeriesPoint } from './types'

export type AlertKind = 'TOTAL_OVER' | 'LEAKAGE_OVER'

export type AlertInterval = {
  id: string
  kind: AlertKind
  threshold: number
  startTs: number
  endTs: number
  points: number
  peakValue: number
  peakTs: number
}

const MAX_GAP_MS = 2 * 60 * 1000

function fmt(ts: number) {
  return format(new Date(ts), 'dd MMM yyyy HH:mm')
}

function mkId(kind: AlertKind, startTs: number, endTs: number) {
  return `${kind}:${startTs}-${endTs}`
}

type ActiveInterval = Omit<AlertInterval, 'id'>

function buildIntervals(
  series: MeteringSeriesPoint[],
  kind: AlertKind,
  threshold: number,
  getValue: (p: MeteringSeriesPoint) => number | null,
): AlertInterval[] {
  const intervals: AlertInterval[] = []

  let active: ActiveInterval | null = null
  let prevTs: number | null = null

  const finalize = (interval: ActiveInterval): AlertInterval => ({
    ...interval,
    id: mkId(interval.kind, interval.startTs, interval.endTs),
  })

  const pushActive = () => {
    if (!active) return
    intervals.push(finalize(active))
    active = null
  }

  for (const point of series) {
    const value = getValue(point)
    const isOn = value != null && value > threshold
    const isContiguous = prevTs != null && point.ts - prevTs <= MAX_GAP_MS

    if (isOn) {
      if (!active || !isContiguous) {
        pushActive()
        active = {
          kind,
          threshold,
          startTs: point.ts,
          endTs: point.ts,
          points: 1,
          peakValue: value,
          peakTs: point.ts,
        }
      } else {
        active.endTs = point.ts
        active.points += 1
        if (value > active.peakValue) {
          active.peakValue = value
          active.peakTs = point.ts
        }
      }
    } else {
      pushActive()
    }

    prevTs = point.ts
  }

  pushActive()
  return intervals
}

export function computeAlerts(series: MeteringSeriesPoint[], thresholds?: { totalWatts?: number; leakageWatts?: number }) {
  const totalWatts = thresholds?.totalWatts ?? 1000
  const leakageWatts = thresholds?.leakageWatts ?? 300

  const total = buildIntervals(series, 'TOTAL_OVER', totalWatts, (point) => point.totalMeters)
  const leakage = buildIntervals(series, 'LEAKAGE_OVER', leakageWatts, (point) => point.leakage)

  const byId = new Map<string, AlertInterval>()
  for (const alert of [...total, ...leakage]) byId.set(alert.id, alert)

  return {
    total,
    leakage,
    all: [...total, ...leakage].sort((a, b) => b.startTs - a.startTs),
    byId,
    formatRange: (alert: AlertInterval) =>
      alert.startTs === alert.endTs ? fmt(alert.startTs) : `${fmt(alert.startTs)} → ${fmt(alert.endTs)}`,
  }
}

