import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import { calculateDiscount, addPointsAndCheckTier } from "../../services/tierService"
import PageHeader from "../../components/PageHeader"
import Card from "../../components/Card"

export default function CreateOrder() {
    const { user, profile, refreshProfile } = useAuth()
    const [cart, setCart] = useState(() => {
        // Load cart from sessionStorage if available
        const saved = sessionStorage.getItem('cart')
        return saved ? JSON.parse(saved) : []
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Calculate totals
    const totalOriginal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountRate = calculateDiscount(profile?.tier)
    const discountApplied = totalOriginal * discountRate
    const totalFinal = totalOriginal - discountApplied

    const updateQuantity = (productId, delta) => {
        setCart(prev => {
            const updated = prev.map(item => {
                if (item.id === productId) {
                    const newQty = item.quantity + delta
                    return newQty > 0 ? { ...item, quantity: newQty } : item
                }
                return item
            }).filter(item => item.quantity > 0)

            sessionStorage.setItem('cart', JSON.stringify(updated))
            return updated
        })
    }

    const removeItem = (productId) => {
        setCart(prev => {
            const updated = prev.filter(item => item.id !== productId)
            sessionStorage.setItem('cart', JSON.stringify(updated))
            return updated
        })
    }

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError("Your cart is empty.")
            return
        }

        setLoading(true)
        setError("")
        setSuccess("")

        try {
            // 1. Insert order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    member_id: user.id,
                    total_original: totalOriginal,
                    discount_applied: discountApplied,
                    total_final: totalFinal,
                    status: 'Pending',
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Insert order items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_purchase: item.price,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // 3. Deduct stock for each product
            for (const item of cart) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.id)
                    .single()

                if (product) {
                    const newStock = Math.max(0, product.stock - item.quantity)
                    await supabase
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', item.id)
                }
            }

            // 4. Add points and check tier upgrade
            const tierResult = await addPointsAndCheckTier(user.id, totalOriginal)
            await refreshProfile()

            // 5. Clear cart
            setCart([])
            sessionStorage.removeItem('cart')

            let successMsg = "Order placed successfully!"
            if (tierResult.newTier !== tierResult.previousTier) {
                successMsg += ` Congratulations! You've been upgraded to ${tierResult.newTier} tier!`
            }
            setSuccess(successMsg)

            setTimeout(() => setSuccess(""), 5000)
        } catch (err) {
            setError(err.message || "Failed to place order.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <PageHeader title="Create Order" breadcrumb="Checkout" />

            {success && (
                <div className="mt-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl">
                    {success}
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {cart.length === 0 ? (
                <Card className="mt-6 text-center py-10">
                    <p className="text-gray-500 text-lg">Your cart is empty.</p>
                    <a
                        href="/member/catalog"
                        className="inline-block mt-4 bg-hijau text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
                    >
                        Browse Catalog
                    </a>
                </Card>
            ) : (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <h3 className="font-bold text-lg mb-4">Cart Items</h3>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Rp {Number(item.price).toLocaleString('id-ID')} each
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="w-32 text-right font-bold text-green-600">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card>
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-bold">Rp {totalOriginal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Discount ({profile?.tier} - {(discountRate * 100).toFixed(0)}%):
                                    </span>
                                    <span className="font-bold text-red-500">
                                        - Rp {discountApplied.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t text-lg">
                                    <span className="font-bold">Total:</span>
                                    <span className="font-bold text-green-600">
                                        Rp {totalFinal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Points earned: {Math.floor(totalOriginal / 10000)} pts
                                </div>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="mt-6 w-full bg-hijau text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-all disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Place Order"}
                            </button>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
