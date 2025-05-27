import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { userName, email, password } = await req.json()

    if(!userName || !email || !password) {
       return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    await connectDB()

    const existeUserName = await User.findOne({ userName })
    if (existeUserName) {
      return NextResponse.json({ message: "El usuario ya está registrado" }, { status: 400 })
    }

    const existeEmail = await User.findOne({ email })
    if (existeEmail) {
      return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ userName, email, password: hashedPassword })
    await newUser.save()

    return NextResponse.json({ message: "Usuario creado correctamente" })
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 })
  }
}