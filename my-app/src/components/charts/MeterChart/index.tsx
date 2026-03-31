import { format } from 'date-fns'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from 'styled-components'

import type { AlertInterval } from '../../../data/alerts'
import type { MeterId, MeteringSeriesPoint } from '../../../data/types'
import type { ChartType } from '../../../state/config'
import { Key, TooltipCard, TooltipRow, TooltipTitle, Wrapper } from './styledComponents'

function meterKey(m: MeterId) {
  switch (m) {
    case 'M1':
      return 'm1'
    case 'M2':
      return 'm2'
    case 'M3':
      return 'm3'
    case 'M4':
      return 'm4'
  }
}

function meterLabel(m: MeterId) {
  return m
}

function meterColor(m: MeterId, accent: { accent: string; accent2: string; warn: string; good: string }) {
  switch (m) {
    case 'M1':
      return accent.accent
    case 'M2':
      return accent.accent2
    case 'M3':
      return accent.warn
    case 'M4':
      return accent.good
  }
}

type Props = {
  data: MeteringSeriesPoint[]
  meters: MeterId[]
  chartType: ChartType
  highlightRange?: { startTs: number; endTs: number; kind?: 'focus' | 'leakage' }
  leakageIntervals?: AlertInterval[]
}

export function MeterChart({ data, meters, chartType, highlightRange, leakageIntervals }: Props) {
  const theme = useTheme()

  return (
    <Wrapper>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 14, right: 18, left: 8, bottom: 6 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="ts"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => format(new Date(value as number), 'HH:mm')}
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            width={44}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active) return null
              const ts = typeof label === 'number' ? label : null
              if (!ts) return null
              const point = (payload?.[0]?.payload ?? null) as MeteringSeriesPoint | null
              if (!point) return null

              return (
                <TooltipCard>
                  <TooltipTitle>{format(new Date(ts), 'dd MMM yyyy HH:mm')}</TooltipTitle>
                  {meters.map((meter) => {
                    const key = meterKey(meter)
                    const value = point[key]
                    return (
                      <TooltipRow key={meter}>
                        <Key>{meterLabel(meter)}</Key>
                        <span>{value == null ? '—' : `${Math.round(value)} W`}</span>
                      </TooltipRow>
                    )
                  })}
                </TooltipCard>
              )
            }}
          />
          <Legend />

          {leakageIntervals?.map((alert) => (
            <ReferenceArea
              key={alert.id}
              x1={alert.startTs}
              x2={alert.endTs}
              ifOverflow="extendDomain"
              fill={theme.color.bad}
              fillOpacity={0.16}
              strokeOpacity={0}
            />
          ))}

          {highlightRange ? (
            <ReferenceArea
              x1={highlightRange.startTs}
              x2={highlightRange.endTs}
              ifOverflow="extendDomain"
              fill={highlightRange.kind === 'leakage' ? theme.color.bad : theme.color.accent}
              fillOpacity={highlightRange.kind === 'leakage' ? 0.34 : 0.3}
              stroke={highlightRange.kind === 'leakage' ? theme.color.bad : theme.color.accent}
              strokeOpacity={0.7}
              strokeWidth={1.5}
            />
          ) : null}

          {meters.map((meter) => {
            const dataKey = meterKey(meter)
            const stroke = meterColor(meter, theme.color)
            if (chartType === 'stacked') {
              return (
                <Bar
                  key={meter}
                  dataKey={dataKey}
                  name={meterLabel(meter)}
                  stackId="a"
                  fill={stroke}
                  fillOpacity={0.85}
                  isAnimationActive={false}
                />
              )
            }
            return (
              <Line
                key={meter}
                type="monotone"
                dataKey={dataKey}
                name={meterLabel(meter)}
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                connectNulls={false}
              />
            )
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </Wrapper>
  )
}

