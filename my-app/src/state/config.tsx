import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type ChartType = 'line' | 'stacked'

export type AppConfig = {
  chartType: ChartType
  alertsEnabled: boolean
}

const DEFAULT_CONFIG: AppConfig = { chartType: 'line', alertsEnabled: true }
const STORAGE_KEY = 'polaris.config.v1'

function loadConfigFromStorage(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    const parsed = JSON.parse(raw) as Partial<AppConfig>
    return {
      chartType: parsed.chartType === 'stacked' || parsed.chartType === 'line' ? parsed.chartType : DEFAULT_CONFIG.chartType,
      alertsEnabled: typeof parsed.alertsEnabled === 'boolean' ? parsed.alertsEnabled : DEFAULT_CONFIG.alertsEnabled,
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

function persistConfigToStorage(cfg: AppConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  } catch {
  }
}

type ConfigContextValue = {
  config: AppConfig
  setChartType: (t: ChartType) => void
  setAlertsEnabled: (enabled: boolean) => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => loadConfigFromStorage())

  const setChartType = useCallback((type: ChartType) => {
    setConfig((prev) => {
      const next = { ...prev, chartType: type }
      persistConfigToStorage(next)
      return next
    })
  }, [])

  const setAlertsEnabled = useCallback((enabled: boolean) => {
    setConfig((prev) => {
      const next = { ...prev, alertsEnabled: enabled }
      persistConfigToStorage(next)
      return next
    })
  }, [])

  const value = useMemo<ConfigContextValue>(() => ({ config, setChartType, setAlertsEnabled }), [config, setAlertsEnabled, setChartType])

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}

