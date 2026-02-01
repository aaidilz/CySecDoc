import { supabase } from '../database/supabase';

export const BlogModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('blogs') // Pastikan nama tabel di Supabase sudah benar
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      return []; // Balikkan array kosong jika terjadi error di DB
    }

    return data || []; // Pastikan jika data null, yang kembali adalah []
  }
};