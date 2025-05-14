import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/Product"
import formidable from "formidable"
import path from "path"
//import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { id } = req.query

  // Obtener un producto por su ID
  if (req.method === "GET") {
    try {
      const product = await Product.findById(id)
      if (!product) return res.status(404).json({ message: "Producto no encontrado" })
      return res.status(200).json(product)
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Error al obtener producto: ", e.message)
      } else {
        console.error("Error desconocido al obtener producto: ")
      }
      return res.status(500).json({ message: "Error al obtener producto" })
    }
  }

  // Actualizar un producto por su ID
  if (req.method === "PUT") {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "/public/images"),
      keepExtensions: true,
      filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error al procesar formulario" })
      }

      const imageFile = files.image?.[0]
      const imagePath = imageFile ? `/images/${path.basename(imageFile.filepath)}` : undefined

      interface UpdateProductData {
        name : string
        price : number
        description?: string
        imageUrl?: string
      }

      const updateData: UpdateProductData = {
        name: Array.isArray(fields.name) ? fields.name[0] : fields.name || "",
        price: parseFloat(Array.isArray(fields.price) ? fields.price[0] : fields.price || "0"),
        description: Array.isArray(fields.description) ? fields.description[0] : fields.description,
      }

      if (imagePath) {
        updateData.imageUrl = imagePath
      }

      try {
        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
        return res.status(200).json(updated)
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error("Error al actualizar producto: ", e.message)
        } else {
          console.error("Error desconocido 7al actualizar producto")
        }
        return res.status(500).json({ message: "Error al actualizar producto" })
      }
    })
    return
  }

// Eliminar un producto por su ID
  if (req.method === "DELETE") {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id)
      if (!deletedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" })
      }
      return res.status(200).json({ message: "Producto eliminado" })
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Error al eliminar producto: ", e.message)
      } else { 
        console.error("Error desconocido al eliminar producto")
      }
      return res.status(500).json({ message: "Error al eliminar producto" })
    }
  }
  return res.status(405).json({ message: "Método no permitido" })
}