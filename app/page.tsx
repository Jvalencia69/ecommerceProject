// app/page.tsx
'use client'

import ProductCard from "@/components/ProductCard"
// import BannerLogin from "@/components/BannerLogin"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/useAuth"
import { useEffect, useState } from "react"

export default function Home() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white py-8 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Tecno E-commerce</h1>
        <p className="text-lg max-w-xl mx-auto">
          Encuentra la mejor tecnología al mejor precio. Descubre nuestros productos destacados.
        </p>
      </section>
      
      {/* <BannerLogin /> */}
      <Navbar />

      {/* Área de productos */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6"  >Nuestros Productos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}