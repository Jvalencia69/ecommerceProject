'use client'

import { useState } from 'react'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/recuperar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setMensaje('Si existe una cuenta asociada, se ha enviado un correo de recuperación.')
    } else {
      setMensaje('Error al intentar recuperar la contraseña.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Enviar enlace
        </button>
        {mensaje && <p className="text-sm text-blue-600 mt-2">{mensaje}</p>}
      </form>
    </div>
  )
}
