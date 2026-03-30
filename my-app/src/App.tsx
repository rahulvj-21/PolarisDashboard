import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout/index'
import { ConfigScreen } from './pages/ConfigScreen/index'
import { VisualizeScreen } from './pages/VisualizeScreen/index'

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/visualize" replace />} />
        <Route path="/visualize" element={<VisualizeScreen />} />
        <Route path="/config" element={<ConfigScreen />} />
        <Route path="*" element={<Navigate to="/visualize" replace />} />
      </Route>
    </Routes>
  )
}

