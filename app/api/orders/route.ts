import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await connectDB()
  const { items, userEmail } = await req.json()

  const user = await User.findOne({ email: userEmail })
  if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

  const order = await Order.create({
    userId: user._id,
    items,
    total,
  })

  return NextResponse.json(order)
}