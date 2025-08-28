import React from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TravelItem } from '../../src/hooks/useTravel'

interface Props {
  open: boolean
  onClose: () => void
  item?: TravelItem
}

export const TravelModal: React.FC<Props> = ({ open, onClose, item }) => {
  if (!item) return null
  return (
    <Modal open={open} onClose={onClose} title={item.destination}>
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ height: 180, background: '#0b1424', borderRadius: 8 }} />
        <div>Duração: <strong>{item.duration}</strong></div>
        <div>Preço: <strong>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        <div>Comodidades: {item.amenities.join(', ')}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  )
}

export default TravelModal

