import React from 'react'
import { TravelItem } from '../../src/hooks/useTravel'
import { TravelCard } from './TravelCard'

interface Props {
  items: TravelItem[]
  onPreview: (item: TravelItem) => void
}

export const TravelList: React.FC<Props> = ({ items, onPreview }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
      {items.map((t) => (
        <TravelCard key={t.id} item={t} onPreview={onPreview} />
      ))}
    </div>
  )
}

export default TravelList

