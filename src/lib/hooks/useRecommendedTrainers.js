import { useTrainers } from './useTrainers'

/**
 * Top-rated approved trainers for the player overview carousel.
 * Defaults to 6 cards; the caller can override.
 */
export function useRecommendedTrainers({ limit = 6 } = {}) {
  return useTrainers({ approved: true, limit, orderBy: 'rating_avg' })
}
