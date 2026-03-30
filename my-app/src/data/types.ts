export type MeterId = 'M1' | 'M2' | 'M3' | 'M4'

export type MeteringSample = {
  ts: number
  tsLabel: string
  m1: number | null
  m2: number | null
  m3: number | null
  m4: number | null
  cluster: number | null
}

export type MeteringSeriesPoint = MeteringSample & {
  totalMeters: number | null
  leakage: number | null
}

