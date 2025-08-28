import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useTravel } from '../src/hooks/useTravel'
import { TravelFilters } from '../components/travel/TravelFilters'
import { TravelList } from '../components/travel/TravelList'
import { TravelModal } from '../components/travel/TravelModal'
import { Button } from '../components/ui/Button'

export default function TravelV2() {
  const { items, hasMore, loadMore, setFilters, filters } = useTravel()
  const [preview, setPreview] = useState<any>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore) loadMore()
      })
    })
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, loadMore])

  return (
    <>
      <Head>
        <title>Viagens V2</title>
      </Head>
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <h1 style={{ color: '#E2E8F0', margin: 0 }}>Catálogo de Viagens</h1>
        <TravelFilters value={filters} onChange={setFilters} />
        <TravelList items={items} onPreview={setPreview} />
        {hasMore ? (
          <div ref={sentinelRef} style={{ height: 24 }} />
        ) : (
          <div style={{ opacity: 0.8, color: '#E2E8F0' }}>Fim da lista</div>
        )}
      </div>
      <div id="modal-root" />
      <TravelModal open={!!preview} onClose={() => setPreview(null)} item={preview || undefined} />
    </>
  )
}

