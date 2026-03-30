import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
`

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(7, 10, 20, 0.65);
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

export const TopBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

export const Brand = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  letter-spacing: 0.2px;
`

export const BrandTitle = styled.div`
  font-weight: 760;
`

export const BrandSub = styled.div`
  color: ${({ theme }) => theme.color.text3};
  font-size: 12px;
`

export const Nav = styled.nav`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const NavItem = styled(NavLink)`
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.color.text2};

  &.active {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.surface};
    border-color: ${({ theme }) => theme.color.border};
  }
`

export const Main = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 18px;
`

