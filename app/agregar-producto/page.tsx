"use client";

import ProductForm from "@/components/ProductForm";
import { useAuth } from "@/context/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Solo para administradores */}
      {user?.role === "admin" && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4">Agregar nuevo producto</h2>
          <ProductForm />
        </section>
      )}
    </main>
  );
}
