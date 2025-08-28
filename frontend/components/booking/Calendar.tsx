import React, { useMemo, useState } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { BookingItem } from '../../src/hooks/useBooking'

interface CalendarProps {
  items: BookingItem[]
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export const Calendar: React.FC<CalendarProps> = ({ items }) => {
  const days = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [])

  const [lanes, setLanes] = useState<Record<string, BookingItem[]>>(() => {
    const byDay: Record<string, BookingItem[]> = {}
    for (const d of days) byDay[formatDate(d)] = []
    for (const it of items) {
      const day = it.checkIn
      if (byDay[day]) byDay[day].push(it)
    }
    return byDay
  })

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    const sourceDay = active.data.current?.day as string
    const targetDay = over.id as string
    if (!sourceDay || !targetDay || sourceDay === targetDay) return
    const sourceList = lanes[sourceDay] || []
    const targetList = lanes[targetDay] || []
    const idx = sourceList.findIndex((x) => String(x.id) === String(active.id))
    if (idx === -1) return
    const [moved] = sourceList.splice(idx, 1)
    const updated: Record<string, BookingItem[]> = { ...lanes }
    updated[sourceDay] = [...sourceList]
    updated[targetDay] = [...targetList, { ...moved, checkIn: targetDay }]
    setLanes(updated)
  }

  return (
    <Card title="Calendário (14 dias)" actions={<Badge>Arraste reservas para reagendar</Badge>}>
      <DndContext onDragEnd={onDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {days.map((d) => {
            const dayKey = formatDate(d)
            const list = lanes[dayKey] || []
            return (
              <div key={dayKey} aria-label={`Dia ${dayKey}`}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>{dayKey}</div>
                <div
                  id={dayKey}
                  style={{
                    minHeight: 120,
                    border: '1px dashed #334155',
                    borderRadius: 8,
                    padding: 6,
                    display: 'grid',
                    gap: 6,
                    background: '#0b1424'
                  }}
                >
                  <SortableContext items={list.map((i) => String(i.id))} strategy={verticalListSortingStrategy}>
                    {list.map((it) => (
                      <DraggableBooking key={it.id} item={it} day={dayKey} />
                    ))}
                  </SortableContext>
                </div>
              </div>
            )
          })}
        </div>
      </DndContext>
    </Card>
  )
}

import { useDraggable } from '@dnd-kit/core'

function DraggableBooking({ item, day }: { item: BookingItem; day: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: String(item.id), data: { day } })
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    background: '#122033',
    border: '1px solid #1E293B',
    borderRadius: 8,
    padding: 8,
    color: '#E2E8F0',
    fontSize: 12,
    cursor: 'grab'
  }
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} aria-label={`Reserva ${item.packageName}`}>
      <div style={{ fontWeight: 700 }}>{item.packageName}</div>
      <div style={{ opacity: 0.8 }}>{item.customer}</div>
    </div>
  )
}

export default Calendar

