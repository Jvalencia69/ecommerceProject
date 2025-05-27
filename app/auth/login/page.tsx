'use client'

import { useContext, useState } from 'react'
import { AuthContext } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { login } = useContext(AuthContext)!
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') 

    try {
      await login(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    }
  }

  const handleRegisterRedirect = () => {
    router.push('/auth/register/')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-bold">Iniciar Sesión</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2"
        placeholder="Correo"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2"
        placeholder="Contraseña"
        required
      />
      <div className="flex flex-col gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ingresar
        </button>
        <button
          type="button"
          onClick={handleRegisterRedirect}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Registrarse
        </button>
        <button
          type="button"
          onClick={() => router.push('/auth/recuperar')}
          className="text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  )
}
