'use client'

import { useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthProvider'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)!

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow bg-white">
      <Link href="/" className="text-xl font-bold text-black">Home</Link>
      
      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <>
            <Link href="/agregar-producto" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Agregar Producto
            </Link>
          </>
        )}

        {user?.role === 'client' && (
          <Link href="/carrito" className="relative">
            🛒
            {/* Aquí puedes mostrar un contador con la cantidad */}
            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">2</span> */}
          </Link>
        )}

        {!user && (
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        )}

        {user && (
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}