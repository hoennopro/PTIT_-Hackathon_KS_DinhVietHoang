import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

const filePath = path.join(process.cwd(), "database", "products.json");

// GET a product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await fs.readFile(filePath, "utf-8");
  const products: Product[] = JSON.parse(data);
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT to update a product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const updatedProduct: Partial<Product> = await request.json();

  const data = await fs.readFile(filePath, "utf-8");
  const products: Product[] = JSON.parse(data);

  const productIndex = products.findIndex((p) => p.id === Number(params.id));
  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  products[productIndex] = { ...products[productIndex], ...updatedProduct };

  await fs.writeFile(filePath, JSON.stringify(products, null, 2));

  return NextResponse.json(products[productIndex]);
}

// DELETE a product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await fs.readFile(filePath, "utf-8");
  let products: Product[] = JSON.parse(data);

  const productIndex = products.findIndex((p) => p.id === Number(params.id));
  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  products = products.filter((p) => p.id !== Number(params.id));

  await fs.writeFile(filePath, JSON.stringify(products, null, 2));

  return NextResponse.json({ message: "Product deleted" });
}

// GET all products
export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  const products: Product[] = JSON.parse(data);
  return NextResponse.json(products);
}

// POST a new product
export async function POST(request: NextRequest) {
  const newProduct: Product = await request.json();

  const data = await fs.readFile(filePath, "utf-8");
  const products: Product[] = JSON.parse(data);

  newProduct.id = Math.floor(Math.random() * 999999999); // Generate a random ID
  products.push(newProduct);

  await fs.writeFile(filePath, JSON.stringify(products, null, 2));

  return NextResponse.json(newProduct);
}
