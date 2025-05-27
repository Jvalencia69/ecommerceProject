import { jwtVerify } from 'jose'
import { ObjectId } from 'mongodb'
import { connectDB } from './mongodb'

export async function getUserFromToken(req: Request) {
  const token = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('token='))?.split('=')[1]
  if (!token) return null

  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))
  const db = await connectDB()
  const user = await db.collection('users').findOne({ email: payload.email })
  return user
}
