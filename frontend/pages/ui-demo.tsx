import React, { useState } from 'react'
import Head from 'next/head'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Modal } from '../components/ui/Modal'
import { Table, Column } from '../components/ui/Table'
import { Form, Field } from '../components/ui/Form'
import { z } from 'zod'

interface Row { id: number; name: string; status: string }

const schema = z.object({ fullName: z.string().min(3), email: z.string().email() })

export default function UiDemoPage() {
  const [open, setOpen] = useState(false)
  const rows: Row[] = [
    { id: 1, name: 'João Silva', status: 'Ativo' },
    { id: 2, name: 'Maria Souza', status: 'Pendente' },
  ]
  const columns: Column<Row>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Ativo' ? 'success' : 'warning'}>{r.status}</Badge> },
  ]

  return (
    <>
      <Head>
        <title>UI Demo</title>
      </Head>
      <div style={{ padding: 24, display: 'grid', gap: 16 }}>
        <h1 style={{ color: '#E2E8F0' }}>Componentes Base</h1>
        <Card title="Buttons" actions={<Avatar name="Usuário Demo" />}> 
          <div style={{ display: 'flex', gap: 12 }}>
            <Button>Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Perigo</Button>
            <Button loading>Carregando</Button>
          </div>
        </Card>

        <Card title="Tabela">
          <Table columns={columns} data={rows} />
        </Card>

        <Card title="Formulário">
          <Form schema={schema} defaultValues={{ fullName: '', email: '' }} onSubmit={(d) => alert(JSON.stringify(d))}>
            <Field name="fullName" label="Nome completo" placeholder="Digite seu nome" />
            <Field name="email" label="Email" placeholder="email@exemplo.com" />
            <Button type="submit">Enviar</Button>
          </Form>
        </Card>

        <Card title="Modal">
          <Button onClick={() => setOpen(true)}>Abrir modal</Button>
          <Modal open={open} onClose={() => setOpen(false)} title="Exemplo de Modal">
            <p>Conteúdo da modal</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={() => setOpen(false)}>Confirmar</Button>
            </div>
          </Modal>
        </Card>
      </div>
    </>
  )
}

