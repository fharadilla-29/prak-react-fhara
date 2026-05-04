import { useState } from "react";
import PageHeader from "../components/PageHeader";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy products data
  const productsData = [
    { id: "PRD-001", name: "Nasi Goreng", category: "Main Course", price: "Rp.45.000", status: "Active" },
    { id: "PRD-002", name: "Soto Ayam", category: "Soup", price: "Rp.35.000", status: "Active" },
    { id: "PRD-003", name: "Rendang Daging", category: "Main Course", price: "Rp.55.000", status: "Active" },
    { id: "PRD-004", name: "Gado-Gado", category: "Salad", price: "Rp.25.000", status: "Inactive" },
  ];

  return (
    <div className="p-4">
      <PageHeader title="Products" breadcrumb="Product List">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-hijau text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
        >
          + Add New Product
        </button>
      </PageHeader>

      {/* MODAL POP UP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Product Name</label>
                <input type="text" className="w-full border rounded-xl p-3" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <input type="text" className="w-full border rounded-xl p-3" placeholder="Category" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price</label>
                <input type="number" className="w-full border rounded-xl p-3" placeholder="Rp.0" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                <button type="submit" className="bg-hijau text-white px-6 py-2 rounded-xl font-bold">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Product ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Product Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-blue-500 font-medium">{product.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.price}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-gray-500 hover:text-gray-700">👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
