import { supabase } from './supabaseClient'

export async function fetchProfile(userId) {
  return supabase
    .from('profiles')
    .select(
      'id, role, display_name, avatar_url, bio, city, level, phone, locale, preferred_venue_ids, onboarded_at, created_at, updated_at',
    )
    .eq('id', userId)
    .maybeSingle()
}

export async function updateProfile(userId, patch) {
  return supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select()
    .maybeSingle()
}

export async function upsertTrainer(userId, payload) {
  return supabase
    .from('trainers')
    .upsert({ id: userId, ...payload }, { onConflict: 'id' })
}

export async function upsertPlayerRatings(userId, payload) {
  return supabase
    .from('player_ratings')
    .upsert({ profile_id: userId, ...payload }, { onConflict: 'profile_id' })
}

// Replace a trainer's venue join rows wholesale. Two-step (delete then insert)
// keeps the schema simple — no need for a join-table upsert.
export async function setTrainerVenues(trainerId, venueIds) {
  const del = await supabase
    .from('trainer_venues')
    .delete()
    .eq('trainer_id', trainerId)
  if (del.error) return del
  if (venueIds.length === 0) return { error: null }
  const rows = venueIds.map((id) => ({ trainer_id: trainerId, venue_id: id }))
  return supabase.from('trainer_venues').insert(rows)
}
