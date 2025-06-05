import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const ALLOWED_FILES = ["products.json", "faqs.json", "seller_notes.json", "payment_config.json"]

// Helper to ensure data directory and file exist with default content
function ensureFile(filePath: string, defaultContentGenerator: () => string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContentGenerator(), "utf8")
  }
}

function getDefaultContent(fileName: string): string {
  switch (fileName) {
    case "products.json":
    case "faqs.json":
      return "[]"
    case "seller_notes.json":
      return JSON.stringify({ title: "Important Seller Notes", notes: [] }, null, 2)
    case "payment_config.json":
      return JSON.stringify(
        {
          telegramContact: "",
          paymentInstructionsTitle: "",
          paymentInstructions: "",
          accounts: [],
          confirmationNote: "",
        },
        null,
        2,
      )
    default:
      return "{}"
  }
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Access denied. Admin API is for development only." }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get("file")

  if (!fileName || !ALLOWED_FILES.includes(fileName)) {
    return NextResponse.json({ error: "Invalid or missing file parameter" }, { status: 400 })
  }

  const filePath = path.join(DATA_DIR, fileName)
  ensureFile(filePath, () => getDefaultContent(fileName))

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const jsonData = JSON.parse(fileContent)
    return NextResponse.json(jsonData)
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error)
    return NextResponse.json({ error: `Failed to read ${fileName}` }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Access denied. Admin API is for development only." }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get("file")

  if (!fileName || !ALLOWED_FILES.includes(fileName)) {
    return NextResponse.json({ error: "Invalid or missing file parameter" }, { status: 400 })
  }

  const filePath = path.join(DATA_DIR, fileName)
  ensureFile(filePath, () => getDefaultContent(fileName)) // Ensure file exists before writing

  try {
    const body = await request.json()
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8")
    return NextResponse.json({ message: `${fileName} updated successfully` })
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error)
    return NextResponse.json({ error: `Failed to write ${fileName}` }, { status: 500 })
  }
}
