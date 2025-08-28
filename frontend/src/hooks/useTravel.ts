import { useEffect, useMemo, useRef, useState } from 'react'

export interface TravelItem {
  id: number
  destination: string
  price: number
  duration: string
  amenities: string[]
  image?: string
}

export interface TravelFilters {
  destination: string
  minPrice?: number
  maxPrice?: number
}

const allMock: TravelItem[] = Array.from({ length: 60 }).map((_, i) => ({
  id: i + 1,
  destination: ['Caldas Novas', 'Rio Quente', 'Hot Park', 'Lagoa Quente'][i % 4],
  price: 700 + (i % 10) * 100,
  duration: ['2 noites', '3 noites', '4 noites'][i % 3],
  amenities: ['Piscina', 'Café', 'Estacionamento'].slice(0, (i % 3) + 1),
  image: undefined,
}))

export function useTravel(initialPageSize = 12) {
  const [filters, setFilters] = useState<TravelFilters>({ destination: '' })
  const [page, setPage] = useState(1)
  const pageSizeRef = useRef(initialPageSize)

  const filtered = useMemo(() => {
    return allMock.filter((t) => {
      const matchDestination = !filters.destination || t.destination.toLowerCase().includes(filters.destination.toLowerCase())
      const matchMin = filters.minPrice == null || t.price >= filters.minPrice
      const matchMax = filters.maxPrice == null || t.price <= filters.maxPrice
      return matchDestination && matchMin && matchMax
    })
  }, [filters])

  const list = useMemo(() => filtered.slice(0, page * pageSizeRef.current), [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const loadMore = () => setPage((p) => p + 1)

  return {
    items: list,
    hasMore: list.length < filtered.length,
    loadMore,
    setFilters,
    filters,
  }
}

