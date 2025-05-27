import { connectDB } from "@/lib/db"
import Orders from "@/models/Orders"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await connectDB()
  const { items, userId } = await req.json()

  const user = await User.findOne({ email: userId })
  if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

  const order = await Orders.create({
    userId: user._id,
    items,
    total,
  })

  return NextResponse.json(order)
}