'use client'

import { useContext } from 'react'
import { AuthContext } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'

export default function BannerLogin() {
  const { user, logout } = useContext(AuthContext)!
  const router = useRouter()

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <section className="p-4 bg-gray-100 text-center">
      {user ? (
        <div className="flex justify-center items-center gap-4">
          <span className="text-gray-800">Bienvenido, {user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      )}
    </section>
  )
}