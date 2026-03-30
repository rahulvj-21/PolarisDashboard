import styled from 'styled-components'

export const Wrapper = styled.div`
  height: 460px;
  width: 100%;
`

export const TooltipCard = styled.div`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.m};
  background: rgba(10, 14, 28, 0.92);
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.soft};
  min-width: 210px;
`

export const TooltipTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`

export const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.text2};
`

export const Key = styled.span`
  color: ${({ theme }) => theme.color.text3};
`

