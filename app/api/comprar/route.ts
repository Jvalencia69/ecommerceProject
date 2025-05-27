import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getUserFromToken } from '@/lib/auth' // función que extrae el usuario del token

export async function POST(req: Request) {
  try {
    const { items, total } = await req.json()
    const user = await getUserFromToken(req)

    if (!user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const db = await connectDB()
    await db.collection('orders').insertOne({
      userId: user._id,
      items,
      total,
      createdAt: new Date()
    })

    return NextResponse.json({ message: 'Compra registrada correctamente' })
  } catch (error) {
    return NextResponse.json({ message: 'Error al registrar la compra' }, { status: 500 })
  }
}