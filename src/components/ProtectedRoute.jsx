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

    // Authenticated but profile not loaded yet
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loading />
            </div>
        )
    }

    // Check role access
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on actual role
        if (profile.role === 'Admin') {
            return <Navigate to="/" replace />
        }
        return <Navigate to="/member/catalog" replace />
    }

    return children
}
