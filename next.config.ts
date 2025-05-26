import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  matcher: ["/agregar-producto", "/editar-producto/:path*"],
};

export default nextConfig;
