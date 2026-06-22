import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-4xl font-poppins font-extrabold text-gray-800">
                        <span className="text-black">Sedap</span>
                        <span className="text-hijau">.</span>
                    </h1>
                </div>

                <Outlet/>

                <p className="text-center text-sm text-gray-500 mt-6">
                    © 2026 Sedap Admin Dashboard. All rights reserved.
                </p>
            </div>
        </div>
    )
}
