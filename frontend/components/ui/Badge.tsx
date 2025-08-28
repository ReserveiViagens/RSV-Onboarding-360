import React from 'react'
import { designTokens } from '../../styles/design-tokens'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const colors: Record<BadgeVariant, { bg: string; fg: string; border: string }> = {
    default: { bg: '#122033', fg: designTokens.colors.text, border: '#1E293B' },
    success: { bg: '#052e2b', fg: '#22C55E', border: '#0b4f3f' },
    warning: { bg: '#3b2a05', fg: '#F59E0B', border: '#5b4009' },
    danger: { bg: '#3a0c0c', fg: '#F87171', border: '#5b1a1a' }
  }

  const c = colors[variant]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: designTokens.radius.full,
        fontSize: 12,
        fontWeight: 600,
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`
      }}
    >
      {children}
    </span>
  )
}

export default Badge

