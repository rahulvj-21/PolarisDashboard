import styled from 'styled-components'

export const PageGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

export const PanelCard = styled.section`
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme }) => theme.radius.l};
  box-shadow: ${({ theme }) => theme.shadow.soft};
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: rgba(255, 255, 255, 0.20);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(900px 240px at 10% 0%, rgba(124, 92, 255, 0.18), transparent 55%),
      radial-gradient(800px 260px at 95% 0%, rgba(24, 213, 255, 0.14), transparent 52%);
    opacity: 0.9;
  }
`

export const CardHeaderContainer = styled.div`
  padding: 14px 14px 10px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  position: relative;
`

export const TitleBlockContainer = styled.div`
  display: grid;
  gap: 4px;
`

export const TitleText = styled.div`
  font-weight: 780;
  letter-spacing: 0.2px;
`

export const SubtitleText = styled.div`
  color: ${({ theme }) => theme.color.text3};
  font-size: 13px;
`

export const CardBodyContainer = styled.div`
  padding: 0 14px 14px 14px;
  position: relative;
`

export const SummaryGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const StatCard = styled.div<{ $tone?: 'neutral' | 'good' | 'warn' | 'bad' }>`
  border-radius: ${({ theme }) => theme.radius.m};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: rgba(255, 255, 255, 0.035);
  padding: 10px 10px;
  display: grid;
  gap: 6px;
  min-height: 60px;

  ${({ $tone }) =>
    $tone === 'good'
      ? `box-shadow: inset 0 0 0 1px rgba(25,195,125,0.20);`
      : $tone === 'warn'
        ? `box-shadow: inset 0 0 0 1px rgba(247,185,85,0.22);`
        : $tone === 'bad'
          ? `box-shadow: inset 0 0 0 1px rgba(255,77,109,0.22);`
          : `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);`}
`

export const StatLabelText = styled.div`
  font-size: 11px;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.color.text3};
  text-transform: uppercase;
`

export const StatValueRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
`

export const StatValueText = styled.div`
  font-weight: 780;
  letter-spacing: 0.2px;
`

export const StatHintText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text2};
`

export const FiltersContainer = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const FieldLabel = styled.label`
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text3};
`

export const DateTimeInput = styled.input`
  height: 38px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.m};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.color.text};
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: rgba(124, 92, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.16);
  }
`

export const MeterChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`

export const MeterChipButton = styled.button<{ $active: boolean }>`
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ $active }) => ($active ? 'rgba(124,92,255,0.22)' : 'rgba(255,255,255,0.03)')};
  color: ${({ theme }) => theme.color.text};
  padding: 7px 10px;
  cursor: pointer;
  transition: transform 0.06s ease, border-color 0.15s ease, background 0.15s ease;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
  }
`

export const SectionDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 0;
`

export const AlertsListContainer = styled.div`
  display: grid;
  gap: 10px;
  max-height: 1000px;
  overflow-y: auto;
  padding-right: 4px;
`

export const AlertListItemButton = styled.button<{ $selected: boolean; $tone: 'warn' | 'bad' }>`
  text-align: left;
  padding: 10px 10px;
  border-radius: ${({ theme }) => theme.radius.m};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.03)')};
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  display: grid;
  gap: 2px;
  transition: transform 0.06s ease, background 0.15s ease, border-color 0.15s ease;

  ${({ $tone }) =>
    $tone === 'bad'
      ? `box-shadow: inset 0 0 0 1px rgba(255,77,109,0.35);`
      : `box-shadow: inset 0 0 0 1px rgba(247,185,85,0.30);`}

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.20);
  }
`

export const AlertMetaText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text3};
`

export const EmptyStateText = styled.div`
  padding: 14px;
  color: ${({ theme }) => theme.color.text3};
  font-size: 13px;
`

export const ShowMoreButton = styled.button`
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.color.text2};
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.06s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.18);
  }

  &:active {
    transform: scale(0.98);
  }
`

export const SelectedAlertCard = styled.div`
  height: 88px;
  margin-right: 4px;
  border: 1px solid rgba(124, 92, 255, 0.35);
  border-radius: ${({ theme }) => theme.radius.m};
  background: linear-gradient(180deg, rgba(124, 92, 255, 0.16), rgba(24, 213, 255, 0.08));
  padding: 10px 12px;
  box-sizing: border-box;
`

export const SelectedAlertTitle = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-weight: 780;
  letter-spacing: 0.2px;
`

export const SelectedAlertMetaText = styled.div`
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
`

