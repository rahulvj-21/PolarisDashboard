import { Outlet } from 'react-router-dom'

import {
  Brand,
  BrandSub,
  BrandTitle,
  Main,
  Nav,
  NavItem,
  Shell,
  TopBar,
  TopBarInner,
} from './styledComponents'

export function AppLayout() {
  return (
    <Shell>
      <TopBar>
        <TopBarInner>
          <Brand>
            <BrandTitle>Polaris</BrandTitle>
            <BrandSub>Metering analytics</BrandSub>
          </Brand>
          <Nav>
            <NavItem to="/visualize">Visualize</NavItem>
            <NavItem to="/config">Configuration</NavItem>
          </Nav>
        </TopBarInner>
      </TopBar>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}

