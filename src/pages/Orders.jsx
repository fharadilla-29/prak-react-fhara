import { useState, useEffect } from "react"
import PageHeader from "../components/PageHeader"
import { supabase } from "../lib/supabase"
import Loading from "../components/Loading"

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (err) {
      console.error('Failed to update status:', err.message)
    }
  }

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Success: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  }

  if (loading) {
    return (
      <div className="p-4">
        <PageHeader title="Orders" breadcrumb="Loading..." />
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <PageHeader title="Orders" breadcrumb="Order List">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-hijau text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
        >
          View All Orders
        </button>
      </PageHeader>

      {/* Modal - Order Summary */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Statistics</h2>
            <div className="space-y-3">
              <p>Total Orders: <span className="font-bold">{orders.length}</span></p>
              <p>Pending: <span className="font-bold">{orders.filter(o => o.status === 'Pending').length}</span></p>
              <p>Success: <span className="font-bold">{orders.filter(o => o.status === 'Success').length}</span></p>
              <p>Cancelled: <span className="font-bold">{orders.filter(o => o.status === 'Cancelled').length}</span></p>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Member</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold text-blue-500 text-sm">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="p-4 text-sm">
                  {order.users?.full_name || 'Unknown'}
                </td>
                <td className="p-4 font-bold text-green-600 text-sm">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4">
                  <button className="text-gray-500 hover:text-gray-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="mt-6 text-center text-gray-500 py-10">
          No orders placed yet.
        </div>
      )}
    </div>
  )
}