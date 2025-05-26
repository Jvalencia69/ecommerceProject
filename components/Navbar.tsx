'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthProvider'

export default function Navbar() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error("AuthContext no disponible")

     return (
    <nav>
      {auth.user ? (
        <>
          <span>Hola, {auth.user.email}</span>
          <button onClick={auth.logout}>Cerrar sesión</button>
        </>
      ) : (
        <span>No estás autenticado</span>
      )}
    </nav>
  )
}