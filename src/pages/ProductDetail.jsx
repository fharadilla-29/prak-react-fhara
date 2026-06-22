import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import Loading from "../components/Loading"
import { supabase } from "../lib/supabase"

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setProduct(data)
        } catch (err) {
            setError(err.message)
        }
    }

    if (error) {
        return (
            <div className="p-4">
                <PageHeader title="Product Detail" breadcrumb="Detail" />
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
                    <button
                        onClick={() => navigate("/produk")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-all"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="p-4">
                <PageHeader title="Product Detail" breadcrumb="Loading..." />
                <div className="mt-6 flex justify-center">
                    <Loading />
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <PageHeader title="Product Detail" breadcrumb={product.name} />

            <div className="mt-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-6 leading-relaxed">{product.description || 'No description available.'}</p>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-semibold">Price:</span>
                                    <span className="text-green-600 font-bold text-2xl">
                                        Rp {Number(product.price).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-600 text-sm">Stock:</span>
                                    <p className={`font-bold text-lg ${product.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 text-sm">Product ID:</span>
                                    <p className="font-mono bg-white p-2 rounded text-sm mt-1">{product.id}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600 text-sm">Added:</span>
                                    <p className="font-bold text-lg text-blue-600">
                                        {new Date(product.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-600 transition-all">
                                    Edit Product
                                </button>
                                <button className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-600 transition-all">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="pt-6 border-t">
                        <button
                            onClick={() => navigate("/produk")}
                            className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2"
                        >
                            Back to Product List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
