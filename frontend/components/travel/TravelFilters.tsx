import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { designTokens } from '../../styles/design-tokens'
import { TravelFilters as TF } from '../../src/hooks/useTravel'

interface Props {
  value: TF
  onChange: (v: TF) => void
}

export const TravelFilters: React.FC<Props> = ({ value, onChange }) => {
  const [local, setLocal] = useState<TF>(value)
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
      <label style={{ display: 'grid', gap: 6, color: '#E2E8F0' }}>
        <span style={{ fontSize: 12, opacity: 0.9 }}>Destino</span>
        <input
          value={local.destination}
          onChange={(e) => setLocal({ ...local, destination: e.target.value })}
          placeholder="Caldas Novas"
          style={{ background: '#0b1424', border: '1px solid #1E293B', color: '#E2E8F0', borderRadius: 8, padding: '10px 12px' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 6, color: '#E2E8F0' }}>
        <span style={{ fontSize: 12, opacity: 0.9 }}>Preço mín</span>
        <input
          type="number"
          value={local.minPrice || ''}
          onChange={(e) => setLocal({ ...local, minPrice: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="0"
          style={{ background: '#0b1424', border: '1px solid #1E293B', color: '#E2E8F0', borderRadius: 8, padding: '10px 12px' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 6, color: '#E2E8F0' }}>
        <span style={{ fontSize: 12, opacity: 0.9 }}>Preço máx</span>
        <input
          type="number"
          value={local.maxPrice || ''}
          onChange={(e) => setLocal({ ...local, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="5000"
          style={{ background: '#0b1424', border: '1px solid #1E293B', color: '#E2E8F0', borderRadius: 8, padding: '10px 12px' }}
        />
      </label>
      <Button onClick={() => onChange(local)}>Filtrar</Button>
    </div>
  )
}

export default TravelFilters

