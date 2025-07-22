import { createClient } from '@supabase/supabase-js'

// Use cloud Supabase for production
const supabaseUrl = 'https://ojbxzdjishhqscjeicsd.supabase.co/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qYnh6ZGppc2hocXNjamVpY3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjUxMTMsImV4cCI6MjA2ODI0MTExM30.ybjsV4sr3G0F-NlhzoCSNzthQ4rbV_yFtd4kx151z1g'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 