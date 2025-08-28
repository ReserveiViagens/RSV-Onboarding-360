import React from 'react'
import { designTokens } from '../../styles/design-tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}) => {
  const base = {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
    borderRadius: designTokens.radius.md,
    border: '1px solid transparent',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
    cursor: 'pointer' as const,
    transition: 'background 0.2s, opacity 0.2s'
  }

  const sizes: Record<ButtonSize, React.CSSProperties> = {
    sm: { fontSize: 12, padding: `${designTokens.spacing.xs} ${designTokens.spacing.md}` },
    md: { fontSize: 14 },
    lg: { fontSize: 16, padding: `${designTokens.spacing.md} ${designTokens.spacing.xl}` }
  }

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: designTokens.colors.primary, color: '#fff' },
    secondary: { background: designTokens.colors.secondary, color: '#052e2b' },
    ghost: { background: 'transparent', color: designTokens.colors.text, borderColor: '#2A3447' },
    danger: { background: designTokens.colors.danger, color: '#fff' }
  }

  const style: React.CSSProperties = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    opacity: disabled || loading ? 0.6 : 1
  }

  return (
    <button style={style} disabled={disabled || loading} {...props}>
      {loading ? 'Aguarde...' : children}
    </button>
  )
}

export default Button

