export const designTokens = {
  colors: {
    primary: '#2563EB',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    background: '#0B1220',
    surface: '#0F172A',
    text: '#E2E8F0',
    muted: '#94A3B8'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px'
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    full: '9999px'
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.25)',
    lg: '0 10px 30px rgba(0,0,0,0.35)'
  }
} as const;

export type DesignTokens = typeof designTokens;
