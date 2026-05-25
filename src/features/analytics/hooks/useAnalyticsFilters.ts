import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AnalyticsFilter, Platform } from '../types'
import { ALL_PLATFORMS } from '../constants'

export const DEFAULT_FILTER: AnalyticsFilter = {
  keywords: [],
  dateFrom: '',
  dateTo: '',
  platforms: [...ALL_PLATFORMS],
}

export function useAnalyticsFilters() {
  const [params, setParams] = useSearchParams()

  const filter: AnalyticsFilter = {
    keywords: params.get('kw')?.split(',').filter(Boolean) ?? DEFAULT_FILTER.keywords,
    dateFrom: params.get('from') ?? DEFAULT_FILTER.dateFrom,
    dateTo: params.get('to') ?? DEFAULT_FILTER.dateTo,
    platforms: (params.get('plat')?.split(',').filter(Boolean) as Platform[]) ?? DEFAULT_FILTER.platforms,
  }

  const setFilter = useCallback((updates: Partial<AnalyticsFilter>) => {
    setParams(prev => {
      const next = new URLSearchParams(prev)
      if (updates.keywords !== undefined) {
        if (updates.keywords.length) next.set('kw', updates.keywords.join(','))
        else next.delete('kw')
      }
      if (updates.dateFrom !== undefined) next.set('from', updates.dateFrom)
      if (updates.dateTo !== undefined) next.set('to', updates.dateTo)
      if (updates.platforms !== undefined) {
        if (updates.platforms.length === ALL_PLATFORMS.length) next.delete('plat')
        else next.set('plat', updates.platforms.join(','))
      }
      return next
    }, { replace: true })
  }, [setParams])

  return { filter, setFilter }
}
