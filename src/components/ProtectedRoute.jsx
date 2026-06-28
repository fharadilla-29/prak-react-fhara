import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loading />
            </div>
        )
    }

    // Not authenticated -> redirect to login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Authenticated tapi profil tidak ditemukan -> arahkan ke login.
    // (AuthContext sudah otomatis signOut dan menyimpan pesan.)
    if (!profile) {
        return <Navigate to="/login" replace />
    }

    // Check role access
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on actual role
        if (profile.role === 'Admin') {
            return <Navigate to="/dashboard" replace />
        }
        return <Navigate to="/member/catalog" replace />
    }

    return children
}
