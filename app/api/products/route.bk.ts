// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/Product"
import formidable from "formidable"
import fs from "fs"
import path from "path"

// Next.js edge runtime no soporta formidable, así que forzamos a usar Node.js
export const config = {
  api: {
    bodyParser: false,
  },
}

function createUploadDir() {
  const uploadDir = path.join(process.cwd(), "public/images")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  return uploadDir
}

async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  const form = formidable({
    multiples: false,
    uploadDir: createUploadDir(),
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return `${Date.now()}-${part.originalFilename}`
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { fields, files } = await parseForm(req)

    const imageFile = files.image[0]
    const imagePath = `/images/${path.basename(imageFile.filepath)}`

    const newProduct = new Product({
      name: fields.name[0],
      price: parseFloat(fields.price[0]),
      description: fields.description[0],
      imageUrl: imagePath
    })

    const saved = await newProduct.save()
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Error subiendo producto" }, { status: 500 })
  }
}