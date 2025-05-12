// // app/page.tsx

import ProductForm from "@/components/ProductForm"
import ProductCard from "@/components/ProductCard"

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" })
  return res.json()
}

export default async function Home() {
  const products = await fetchProducts()

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <ProductForm />
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  )
}
