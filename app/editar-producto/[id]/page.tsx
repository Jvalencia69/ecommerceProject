import { notFound } from "next/navigation"
import ProductForm from "@/components/ProductForm"

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function EditarProducto({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) return notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar producto</h1>
      <ProductForm product={product} />
    </div>
  )
}
