import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvejstgsucdgunpahsyt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWpzdGdzdWNkZ3VucGFoc3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNjg2NzEsImV4cCI6MjEwMzY0NDY3MX0.nwd8TAkTTbpGUKZVVOIfUDPQqZDJ5H4JyQg-kVAHyoM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)