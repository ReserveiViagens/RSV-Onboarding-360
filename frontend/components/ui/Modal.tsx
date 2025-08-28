import React, { useEffect } from 'react'
import { designTokens } from '../../styles/design-tokens'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!open) return null

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(640px, 92vw)',
          background: designTokens.colors.surface,
          borderRadius: designTokens.radius.lg,
          border: '1px solid #1E293B',
          boxShadow: designTokens.shadow.lg
        }}
      >
        {title && (
          <div style={{ padding: designTokens.spacing.lg, borderBottom: '1px solid #1E293B', color: designTokens.colors.text }}>
            <strong>{title}</strong>
          </div>
        )}
        <div style={{ padding: designTokens.spacing.lg, color: designTokens.colors.text }}>{children}</div>
      </div>
    </div>
  )

  if (typeof window === 'undefined') return dialog
  const mount = document.getElementById('modal-root') || document.body
  return createPortal(dialog, mount)
}

export default Modal

