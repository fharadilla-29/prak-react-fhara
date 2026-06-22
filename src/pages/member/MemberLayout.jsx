import { Outlet } from "react-router-dom"
import { NavLink, useNavigate } from "react-router-dom"
import { MdStorefront, MdShoppingBag, MdHistory, MdLogout } from "react-icons/md"
import { useAuth } from "../../contexts/AuthContext"

export default function MemberLayout() {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all ${
            isActive
                ? "text-hijau bg-green-200 font-extrabold"
                : "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`

    const handleLogout = async () => {
        await signOut()
        navigate("/login")
    }

    const tierColors = {
        Bronze: "text-amber-700",
        Silver: "text-gray-500",
        Gold: "text-yellow-500",
        Platinum: "text-blue-400",
    }

    return (
        <div id="app-container" className="bg-gray-100 min-h-screen flex">
            <div id="layout-wrapper" className="flex flex-row flex-1">
                {/* Member Sidebar */}
                <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
                    <div id="sidebar-logo" className="flex flex-col">
                        <span id="logo-title" className="font-poppins text-[48px] text-gray-900">
                            Sedap <b id="logo-dot" className="text-hijau">.</b>
                        </span>
                        <span id="logo-subtitle" className="font-semibold text-gray-400">Member Portal</span>
                    </div>

                    <div id="sidebar-menu" className="mt-10">
                        <ul id="menu-list" className="space-y-3">
                            <li>
                                <NavLink to="/member/catalog" className={menuClass}>
                                    <MdStorefront className="mr-4 text-xl" />
                                    Catalog
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/member/order" className={menuClass}>
                                    <MdShoppingBag className="mr-4 text-xl" />
                                    Create Order
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/member/history" className={menuClass}>
                                    <MdHistory className="mr-4 text-xl" />
                                    My Orders
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div id="sidebar-footer" className="mt-auto">
                        {/* Member Tier Info */}
                        <div id="footer-card" className="bg-hijau px-4 py-2 rounded-md shadow-lg mb-6 flex items-center justify-between">
                            <div id="footer-text" className="text-white text-sm">
                                <span className="font-bold">{profile?.full_name || 'Member'}</span>
                                <div className="mt-1">
                                    Tier: <span className={`font-extrabold ${tierColors[profile?.tier] || 'text-white'}`}>{profile?.tier}</span>
                                </div>
                                <div>
                                    Points: <span className="font-bold">{profile?.points || 0}</span>
                                </div>
                            </div>
                            <img id="footer-avatar" className="w-20 rounded-full ml-4" src="https://i.pravatar.cc/100" alt="Avatar" />
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full cursor-pointer items-center rounded-xl p-4 space-x-2 text-red-500 hover:bg-red-50 transition-all font-semibold"
                        >
                            <MdLogout className="mr-4 text-xl" />
                            Logout
                        </button>

                        <span id="footer-brand" className="font-bold text-gray-400">Sedap Member Portal</span>
                        <p id="footer-copyright" className="font-light text-gray-400">&copy; 2026 All Right Reserved</p>
                    </div>
                </div>

                {/* Main Content */}
                <div id="main-content" className="flex-1 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
