import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AppLayout from './components/layout/AppLayout.tsx'
import Analytics from './features/analytics/Analytics.tsx'
import OverviewPage from './features/analytics/pages/OverviewPage.tsx'
import SentimentPage from './features/analytics/pages/SentimentPage.tsx'
import SourcePage from './features/analytics/pages/SourcePage.tsx'
import GeoPage from './features/analytics/pages/GeoPage.tsx'
import TrendPage from './features/analytics/pages/TrendPage.tsx'
import PestlePage from './features/analytics/pages/PestlePage.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route element={<AppLayout />}>
            <Route path="/analytics" element={<Analytics />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="sentiment" element={<SentimentPage />} />
              <Route path="source" element={<SourcePage />} />
              <Route path="geo" element={<GeoPage />} />
              <Route path="trend" element={<TrendPage />} />
              <Route path="pestle" element={<PestlePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
