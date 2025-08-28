import React from 'react'
import { useAuth } from '../../context/AuthContext'

interface ProtectedProps {
  permission?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const Protected: React.FC<ProtectedProps> = ({ permission, children, fallback = null }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return null
  if (permission && !hasPermission(permission)) return <>{fallback}</>
  return <>{children}</>
}

export default Protected