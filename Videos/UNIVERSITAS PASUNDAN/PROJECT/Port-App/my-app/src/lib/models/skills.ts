import { supabase } from '../database/supabase';

export const SkillModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*');
    if (error) throw error;
    return data;
  },

  async create(skillData: any) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select();
    if (error) throw error;
    return data;
  }
};