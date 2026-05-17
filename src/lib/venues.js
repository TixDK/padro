import { supabase } from './supabaseClient'

export async function fetchVenues() {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, city, slug')
    .eq('active', true)
    .order('city', { ascending: true })
    .order('name', { ascending: true })
  return { data: data ?? [], error }
}
