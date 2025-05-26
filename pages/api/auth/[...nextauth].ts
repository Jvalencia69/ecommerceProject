// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials?.email })

        if (!user) throw new Error("Usuario no encontrado")

        const isValid = await bcrypt.compare(credentials!.password, user.password)
        if (!isValid) throw new Error("Contraseña incorrecta")

        return { id: user._id, email: user.email, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
