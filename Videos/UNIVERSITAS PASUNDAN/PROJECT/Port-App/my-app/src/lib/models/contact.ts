import { supabase } from '../database/supabase';

export const ContactModel = {
  // Simpan pesan masuk dari form kontak portfolio
  async saveMessage(messageData: { name: string; email: string; message: string }) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([messageData])
      .select();
    if (error) throw error;
    return data;
  },

  // Ambil pesan (untuk dilihat admin)
  async getMessages() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};