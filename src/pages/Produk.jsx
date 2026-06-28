import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PageHeader from "../components/PageHeader"
import Loading from "../components/Loading"
import Card from "../components/Card"
import { supabase } from "../lib/supabase"

export default function Produk() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      setAllProducts(data || [])
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

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setFormLoading(true)

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
      console.error('Failed to add product:', err.message)
    } finally {
      setFormLoading(false)
    }
  }

  // Get unique categories (using name as category since we don't have a category field)
  const categories = ["All", ...new Set(allProducts.map(p => p.name).filter(Boolean))]

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.id.toString().includes(searchTerm)
    const matchesCategory = selectedCategory === "All" || product.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="p-4">
        <PageHeader title="Produk" breadcrumb="Loading..." />
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <PageHeader title="Produk" breadcrumb="Error" />
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-semibold">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <PageHeader title="Produk" breadcrumb="Product List">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
        >
          + Add New Product
        </button>
      </PageHeader>

      {/* MODAL POP UP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
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
                <button type="submit" disabled={formLoading} className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">
                  {formLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER SECTION */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border p-4 mb-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search product name or ID..." 
              className="w-full border rounded-xl p-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">Total: <span className="font-bold">{filteredProducts.length}</span> products</p>
      </div>

      {/* PRODUCTS TABLE */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-blue-500 font-semibold">
                      {product.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link to={`/products/${product.id}`} className="text-emerald-500 hover:text-emerald-600 font-semibold">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {product.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link to={`/products/${product.id}`} className="text-gray-500 hover:text-gray-700 text-lg">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
