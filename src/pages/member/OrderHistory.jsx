import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/PageHeader"
import Loading from "../../components/Loading"
import Card from "../../components/Card"

export default function OrderHistory() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            // Fetch orders with their items
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(name))')
                .eq('member_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const statusColors = {
        Pending: "bg-yellow-100 text-yellow-700",
        Processing: "bg-blue-100 text-blue-700",
        Completed: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-700",
    }

    if (loading) {
        return (
            <div className="p-4">
                <PageHeader title="My Orders" breadcrumb="Order History" />
                <div className="mt-6 flex justify-center">
                    <Loading />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <PageHeader title="My Orders" breadcrumb="Error" />
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-semibold">Error: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <PageHeader title="My Orders" breadcrumb="Order History" />

            <div className="mt-6 space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-sm text-gray-400 font-mono">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Order Items */}
                        {order.order_items && order.order_items.length > 0 && (
                            <div className="border-t pt-3 mb-3">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-1">
                                        <span className="text-gray-600">
                                            {item.products?.name || 'Product'} x{item.quantity}
                                        </span>
                                        <span className="text-gray-800 font-medium">
                                            Rp {(Number(item.price_at_purchase) * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Order Totals */}
                        <div className="border-t pt-3 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal:</span>
                                <span>Rp {Number(order.total_original).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Discount:</span>
                                <span className="text-red-500">- Rp {Number(order.discount_applied).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-1">
                                <span>Total:</span>
                                <span className="text-green-600">Rp {Number(order.total_final).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </Card>
                ))}

                {orders.length === 0 && (
                    <Card className="text-center py-10">
                        <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                        <a
                            href="/member/catalog"
                            className="inline-block mt-4 bg-hijau text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
                        >
                            Browse Catalog
                        </a>
                    </Card>
                )}
            </div>
        </div>
    )
}
