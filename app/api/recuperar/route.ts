import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()

  // Aquí podrías consultar en MongoDB si el usuario existe

  console.log(`Simulando envío de email de recuperación a: ${email}`)

  return NextResponse.json({ success: true })
}