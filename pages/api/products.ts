// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import path from "path"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/Product"

export const config = {
  api: {
    bodyParser: false,
  },
}

// Crea el directorio de imágenes si no existe
const createUploadDir = () => {
  const dir = path.join(process.cwd(), "/public/images")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method === "GET") {
    try {
      const products = await Product.find().sort({ createdAt: -1 }) // traer los productos más recientes primero
      return res.status(200).json(products)
    } catch (error) {
      console.error("Error al obtener productos:", error)
      return res.status(500).json({ message: "Error al obtener productos" })
    }
  }

  if (req.method === "POST") {
    const form = formidable({
      uploadDir: createUploadDir(),
      keepExtensions: true,
      filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: "Error al procesar formulario" })
      }

      const imageFile = files.image?.[0]
      const imagePath = imageFile ? `/images/${path.basename(imageFile.filepath)}` : ""

      const product = new Product({
        name: fields.name?.[0] || "",
        price: parseFloat(fields.price?.[0] || "0"),
        description: fields.description?.[0] || "",
        imageUrl: imagePath,
      })

      try {
        const saved = await product.save()
        return res.status(201).json(saved)
      } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Error al guardar producto" })
      }
    })

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
          const updated = await Product.findByIdAndUpdate(req.query.id, updateData, { new: true })
          return res.status(200).json(updated)
        } catch (e) {
          return res.status(500).json({ message: "Error al actualizar producto" })
        }
      })
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" })
  }
}
