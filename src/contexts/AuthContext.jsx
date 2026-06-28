import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch profile for the given user
    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (!error && data) {
            setProfile(data)
            return data
        }

        // Profil tidak ditemukan di tabel users -> sesi tidak valid untuk aplikasi ini.
        // Logout supaya tidak terjebak di layar loading selamanya.
        sessionStorage.setItem(
            'auth_message',
            'Profil akun tidak ditemukan. Hubungi admin atau daftar ulang.'
        )
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        return null
    }

    useEffect(() => {
        // Get initial session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                await fetchProfile(session.user.id)
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        }
        initSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    setUser(session.user)
                    await fetchProfile(session.user.id)
                } else {
                    setUser(null)
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id)
        }
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
