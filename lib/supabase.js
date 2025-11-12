import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signIn = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  
  // In production, use proper password hashing (bcrypt)
  // For now, comparing directly (NOT SECURE - implement proper auth)
  if (data && data.password_hash === password) {
    return { user: data, error: null }
  }
  
  return { user: null, error: { message: 'Invalid credentials' } }
}

export const signOut = () => {
  // Clear cookies/session
  if (typeof window !== 'undefined') {
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}

export const getCurrentUser = () => {
  // Implement session management
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('hotel_user')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}