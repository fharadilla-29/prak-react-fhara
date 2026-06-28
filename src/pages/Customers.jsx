import { useState, useEffect } from "react"
import PageHeader from "../components/PageHeader"
import { supabase } from "../lib/supabase"
import Loading from "../components/Loading"

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'Member')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTierUpdate = async (customerId, newTier) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ tier: newTier })
        .eq('id', customerId)

      if (error) throw error
      fetchCustomers()
    } catch (err) {
      console.error('Failed to update tier:', err.message)
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <PageHeader title="Customers" breadcrumb="Loading..." />
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <PageHeader title="Customers" breadcrumb="Customer List">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-hijau text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
        >
          + Add New Customer
        </button>
      </PageHeader>

      {/* Modal Pop Up */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Customer</h2>
            <p className="text-gray-500 mb-4">
              Customers are registered via the Sign Up page. This admin panel manages existing customers.
            </p>
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

      {/* Customer Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Tier</th>
              <th className="p-4">Points</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id} className="border-t border-gray-50">
                <td className="p-4 font-bold text-gray-700">{cust.full_name}</td>
                <td className="p-4 text-sm text-gray-500">{cust.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <select
                    value={cust.tier}
                    onChange={(e) => handleTierUpdate(cust.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${
                      cust.tier === 'Platinum' ? 'bg-blue-100 text-blue-700' :
                      cust.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                      cust.tier === 'Silver' ? 'bg-gray-200 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </td>
                <td className="p-4 text-hijau font-bold">{cust.points}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(cust.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4">
                  <button className="text-gray-500 hover:text-gray-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="mt-6 text-center text-gray-500 py-10">
          No customers registered yet.
        </div>
      )}
    </div>
  )
}