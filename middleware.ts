// middleware.ts
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  const pathname = request.nextUrl.pathname

  const adminRoutes = ["/agregar-producto", "/editar-producto"]

  const isAdminRoute = adminRoutes.some(path =>
    pathname.startsWith(path)
  )

  if (isAdminRoute) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url))

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))

      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/agregar-producto",
    "/editar-producto/:path*", // protege también subrutas como /editar-producto/[id]
  ],
}
