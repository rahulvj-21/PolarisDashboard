import styled from 'styled-components'

export const PageContainer = styled.div`
  display: grid;
  gap: 16px;
`

export const SettingsCard = styled.section`
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme }) => theme.radius.l};
  box-shadow: ${({ theme }) => theme.shadow.soft};
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(900px 260px at 12% 0%, rgba(124, 92, 255, 0.16), transparent 55%),
      radial-gradient(800px 260px at 95% 0%, rgba(24, 213, 255, 0.12), transparent 50%);
    opacity: 0.9;
  }
`

export const CardHeaderContainer = styled.div`
  padding: 14px 14px 10px 14px;
  display: grid;
  gap: 4px;
  position: relative;
`

export const TitleText = styled.div`
  font-size: 14px;
  font-weight: 780;
`

export const SubtitleText = styled.div`
  color: ${({ theme }) => theme.color.text3};
  font-size: 13px;
`

export const CardBodyContainer = styled.div`
  padding: 14px;
  display: grid;
  gap: 14px;
  position: relative;
`

export const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const SegmentedControlContainer = styled.div`
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: rgba(255, 255, 255, 0.04);
`

export const SegmentedControlButton = styled.button<{ $active: boolean }>`
  border: 0;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 999px;
  color: ${({ theme }) => theme.color.text};
  background: ${({ $active }) => ($active ? 'rgba(124,92,255,0.25)' : 'transparent')};
  transition: transform 0.06s ease, background 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`

export const ToggleSwitchButton = styled.button<{ $on: boolean }>`
  width: 54px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ $on }) => ($on ? 'rgba(25,195,125,0.22)' : 'rgba(255,255,255,0.04)')};
  position: relative;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
  }
`

export const ToggleKnob = styled.div<{ $on: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  position: absolute;
  top: 3px;
  left: ${({ $on }) => ($on ? '26px' : '4px')};
  transition: left 0.14s ease;
  background: rgba(255, 255, 255, 0.90);
`

