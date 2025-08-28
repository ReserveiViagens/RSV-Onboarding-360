import React from 'react'
import { designTokens } from '../../styles/design-tokens'

interface CardProps {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, actions, children }) => {
  return (
    <div
      style={{
        background: designTokens.colors.surface,
        borderRadius: designTokens.radius.lg,
        boxShadow: designTokens.shadow.md,
        border: '1px solid #1E293B',
      }}
    >
      {(title || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: designTokens.spacing.lg,
            borderBottom: '1px solid #1E293B',
            color: designTokens.colors.text
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
          <div>{actions}</div>
        </div>
      )}
      <div style={{ padding: designTokens.spacing.lg, color: designTokens.colors.text }}>{children}</div>
    </div>
  )
}

export default Card

