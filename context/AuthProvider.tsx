'use client'

import React, { createContext, useState, useEffect } from 'react'

interface User {
  _id: string
  userName: string
  email: string
  role: 'admin' | 'client'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) setUser(JSON.parse(storedUser))
    } catch (error) {
      console.error("Error al cargar usuario desde localStorage:", error)
      localStorage.removeItem('user')
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Error al iniciar sesión")
    }

    const newUser: User = {
      _id: data._id,
      userName: data.userName,
      email: data.email,
      role: data.role,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
