import React from 'react'
import { designTokens } from '../../styles/design-tokens'

interface AvatarProps {
  name: string
  src?: string
  size?: number
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 36 }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#1E293B',
        border: '1px solid #334155',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: designTokens.colors.text,
        fontWeight: 700
      }}
      aria-label={`Avatar de ${name}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} width={size} height={size} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

export default Avatar

