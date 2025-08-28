import React, { useState } from 'react'
import Head from 'next/head'
import { useCustomers } from '../src/hooks/useCustomers'
import { Button } from '../components/ui/Button'
import { CustomerList } from '../components/customers/CustomerList'
import { CustomerModal } from '../components/customers/CustomerModal'
import { CustomerProfile } from '../components/customers/CustomerProfile'

export default function CustomersV2() {
  const { data: customers = [], createCustomer } = useCustomers()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const current = customers.find((c) => c.id === selected) || customers[0]

  return (
    <>
      <Head>
        <title>Clientes V2</title>
      </Head>
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: '#E2E8F0', margin: 0 }}>Gestão de Clientes</h1>
          <Button onClick={() => setOpen(true)}>Novo Cliente</Button>
        </div>
        {current && <CustomerProfile customer={current} />}
        <div onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName === 'TD') {
            const row = target.parentElement
            const idCell = row?.querySelector('td')?.textContent
            const id = idCell ? parseInt(idCell, 10) : NaN
            if (!isNaN(id)) setSelected(id)
          }
        }}>
          <CustomerList items={customers} />
        </div>
      </div>
      <div id="modal-root" />
      <CustomerModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={async (data) => {
          await createCustomer(data)
        }}
      />
    </>
  )
}

