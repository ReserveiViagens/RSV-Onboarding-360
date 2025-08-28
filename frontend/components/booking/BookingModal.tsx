import React from 'react'
import { Modal } from '../ui/Modal'
import { Form, Field } from '../ui/Form'
import { Button } from '../ui/Button'
import { z } from 'zod'
import { BookingItem } from '../../src/hooks/useBooking'

const schema = z.object({
  packageName: z.string().min(3),
  customer: z.string().min(3),
  checkIn: z.string().min(10),
  checkOut: z.string().min(10),
  value: z.coerce.number().min(0)
})

interface BookingModalProps {
  open: boolean
  onClose: () => void
  onCreate: (payload: Omit<BookingItem, 'id' | 'status' | 'paymentStatus'>) => Promise<void>
}

export const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, onCreate }) => {
  return (
    <Modal open={open} onClose={onClose} title="Nova Reserva">
      <Form
        schema={schema}
        defaultValues={{ packageName: '', customer: '', checkIn: '', checkOut: '', value: 0 }}
        onSubmit={async (data) => {
          await onCreate(data as any)
          onClose()
        }}
      >
        <Field name="packageName" label="Pacote" placeholder="Caldas Novas Família 3 dias" />
        <Field name="customer" label="Cliente" placeholder="João Silva" />
        <Field name="checkIn" label="Check-in" type="date" />
        <Field name="checkOut" label="Check-out" type="date" />
        <Field name="value" label="Valor (R$)" type="number" step="0.01" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Criar</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default BookingModal

