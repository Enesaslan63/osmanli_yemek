import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mjirclsozfpkwjjwdzly.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_CoDxxMNap0v4HqHUViAGIw_j7kTeeJ5"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

