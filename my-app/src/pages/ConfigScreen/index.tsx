import type { ChartType } from '../../state/config'
import { useConfig } from '../../state/config'
import {
  CardBodyContainer,
  CardHeaderContainer,
  PageContainer,
  SegmentedControlButton,
  SegmentedControlContainer,
  SettingRow,
  SettingsCard,
  SubtitleText,
  TitleText,
  ToggleKnob,
  ToggleSwitchButton,
} from './styledComponents'

function ChartTypeSelector({ value, onChange }: { value: ChartType; onChange: (v: ChartType) => void }) {
  return (
    <SegmentedControlContainer role="radiogroup" aria-label="Chart type">
      <SegmentedControlButton
        type="button"
        $active={value === 'line'}
        onClick={() => onChange('line')}
        aria-pressed={value === 'line'}
      >
        Line
      </SegmentedControlButton>
      <SegmentedControlButton
        type="button"
        $active={value === 'stacked'}
        onClick={() => onChange('stacked')}
        aria-pressed={value === 'stacked'}
      >
        Stacked bar
      </SegmentedControlButton>
    </SegmentedControlContainer>
  )
}

export function ConfigScreen() {
  const { config, setAlertsEnabled, setChartType } = useConfig()

  return (
    <PageContainer>
      <SettingsCard>
        <CardHeaderContainer>
          <TitleText>Configuration</TitleText>
          <SubtitleText>These settings are saved locally in your browser.</SubtitleText>
        </CardHeaderContainer>
        <CardBodyContainer>
          <SettingRow>
            <div>
              <TitleText>Graph type</TitleText>
              <SubtitleText>Line or stacked bar visualization</SubtitleText>
            </div>
            <ChartTypeSelector value={config.chartType} onChange={setChartType} />
          </SettingRow>

          <SettingRow>
            <div>
              <TitleText>Alert widget</TitleText>
              <SubtitleText>Show alerts + highlight suspicious windows on the graph</SubtitleText>
            </div>
            <ToggleSwitchButton
              type="button"
              $on={config.alertsEnabled}
              onClick={() => setAlertsEnabled(!config.alertsEnabled)}
              aria-pressed={config.alertsEnabled}
              aria-label="Toggle alerts"
            >
              <ToggleKnob $on={config.alertsEnabled} />
            </ToggleSwitchButton>
          </SettingRow>
        </CardBodyContainer>
      </SettingsCard>
    </PageContainer>
  )
}

