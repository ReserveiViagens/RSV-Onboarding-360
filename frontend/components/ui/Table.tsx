import React from 'react'
import { designTokens } from '../../styles/design-tokens'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyText?: string
}

export function Table<T>({ columns, data, emptyText = 'Sem registros' }: TableProps<T>) {
  return (
    <div style={{ border: '1px solid #1E293B', borderRadius: designTokens.radius.lg, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0b1424', color: designTokens.colors.text }}>
            {columns.map((c) => (
              <th key={String(c.key)} style={{ textAlign: 'left', padding: designTokens.spacing.md, fontWeight: 600 }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: designTokens.spacing.lg, color: designTokens.colors.muted }}>
                {emptyText}
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={idx} style={{ color: designTokens.colors.text, borderTop: '1px solid #1E293B' }}>
              {columns.map((c) => (
                <td key={String(c.key)} style={{ padding: designTokens.spacing.md }}>
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

