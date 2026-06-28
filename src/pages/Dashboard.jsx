import { useState, useEffect } from "react"
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa"
import PageHeader from "../components/PageHeader"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalCompleted: 0,
        totalCancelled: 0,
        totalRevenue: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Count total orders
            const { count: orderCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })

            // Count completed orders
            const { count: completedCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Success')

            // Count cancelled orders
            const { count: cancelledCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Cancelled')

            // Sum total revenue (only completed/Success orders)
            const { data: revenueData } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('status', 'Success')

            const totalRevenue = (revenueData || []).reduce(
                (sum, order) => sum + Number(order.total_amount), 0
            )

            setStats({
                totalOrders: orderCount || 0,
                totalCompleted: completedCount || 0,
                totalCancelled: cancelledCount || 0,
                totalRevenue,
            })
        } catch (err) {
            console.error('Failed to fetch stats:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="dashboard-container">
            <PageHeader 
                title="Dashboard" 
                breadcrumb="Statistics" 
                buttonText="+ Filter Data" 
            />
            <div className="p-5">
                <p className="text-2xl font-bold text-gray-800">Selamat datang dan belajar di dashboard, Fhara Dilla Rizky</p>
            </div>
            <div id="dashboard-grid" className="p-5 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div id="dashboard-orders" className="bg-green-200 rounded-lg p-4 flex items-center space-x-4">
                    <div id="orders-icon" className="bg-hijau rounded-full p-4 text-3xl text-white ">
                        <FaShoppingCart />
                    </div>
                    <div id="orders-info" className="flex flex-col">
                        <span id="orders-count" className="font-bold">
                            {loading ? '...' : stats.totalOrders}
                        </span>
                        <span id="orders-text" className="text-gray-400">Total Orders</span>
                    </div>
                </div>

                <div id="dashboard-delivered" className="bg-blue-100 rounded-lg p-4 flex items-center space-x-4">
                    <div id="delivered-icon" className="bg-blue-500 rounded-full p-4 text-3xl text-white ">
                        <FaTruck />
                    </div>
                    <div id="delivered-info" className="flex flex-col">
                        <span id="delivered-count" className="font-bold">
                            {loading ? '...' : stats.totalCompleted}
                        </span>
                        <span id="delivered-text" className="text-gray-400">Total Delivered</span>
                    </div>
                </div>

                <div id="dashboard-canceled" className="bg-red-100 rounded-lg p-4 flex items-center space-x-4">
                    <div id="canceled-icon" className="bg-red-500 rounded-full p-4 text-3xl text-white">
                        <FaBan />
                    </div>
                    <div id="canceled-info" className="flex flex-col">
                        <span id="canceled-count" className="font-bold">
                            {loading ? '...' : stats.totalCancelled}
                        </span>
                        <span id="canceled-text" className="text-gray-400">Total Canceled</span>
                    </div>
                </div>

                <div id="dashboard-revenue" className="bg-yellow-100 rounded-lg p-4 flex items-center space-x-4">
                    <div id="revenue-icon" className="bg-yellow-500 rounded-full p-4 text-3xl text-white">
                        <FaDollarSign />
                    </div>
                    <div id="revenue-info" className="flex flex-col">
                        <span id="revenue-amount" className="font-bold">
                            {loading ? '...' : `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
                        </span>
                        <span id="revenue-text" className="text-gray-400">Total Revenue</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
