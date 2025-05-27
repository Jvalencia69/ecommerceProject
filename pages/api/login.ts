import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { serialize } from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { email, password } = req.body

  try {
    await connectDB()
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    // Generar JWT
    const payload = { email: user.email, role: user.role }
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2,
    })

    res.setHeader("Set-Cookie", cookie)

    return res.status(200).json({
      message: "Login exitoso",
      _id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error("Error en login:", error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}
