import { useMemo, useState } from 'react'

import { computeAlerts, type AlertInterval } from '../../data/alerts'
import type { MeterId, MeteringSeriesPoint } from '../../data/types'
import { useMeteringSeries } from '../../hooks/useMeteringSeries'
import { useConfig } from '../../state/config'
import { MeterChart } from '../../components/charts/MeterChart/index'
import {
  AlertListItemButton,
  AlertMetaText,
  AlertsListContainer,
  CardBodyContainer,
  CardHeaderContainer,
  DateTimeInput,
  EmptyStateText,
  FieldLabel,
  FiltersContainer,
  MeterChipButton,
  MeterChipsRow,
  PageGridContainer,
  PanelCard,
  SectionDivider,
  StatCard,
  StatHintText,
  StatLabelText,
  StatValueRow,
  StatValueText,
  SubtitleText,
  SummaryGridContainer,
  TitleBlockContainer,
  TitleText,
} from './styledComponents'

function pad2(num: number) {
  return String(num).padStart(2, '0')
}

function toDateTimeLocalValue(ms: number) {
  const d = new Date(ms)
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const min = pad2(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

function fromDateTimeLocalValue(v: string): number | null {
  if (!v) return null
  const ms = new Date(v).getTime()
  return Number.isFinite(ms) ? ms : null
}

const ALL_METERS: MeterId[] = ['M1', 'M2', 'M3', 'M4']

function filterByWindow(data: MeteringSeriesPoint[], startTs: number, endTs: number) {
  return data.filter((p) => p.ts >= startTs && p.ts <= endTs)
}

function fmtDuration(ms: number) {
  const totalMin = Math.max(0, Math.round(ms / 60000))
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h <= 0) return `${m}m`
  return `${h}h ${m}m`
}

export function VisualizeScreen() {
  const { config } = useConfig()
  const { state, meta } = useMeteringSeries()

  const [selectedMeters, setSelectedMeters] = useState<MeterId[]>(ALL_METERS)
  const [startLocal, setStartLocal] = useState<string>('')
  const [endLocal, setEndLocal] = useState<string>('')
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null)

  const effectiveStartLocal = useMemo(() => startLocal || (meta ? toDateTimeLocalValue(meta.minTs) : ''), [meta, startLocal])
  const effectiveEndLocal = useMemo(() => endLocal || (meta ? toDateTimeLocalValue(meta.maxTs) : ''), [endLocal, meta])

  const windowMs = useMemo(() => {
    const startTs = fromDateTimeLocalValue(effectiveStartLocal)
    const endTs = fromDateTimeLocalValue(effectiveEndLocal)
    if (startTs == null || endTs == null) return null
    if (endTs < startTs) return { startTs: endTs, endTs: startTs }
    return { startTs, endTs }
  }, [effectiveEndLocal, effectiveStartLocal])

  const derivedData = useMemo(() => {
    if (state.status !== 'ready' || !windowMs) return null
    const data = filterByWindow(state.data, windowMs.startTs, windowMs.endTs)
    const alerts = computeAlerts(data)
    return { data, alerts }
  }, [state, windowMs])

  const leakageIntervals = useMemo(() => {
    if (!derivedData) return []
    return derivedData.alerts.leakage
  }, [derivedData])

  const activeAlert: AlertInterval | null = useMemo(() => {
    if (!derivedData || !activeAlertId) return null
    return derivedData.alerts.byId.get(activeAlertId) ?? null
  }, [activeAlertId, derivedData])

  const highlightRange = useMemo(() => {
    if (!activeAlert) return undefined
    return {
      startTs: activeAlert.startTs,
      endTs: activeAlert.endTs,
      kind: activeAlert.kind === 'LEAKAGE_OVER' ? ('leakage' as const) : ('focus' as const),
    }
  }, [activeAlert])

  const chartData: MeteringSeriesPoint[] = derivedData?.data ?? []

  const subtitle =
    state.status === 'ready' && meta && windowMs
      ? `${meta.points} samples • window: ${new Date(windowMs.startTs).toLocaleString()} → ${new Date(windowMs.endTs).toLocaleString()}`
      : 'Loading CSV from server…'

  const kpis = useMemo(() => {
    const windowLabel = windowMs ? fmtDuration(windowMs.endTs - windowMs.startTs) : '—'
    const shownSamples = chartData.length
    const metersLabel = selectedMeters.length === 0 ? 'None' : `${selectedMeters.length} selected`
    const alertsAll = derivedData?.alerts.all.length ?? 0
    const alertsLeakage = derivedData?.alerts.leakage.length ?? 0
    const tone: 'neutral' | 'good' | 'warn' | 'bad' = !config.alertsEnabled ? 'neutral' : alertsLeakage > 0 ? 'bad' : alertsAll > 0 ? 'warn' : 'good'

    return { windowLabel, shownSamples, metersLabel, alertsAll, alertsLeakage, tone }
  }, [chartData.length, config.alertsEnabled, derivedData?.alerts.all.length, derivedData?.alerts.leakage.length, selectedMeters.length, windowMs])

  return (
    <PageGridContainer>
      <PanelCard>
        <CardHeaderContainer>
          <TitleBlockContainer>
            <TitleText>Visualization</TitleText>
            <SubtitleText>{subtitle}</SubtitleText>
          </TitleBlockContainer>
          <SubtitleText>Chart: {config.chartType === 'line' ? 'Line' : 'Stacked bar'}</SubtitleText>
        </CardHeaderContainer>
        <CardBodyContainer>
          {state.status === 'error' ? <EmptyStateText>Failed to load CSV. {state.message}</EmptyStateText> : null}

          <SummaryGridContainer aria-label="Summary">
            <StatCard>
              <StatLabelText>Window</StatLabelText>
              <StatValueRow>
                <StatValueText>{kpis.windowLabel}</StatValueText>
                <StatHintText>{windowMs ? 'selected' : '—'}</StatHintText>
              </StatValueRow>
            </StatCard>
            <StatCard>
              <StatLabelText>Samples shown</StatLabelText>
              <StatValueRow>
                <StatValueText>{kpis.shownSamples}</StatValueText>
                <StatHintText>{state.status === 'ready' ? 'points' : '—'}</StatHintText>
              </StatValueRow>
            </StatCard>
            <StatCard>
              <StatLabelText>Meters</StatLabelText>
              <StatValueRow>
                <StatValueText>{kpis.metersLabel}</StatValueText>
              </StatValueRow>
            </StatCard>
            <StatCard $tone={kpis.tone}>
              <StatLabelText>Alerts</StatLabelText>
              <StatValueRow>
                <StatValueText>{config.alertsEnabled ? kpis.alertsAll : '—'}</StatValueText>
                <StatHintText>{config.alertsEnabled ? `${kpis.alertsLeakage} leakage` : 'disabled'}</StatHintText>
              </StatValueRow>
            </StatCard>
          </SummaryGridContainer>

          <FiltersContainer aria-label="Filters">
            <FieldLabel>
              Start time
              <DateTimeInput
                type="datetime-local"
                value={effectiveStartLocal}
                onChange={(e) => setStartLocal(e.target.value)}
                disabled={state.status !== 'ready'}
                min={meta ? toDateTimeLocalValue(meta.minTs) : undefined}
                max={meta ? toDateTimeLocalValue(meta.maxTs) : undefined}
              />
            </FieldLabel>
            <FieldLabel>
              End time
              <DateTimeInput
                type="datetime-local"
                value={effectiveEndLocal}
                onChange={(e) => setEndLocal(e.target.value)}
                disabled={state.status !== 'ready'}
                min={meta ? toDateTimeLocalValue(meta.minTs) : undefined}
                max={meta ? toDateTimeLocalValue(meta.maxTs) : undefined}
              />
            </FieldLabel>
          </FiltersContainer>

          <SectionDivider />

          <FieldLabel as="div">
            Meters
            <MeterChipsRow>
              {ALL_METERS.map((m) => {
                const active = selectedMeters.includes(m)
                return (
                  <MeterChipButton
                    key={m}
                    type="button"
                    $active={active}
                    onClick={() => {
                      setActiveAlertId(null)
                      setSelectedMeters((prev) => {
                        if (prev.includes(m)) return prev.filter((x) => x !== m)
                        return [...prev, m]
                      })
                    }}
                    aria-pressed={active}
                  >
                    {m}
                  </MeterChipButton>
                )
              })}
              <MeterChipButton
                type="button"
                $active={selectedMeters.length === ALL_METERS.length}
                onClick={() => {
                  setActiveAlertId(null)
                  setSelectedMeters(ALL_METERS)
                }}
              >
                All
              </MeterChipButton>
              <MeterChipButton
                type="button"
                $active={selectedMeters.length === 0}
                onClick={() => {
                  setActiveAlertId(null)
                  setSelectedMeters([])
                }}
              >
                None
              </MeterChipButton>
            </MeterChipsRow>
          </FieldLabel>

          <SectionDivider />

          {state.status === 'ready' && windowMs ? (
            selectedMeters.length === 0 ? (
              <EmptyStateText>Select at least one meter (M1–M4).</EmptyStateText>
            ) : chartData.length > 0 ? (
              <MeterChart
                data={chartData}
                meters={selectedMeters}
                chartType={config.chartType}
                highlightRange={highlightRange}
                leakageIntervals={config.alertsEnabled ? leakageIntervals : []}
              />
            ) : (
              <EmptyStateText>No data in the selected time window. Try widening the range.</EmptyStateText>
            )
          ) : (
            <EmptyStateText>Loading…</EmptyStateText>
          )}
        </CardBodyContainer>
      </PanelCard>

      <PanelCard aria-label="Alerts">
        <CardHeaderContainer>
          <TitleBlockContainer>
            <TitleText>Alerts</TitleText>
            <SubtitleText>{config.alertsEnabled ? 'Enabled' : 'Disabled in configuration'}</SubtitleText>
          </TitleBlockContainer>
          {derivedData ? <SubtitleText>{derivedData.alerts.all.length} active windows</SubtitleText> : <SubtitleText>—</SubtitleText>}
        </CardHeaderContainer>
        <CardBodyContainer>
          {!config.alertsEnabled ? (
            <EmptyStateText>Turn alerts on in Configuration to see summaries and click-to-highlight.</EmptyStateText>
          ) : derivedData && derivedData.alerts.all.length > 0 ? (
            <AlertsListContainer>
              {derivedData.alerts.all.slice(0, 14).map((a) => {
                const selected = a.id === activeAlertId
                const tone = a.kind === 'LEAKAGE_OVER' ? 'bad' : 'warn'
                const label = a.kind === 'LEAKAGE_OVER' ? 'Leakage' : 'Total power'
                return (
                  <AlertListItemButton
                    key={a.id}
                    type="button"
                    $selected={selected}
                    $tone={tone}
                    onClick={() => setActiveAlertId((prev) => (prev === a.id ? null : a.id))}
                  >
                    <div>
                      <strong>{label}</strong> &gt; {a.threshold}W
                    </div>
                    <AlertMetaText>
                      {derivedData.alerts.formatRange(a)} • peak {Math.round(a.peakValue)}W
                    </AlertMetaText>
                  </AlertListItemButton>
                )
              })}
            </AlertsListContainer>
          ) : (
            <EmptyStateText>No alerts in the selected window.</EmptyStateText>
          )}

          {config.alertsEnabled && activeAlert && derivedData ? (
            <>
              <SectionDivider />
              <div>
                <TitleText>Selected alert</TitleText>
                <SubtitleText style={{ marginTop: 6 }}>{derivedData.alerts.formatRange(activeAlert)}</SubtitleText>
                <SubtitleText style={{ marginTop: 6 }}>
                  Points: {activeAlert.points} • Peak: {Math.round(activeAlert.peakValue)}W at{' '}
                  {new Date(activeAlert.peakTs).toLocaleString()}
                </SubtitleText>
              </div>
            </>
          ) : null}
        </CardBodyContainer>
      </PanelCard>
    </PageGridContainer>
  )
}

