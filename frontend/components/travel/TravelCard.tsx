import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TravelItem } from '../../src/hooks/useTravel'

interface TravelCardProps {
  item: TravelItem
  onPreview: (item: TravelItem) => void
}

export const TravelCard: React.FC<TravelCardProps> = ({ item, onPreview }) => {
  return (
    <Card>
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ height: 120, background: '#0b1424', borderRadius: 8 }} />
        <strong>{item.destination}</strong>
        <span style={{ opacity: 0.8 }}>{item.duration}</span>
        <span>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {item.amenities.map((a) => (
            <span key={a} style={{ fontSize: 12, opacity: 0.8 }}>#{a}</span>
          ))}
        </div>
        <div>
          <Button onClick={() => onPreview(item)}>Preview</Button>
        </div>
      </div>
    </Card>
  )
}

export default TravelCard

