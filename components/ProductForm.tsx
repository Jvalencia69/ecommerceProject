'use client'

import { useState } from "react"

export default function ProductForm({ product }: { product?: any }) {
  const [name, setName] = useState(product?.name || "")
  const [price, setPrice] = useState(product?.price || "")
  const [description, setDescription] = useState(product?.description || "")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const isEditing = Boolean(product)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("description", description)
    if (image) formData.append("image", image)

    const res = await fetch(`/api/products${isEditing ? `/${product._id}` : ""}`, {
      method: isEditing ? "PUT" : "POST",
      body: formData,
    })

    setLoading(false)

    if (res.ok) {
      window.location.href = "/"
    } else {
      alert("Error al guardar producto")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Guardando..." : isEditing ? "Actualizar" : "Agregar"}
      </button>
    </form>
  )
}
