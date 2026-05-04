import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";

export default function Produk() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products dari DummyJSON API
  useEffect(() => {
    axios
      .get("https://dummyjson.com/products?limit=30")
      .then((response) => {
        setAllProducts(response.data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get unique categories
  const categories = ["All", ...new Set(allProducts.map(p => p.category))];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.id.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-4">
        <PageHeader title="Produk" breadcrumb="Loading..." />
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <PageHeader title="Produk" breadcrumb="Error" />
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-semibold">❌ Error: {error}</p>
        </div>
      </div>
    );
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
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Product Title</label>
                <input type="text" className="w-full border rounded-xl p-3" placeholder="Product title" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <input type="text" className="w-full border rounded-xl p-3" placeholder="Category" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Brand</label>
                <input type="text" className="w-full border rounded-xl p-3" placeholder="Brand" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price</label>
                <input type="number" className="w-full border rounded-xl p-3" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Stock</label>
                <input type="number" className="w-full border rounded-xl p-3" placeholder="0" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold">Add Product</button>
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
              placeholder="Search product title or ID..." 
              className="w-full border rounded-xl p-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">Total: <span className="font-bold">{filteredProducts.length}</span> products</p>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Brand</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Rating</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-blue-500 font-semibold">{product.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link to={`/products/${product.id}`} className="text-emerald-500 hover:text-emerald-600 font-semibold">
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.brand || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      Rp {(product.price * 1000).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 20 
                          ? "bg-green-100 text-green-700" 
                          : product.stock > 10 
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-yellow-500 font-bold">⭐ {product.rating}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link to={`/products/${product.id}`} className="text-gray-500 hover:text-gray-700 text-lg">
                        👁️
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
