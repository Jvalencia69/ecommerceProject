// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { SignJWT } from 'jose'
import { serialize } from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body

  const role = email === "admin@tecno.com" ? "admin" : "cliente"
  const payload = { email, role }

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
  res.status(200).json({ message: "Login success", role })
}