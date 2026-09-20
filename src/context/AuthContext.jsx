import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

// Comma-separated frontend admin allowlist from the Vite environment.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

const cacheBasicUser = (user) => {
  if (!user?.id) return
  try {
    localStorage.setItem(`monimala_user_${user.id}`, JSON.stringify({
      id: user.id,
      name: user.user_metadata?.name || '',
      email: user.email || '',
    }))
  } catch (error) {
    console.warn('Unable to cache user details in this browser.', error)
  }
}

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileSummary, setProfileSummary] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user ?? null
      cacheBasicUser(sessionUser)
      setUser(sessionUser)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null
        cacheBasicUser(sessionUser)
        setUser(sessionUser)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setProfileSummary(null)
      return
    }

    let cancelled = false
    const cacheKey = `monimala_user_${user.id}`
    let cached = {}
    try {
      cached = JSON.parse(localStorage.getItem(cacheKey) || '{}')
    } catch {
      cached = {}
    }

    const summary = {
      id: user.id,
      email: user.email || cached.email || '',
      name: user.user_metadata?.name || cached.name || '',
    }
    setProfileSummary(summary)
    cacheBasicUser({ ...user, user_metadata: { ...user.user_metadata, name: summary.name } })

    // Most accounts already include the name in their Auth session. Only look
    // in the profile table when that field is absent, avoiding a routine query.
    if (!summary.name) {
      supabase.from('users').select('name,email').eq('id', user.id).maybeSingle()
        .then(({ data, error }) => {
          if (error) throw error
          if (cancelled || !data) return
          const hydrated = { ...summary, name: data.name || '', email: data.email || summary.email }
          setProfileSummary(hydrated)
          try {
            localStorage.setItem(cacheKey, JSON.stringify(hydrated))
          } catch (cacheError) {
            console.warn('Unable to cache user details in this browser.', cacheError)
          }
        })
        .catch((error) => console.warn('Unable to load the profile name.', error))
    }

    return () => { cancelled = true }
  }, [user?.id])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())

  return (
    <AuthContext.Provider value={{ user, loading, profileSummary, signIn, signUp, signOut, isAdmin, ADMIN_EMAILS }}>
      {children}
    </AuthContext.Provider>
  )
}
