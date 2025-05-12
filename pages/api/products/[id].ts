import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/Product"
import formidable from "formidable"
import path from "path"
import fs from "fs"

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
    } catch (error) {
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

      const updateData: any = {
        name: fields.name?.[0],
        price: parseFloat(fields.price?.[0]),
        description: fields.description?.[0],
      }

      if (imagePath) {
        updateData.imageUrl = imagePath
      }

      try {
        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
        return res.status(200).json(updated)
      } catch (e) {
        return res.status(500).json({ message: "Error al actualizar producto" })
      }
    })

    return
  }

  return res.status(405).json({ message: "Método no permitido" })
}
