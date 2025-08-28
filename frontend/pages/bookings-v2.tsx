import React, { useState } from 'react'
import Head from 'next/head'
import { useBooking } from '../src/hooks/useBooking'
import { Button } from '../components/ui/Button'
import { BookingModal } from '../components/booking/BookingModal'
import { BookingTable } from '../components/booking/BookingTable'
import { Calendar } from '../components/booking/Calendar'

export default function BookingsV2() {
  const { data: bookings = [], createBooking } = useBooking()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Head>
        <title>Reservas V2</title>
      </Head>
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpen(true)}>Nova Reserva</Button>
        </div>
        <Calendar items={bookings} />
        <BookingTable items={bookings} />
      </div>
      <div id="modal-root" />
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={async (payload) => {
          await createBooking({ ...payload, status: 'pending', paymentStatus: 'unpaid' } as any)
        }}
      />
    </>
  )
}

