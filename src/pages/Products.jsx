import { useState, useEffect } from "react"
import PageHeader from "../components/PageHeader"
import { supabase } from "../lib/supabase"
import Loading from "../components/Loading"

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError("")

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: form.name,
          description: form.description,
          price: Number(form.price),
        })

      if (error) throw error

      setIsModalOpen(false)
      setForm({ name: "", description: "", price: "" })
      fetchProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      fetchProducts()
    } catch (err) {
      console.error('Failed to delete:', err.message)
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <PageHeader title="Products" breadcrumb="Loading..." />
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl p-3"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Product description"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price (Rp)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border rounded-xl p-3"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                <button type="submit" disabled={formLoading} className="bg-hijau text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">
                  {formLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Product Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{product.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="mt-6 text-center text-gray-500 py-10">
          No products added yet. Click "Add New Product" to get started.
        </div>
      )}
    </div>
  )
}
