import { lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import AppLayout from './components/layout/AppLayout'
import Analytics from './features/analytics/Analytics'
import { ThemeProvider } from './context/ThemeContext'

const OverviewPage  = lazy(() => import('./features/analytics/pages/OverviewPage'))
const SentimentPage = lazy(() => import('./features/analytics/pages/SentimentPage'))
const SourcePage    = lazy(() => import('./features/analytics/pages/SourcePage'))
const GeoPage       = lazy(() => import('./features/analytics/pages/GeoPage'))
const TrendPage     = lazy(() => import('./features/analytics/pages/TrendPage'))
const PestlePage    = lazy(() => import('./features/analytics/pages/PestlePage'))

export default function AppRouter() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route element={<AppLayout />}>
            <Route path="/analytics" element={<Analytics />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview"  element={<OverviewPage  />} />
              <Route path="sentiment" element={<SentimentPage />} />
              <Route path="source"    element={<SourcePage    />} />
              <Route path="geo"       element={<GeoPage       />} />
              <Route path="trend"     element={<TrendPage     />} />
              <Route path="pestle"    element={<PestlePage    />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
