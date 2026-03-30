import type { MeteringSample, MeteringSeriesPoint } from './types'

function sumNullable(values: Array<number | null>): number | null {
  let hasValue = false
  let sum = 0
  for (const value of values) {
    if (value == null) continue
    hasValue = true
    sum += value
  }
  return hasValue ? sum : null
}

export function deriveSeries(samples: MeteringSample[]): MeteringSeriesPoint[] {
  return samples.map((sample) => {
    const totalMeters = sumNullable([sample.m1, sample.m2, sample.m3, sample.m4])
    const leakage = sample.cluster != null && totalMeters != null ? sample.cluster - totalMeters : null
    return { ...sample, totalMeters, leakage }
  })
}

