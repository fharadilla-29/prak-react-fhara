import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/PageHeader"
import Loading from "../../components/Loading"
import Card from "../../components/Card"

export default function Catalog() {
    const { profile } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [cart, setCart] = useState(() => {
        const saved = sessionStorage.getItem('cart')
        return saved ? JSON.parse(saved) : []
    })

    const updateCart = (newCart) => {
        setCart(newCart)
        sessionStorage.setItem('cart', JSON.stringify(newCart))
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .gt('stock', 0)
                .order('created_at', { ascending: false })

            if (error) throw error
            setProducts(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (product) => {
        updateCart((() => {
            const existing = cart.find(item => item.id === product.id)
            if (existing) {
                return cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...cart, { ...product, quantity: 1 }]
        })())
    }

    if (loading) {
        return (
            <div className="p-4">
                <PageHeader title="Product Catalog" breadcrumb="Catalog" />
                <div className="mt-6 flex justify-center">
                    <Loading />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <PageHeader title="Product Catalog" breadcrumb="Error" />
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-semibold">Error: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <PageHeader title="Product Catalog" breadcrumb="Catalog">
                {cart.length > 0 && (
                    <a
                        href="/member/order"
                        className="bg-hijau text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
                    >
                        Go to Checkout ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </a>
                )}
            </PageHeader>

            {/* Cart Summary */}
            {cart.length > 0 && (
                <Card className="mt-4 mb-4 bg-green-50 border-green-200">
                    <h3 className="font-bold text-lg mb-2">Your Cart</h3>
                    <div className="space-y-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span>{item.name} x{item.quantity}</span>
                                <span className="font-bold text-green-600">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between font-bold">
                        <span>Subtotal:</span>
                        <span className="text-green-600">
                            Rp {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        Your tier: <span className="font-bold">{profile?.tier}</span> (discount will be applied at checkout)
                    </div>
                </Card>
            )}

            {/* Products Grid */}
            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex-1">{product.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-green-600 font-bold text-lg">
                                Rp {Number(product.price).toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-400">
                                Stock: {product.stock}
                            </span>
                        </div>
                        <button
                            onClick={() => addToCart(product)}
                            className="mt-3 w-full bg-hijau text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
                        >
                            + Add to Cart
                        </button>
                    </Card>
                ))}
            </div>

            {products.length === 0 && (
                <div className="mt-10 text-center text-gray-500">
                    No products available at the moment.
                </div>
            )}
        </div>
    )
}
