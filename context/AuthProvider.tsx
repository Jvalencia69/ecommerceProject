// context/AuthProvider.tsx
'use client'

import React, { createContext, useState, useEffect } from 'react'

interface User {
  userName: string
  email: string
  role: 'admin' | 'cliente'
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
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

const login = async (email: string, password: string) => {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" }
  })

  if (!res.ok) throw new Error("Login failed")

  const data = await res.json()
  const newUser = { email, role: data.role }
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
