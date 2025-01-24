import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gukvkyekmmdlmliomxtj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1a3ZreWVrbW1kbG1saW9teHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDg3MDYsImV4cCI6MjA1MzMyNDcwNn0.zlEKMxFEFlTBu4ePr_gSVes4s0ZMhTbQe-V9jxiQflg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
})