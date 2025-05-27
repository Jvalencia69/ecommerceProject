"use client"

import { useCart } from "@/context/CartContext"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/AuthProvider"

export default function CarritoPage() {
  const { cartItems, clearCart } = useCart()
  const { user } = useContext(AuthContext)!
  const [mensaje, setMensaje] = useState("")

  const handlePagar = async () => {
    if (!user) {
      setMensaje("Debes iniciar sesión para pagar.")
      return
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        items: cartItems,
      }),
    })

    if (res.ok) {
      clearCart()
      setMensaje("Compra realizada con éxito.")
    } else {
      setMensaje("Error al procesar la compra.")
      console.log(user)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="mb-4 space-y-2">
            {cartItems.map((item, idx) => (
              <li key={idx} className="border p-2 rounded">
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <button
            onClick={handlePagar}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Pagar
          </button>
          {mensaje && <p className="mt-4 text-blue-600">{mensaje}</p>}
        </>
      )}
    </div>
  )
}
