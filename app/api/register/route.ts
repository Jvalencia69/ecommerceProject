import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    await connectDB()

    const existe = await User.findOne({ email })
    if (existe) {
      return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ email, password: hashedPassword })
    await newUser.save()

    return NextResponse.json({ message: "Usuario creado correctamente" })
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 })
  }
}
