"use client";
import { useCart } from "@/context/CartContext";

export default function CarritoPage() {
  const { cartItems, clearCart } = useCart();
  const handleCompra = async () => {
    const res = await fetch("/api/comprar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems, total }),
    });

    if (res.ok) {
      clearCart();
      alert("Compra exitosa");
    } else {
      alert("Hubo un problema al procesar la compra");
    }

    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>

        {cartItems && cartItems.length > 0 ? (
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li key={index} className="p-4 border rounded">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>${item.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes productos en tu carrito.</p>
        )}
      </div>
    );
  };
}
