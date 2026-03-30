import { useEffect, useMemo, useState } from 'react'

import { deriveSeries } from '../data/derive'
import { loadMeteringCsvFromUrl } from '../data/loadMetersCsv'
import type { MeteringSeriesPoint } from '../data/types'

type LoadState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; data: MeteringSeriesPoint[] }
  | { status: 'error'; message: string }

export function useMeteringSeries() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    loadMeteringCsvFromUrl('/PolarisMetersData.csv')
      .then((rows) => {
        if (cancelled) return
        setState({ status: 'ready', data: deriveSeries(rows) })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setState({ status: 'error', message: msg })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const meta = useMemo(() => {
    if (state.status !== 'ready' || state.data.length === 0) return null
    return {
      minTs: state.data[0]!.ts,
      maxTs: state.data[state.data.length - 1]!.ts,
      points: state.data.length,
    }
  }, [state])

  return { state, meta }
}

