// components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useCart } from "@/context/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

export default function ProductCard({ product }: { product: any }) {
  const { user } = useContext(AuthContext)!;
  const { addToCart } = useCart();
  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de eliminar este producto?");
    if (!confirm) return;

    const res = await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      window.location.reload(); // recarga la página para ver los cambios
    } else {
      alert("Error al eliminar producto");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      {/* Obtener producto*/}
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

      {/* MOSTRAR SOLO SI EL USUARIO ES !ADMIN */}

      {user?.role !== "admin" && (
        <button
          onClick={handleAddToCart}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Comprar
        </button>
      )}

      {/* MOSTRAR SOLO SI EL USUARIO ES ADMIN */}

      {/* Eliminar producto*/}
      {user?.role === "admin" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>

          {/* Editar producto*/}
          <Link
            href={`/editar-producto/${product._id}`}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Editar
          </Link>
        </div>
      )}
    </div>
  );
}