import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import AppLayout from './components/layout/AppLayout'
import Analytics from './features/analytics/Analytics'
import { ThemeProvider } from './context/ThemeContext'
import { ResearchProvider } from './features/research/context/ResearchContext'

const ResearchPage  = lazy(() => import('./features/research/Research'))
const ProjectPage   = lazy(() => import('./features/research/pages/ProjectPage'))
const SettingsPage  = lazy(() => import('./features/settings/Settings'))
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
        {/* ResearchProvider wraps the whole app so the sidebar can read notifications */}
        <ResearchProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route element={<AppLayout />}>

              <Route path="/research" element={<Suspense fallback={null}><ResearchPage /></Suspense>} />
              <Route path="/research/projects/:projectId" element={<Suspense fallback={null}><ProjectPage /></Suspense>} />

              <Route path="/settings" element={<Suspense fallback={null}><SettingsPage /></Suspense>} />
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
        </ResearchProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
