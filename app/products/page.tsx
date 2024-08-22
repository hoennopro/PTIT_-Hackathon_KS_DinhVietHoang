"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: 0,
    productName: "",
    price: 0,
    image: "",
    quantity: 1,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      console.log("Fetched products:", data); // Debugging log
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/products` : "/api/products";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      fetchProducts();
      Swal.fire(
        isEditing ? "Updated!" : "Added!",
        "Product saved successfully!",
        "success"
      );
      setNewProduct({
        id: 0,
        productName: "",
        price: 0,
        image: "",
        quantity: 1,
      });
      setIsEditing(false);
    } else {
      const errorData = await response.json();
      Swal.fire("Error", errorData.error, "error");
    }
  };

  const handleEdit = (product: Product) => {
    setNewProduct(product);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchProducts();
      Swal.fire("Deleted!", "Product has been deleted.", "success");
    } else {
      const errorData = await response.json();
      Swal.fire("Error", errorData.error, "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">STT</th>
                <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                <th className="border border-gray-300 p-2">Hình ảnh</th>
                <th className="border border-gray-300 p-2">Giá</th>
                <th className="border border-gray-300 p-2">Số lượng</th>
                <th className="border border-gray-300 p-2">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {product.productName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-12 h-12 object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.price.toLocaleString()} VND
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.quantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-4 bg-white p-4 shadow-md rounded">
          <h2 className="text-lg font-semibold mb-4">Thêm mới sản phẩm</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tên</label>
              <input
                type="text"
                name="productName"
                value={newProduct.productName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Hình ảnh</label>
              <input
                type="text"
                name="image"
                value={newProduct.image}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Giá</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              {isEditing ? "Cập nhật" : "Thêm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
