"use client"

import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export default function LogoutButton({ className = "", children = "Logout" }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Hapus auth token
    deleteCookie('auth-token')
    
    // Redirect ke signin
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className={`text-red-600 hover:text-red-800 ${className}`}
    >
      {children}
    </button>
  )
}