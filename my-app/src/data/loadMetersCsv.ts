import Papa from 'papaparse'
import { parse } from 'date-fns'

import type { MeteringSample } from './types'

type RawRow = Record<string, string | undefined>

const COL = {
  ts: 'Timestamp',
  m1: 'M1 Power (Watts)',
  m2: 'M2 Power (Watts)',
  m3: 'M3 Power (Watts)',
  m4: 'M4 Power Watts',
  cluster: 'Cluster Meter Power (Watts)',
} as const

function toNumberOrNull(value: string | undefined): number | null {
  if (value == null) return null
  const trimmed = value.trim()
  if (trimmed === '') return null
  const number = Number(trimmed)
  return Number.isFinite(number) ? number : null
}

function parseTimestampToMillis(label: string): number | null {
  const date = parse(label.trim(), 'dd-MM-yyyy HH:mm', new Date())
  const ms = date.getTime()
  return Number.isFinite(ms) ? ms : null
}

export async function loadMeteringCsvFromUrl(url: string): Promise<MeteringSample[]> {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } })
  if (!res.ok) throw new Error(`Failed to load CSV: ${res.status} ${res.statusText}`)
  const text = await res.text()

  const parsed = Papa.parse<RawRow>(text, { header: true, skipEmptyLines: true })
  if (parsed.errors.length > 0) {
    console.warn('CSV parse warning:', parsed.errors[0])
  }

  const rows: MeteringSample[] = []
  for (const r of parsed.data) {
    const tsLabel = r[COL.ts]?.trim()
    if (!tsLabel) continue
    const ts = parseTimestampToMillis(tsLabel)
    if (ts == null) continue

    rows.push({
      ts,
      tsLabel,
      m1: toNumberOrNull(r[COL.m1]),
      m2: toNumberOrNull(r[COL.m2]),
      m3: toNumberOrNull(r[COL.m3]),
      m4: toNumberOrNull(r[COL.m4]),
      cluster: toNumberOrNull(r[COL.cluster]),
    })
  }

  rows.sort((a, b) => a.ts - b.ts)
  return rows
}

