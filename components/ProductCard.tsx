// components/ProductCard.tsx
'use client'

import Image from "next/image"
import Link from "next/link"

type Product = {
  _id: string
  name: string
  price: number
  description?: string
  imageUrl?: string
}

export default function ProductCard({ product }: { product: any }) {
  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de eliminar este producto?")
    if (!confirm) return

    const res = await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      window.location.reload() // recarga la página para ver los cambios
    } else {
      alert("Error al eliminar producto")
    }
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={200}
        className="object-cover rounded-md mb-2"
      />
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p>${product.price}</p>
      <p className="text-sm text-gray-600">{product.description}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>

        {/* Aquí pondremos el botón Editar más adelante */}
        <Link
  href={`/editar-producto/${product._id}`}
  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
>
  Editar
</Link>
      </div>
    </div>
  )
}