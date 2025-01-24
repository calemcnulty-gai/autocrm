import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://olfgwqwvvywhjmxhzmby.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZmd3cXd2dnl3aGpteGh6bWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTc0NzQsImV4cCI6MjA1Mjk3MzQ3NH0.j_UD8dZUqSFgHDCus7AVkFhGDzIQw0DCKXJxNijy4mk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
})