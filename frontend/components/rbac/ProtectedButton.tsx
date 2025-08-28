import React from 'react'
import { useAuth } from '../../context/AuthContext'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: string
}

export const ProtectedButton: React.FC<Props> = ({ permission, children, ...props }) => {
  const { hasPermission } = useAuth()
  if (!hasPermission(permission)) return null
  return <button {...props}>{children}</button>
}

export default ProtectedButton

