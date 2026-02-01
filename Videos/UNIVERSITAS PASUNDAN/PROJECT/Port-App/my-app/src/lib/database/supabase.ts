import { createClient } from '@supabase/supabase-js';

// Mengambil variabel lingkungan dari file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi untuk memastikan variabel lingkungan sudah terisi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables. Check your .env.local file.');
}

// Inisialisasi client Supabase yang bisa digunakan di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey);