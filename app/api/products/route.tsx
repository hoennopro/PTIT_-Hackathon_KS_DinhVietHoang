import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "database", "products.json");

function readData() {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
}

function writeData(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET all products
export async function GET() {
  const products = readData();
  return NextResponse.json(products);
}

// POST add a new product
export async function POST(request: Request) {
  const products = readData();
  const newProduct = await request.json();

  // Validation
  if (
    !newProduct.productName ||
    !newProduct.price ||
    !newProduct.image ||
    !newProduct.quantity
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  newProduct.id = Math.floor(Math.random() * 999999999);
  products.push(newProduct);
  writeData(products);

  return NextResponse.json(newProduct);
}

// PUT update a product by id
export async function PUT(request: Request) {
  const products = readData();
  const { id, productName, price, image, quantity } = await request.json();

  // Validation
  if (!id || !productName || !price || !image || !quantity) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const productIndex = products.findIndex((p: any) => p.id === id);
  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  products[productIndex] = { id, productName, price, image, quantity };
  writeData(products);

  return NextResponse.json(products[productIndex]);
}

// DELETE a product by id
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const products = readData();

  const newProducts = products.filter((p: any) => p.id !== id);
  writeData(newProducts);

  return NextResponse.json(newProducts);
}

// GET search products by name
export async function PATCH(request: Request) {
  const { searchTerm } = await request.json();
  const products = readData();

  const filteredProducts = products.filter((p: any) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return NextResponse.json(filteredProducts);
}
