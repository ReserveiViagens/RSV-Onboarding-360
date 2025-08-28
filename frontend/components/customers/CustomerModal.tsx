import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Form, Field } from '../ui/Form'
import { Button } from '../ui/Button'
import { z } from 'zod'
import { CustomerItem } from '../../src/hooks/useCustomers'

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
})

interface CustomerModalProps {
  open: boolean
  onClose: () => void
  onCreate: (payload: Omit<CustomerItem, 'id'>) => Promise<void>
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ open, onClose, onCreate }) => {
  const [files, setFiles] = useState<File[]>([])

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    // validação simples: tipos e tamanho
    const valid = selected.filter((f) => (['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)) && f.size <= 5 * 1024 * 1024)
    setFiles(valid)
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo Cliente">
      <Form
        schema={schema}
        defaultValues={{ name: '', email: '', phone: '' }}
        onSubmit={async (data) => {
          const documents = files.map((f) => ({ name: f.name, type: f.type, size: f.size }))
          await onCreate({ ...(data as any), documents })
          onClose()
        }}
      >
        <Field name="name" label="Nome" placeholder="Nome completo" />
        <Field name="email" label="Email" placeholder="email@exemplo.com" />
        <Field name="phone" label="Telefone" placeholder="(65) 90000-0000" />
        <label htmlFor="upload" style={{ display: 'grid', gap: 6, color: '#E2E8F0' }}>
          <span style={{ fontSize: 12, opacity: 0.9 }}>Documentos (PDF, JPG, PNG, 5MB máx)</span>
          <input id="upload" type="file" multiple onChange={onFiles} />
          {files.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {files.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          )}
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Criar</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default CustomerModal

