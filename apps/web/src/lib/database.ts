import { supabase } from './supabase'
import type { AuthUser } from './supabase'

export interface Prediction {
  id: string
  user_id: string
  project_description: string
  prediction_result: any
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Save a prediction to the database
export async function savePrediction(
  userId: string,
  projectDescription: string,
  predictionResult: any
): Promise<Prediction | null> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping database save')
    return null
  }
  const { data, error } = await supabase
    .from('user_predictions')
    .insert([
      {
        user_id: userId,
        project_description: projectDescription,
        prediction_result: predictionResult,
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// Get all predictions for a user
export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  if (!supabase) {
    return []
  }
  const { data, error } = await supabase
    .from('user_predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get a specific prediction by ID
export async function getPredictionById(
  userId: string,
  predictionId: string
): Promise<Prediction | null> {
  if (!supabase) {
    return null
  }
  const { data, error } = await supabase
    .from('user_predictions')
    .select('*')
    .eq('user_id', userId)
    .eq('id', predictionId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// Delete a prediction
export async function deletePrediction(
  userId: string,
  predictionId: string
): Promise<void> {
  if (!supabase) {
    return
  }
  const { error } = await supabase
    .from('user_predictions')
    .delete()
    .eq('user_id', userId)
    .eq('id', predictionId)

  if (error) throw error
}

// Save or update user profile
export async function saveUserProfile(user: AuthUser): Promise<UserProfile | null> {
  if (!supabase) {
    return null
  }
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: user.id,
      display_name: user.name,
      avatar_url: user.avatar_url,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) {
    return null
  }
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// Get prediction statistics for a user
export async function getUserPredictionStats(userId: string) {
  if (!supabase) {
    return {
      totalPredictions: 0,
      lastPredictionAt: null
    }
  }
  // Get total count
  const { count, error: countError } = await supabase
    .from('user_predictions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (countError) throw countError

  // Get last prediction date
  const { data, error } = await supabase
    .from('user_predictions')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error
  
  return {
    totalPredictions: count || 0,
    lastPredictionAt: data?.length > 0 ? data[0].created_at : null
  }
}
