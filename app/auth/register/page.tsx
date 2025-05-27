'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegistroPage() {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ userName, email, password }),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      setMensaje("Registro exitoso, ahora puedes iniciar sesión.")
      setTimeout(() => router.push("/auth/login"), 2000)
    } else {
      const data = await res.json()
      setMensaje(data.message || "Error al registrar")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
        type="userName"
        placeholder="Usuario"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border p-2 rounded"
        required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {mensaje && <p className="text-blue-600">{mensaje}</p>}
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Registrarse</button>
      </form>
    </div>
  )
}