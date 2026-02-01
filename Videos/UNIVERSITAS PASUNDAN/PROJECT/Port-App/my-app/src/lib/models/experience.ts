import { supabase } from '../database/supabase';

export const ExperienceModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(expData: any) {
    const { data, error } = await supabase
      .from('experiences')
      .insert([expData])
      .select();
    if (error) throw error;
    return data;
  }
};