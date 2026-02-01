import { supabase } from '../database/supabase';

export const ProjectModel = {
  // Ambil semua project
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Tambah project baru (untuk dashboard admin)
  async create(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();
    if (error) throw error;
    return data;
  }
};