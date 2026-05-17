import { useOutletContext } from 'react-router-dom'
import { PlayerOverview } from './PlayerOverview'
import { CoachOverview } from './CoachOverview'

/**
 * Role-aware overview switcher. Profile state comes down from
 * DashboardLayout via Outlet context, so every page can read it without
 * re-querying Supabase.
 */
export function Overview() {
  const profileState = useOutletContext()

  if (profileState.loading) {
    return <OverviewSkeleton />
  }

  if (profileState.isCoach) {
    return <CoachOverview profileState={profileState} />
  }

  return <PlayerOverview profileState={profileState} />
}

function OverviewSkeleton() {
  return (
    <div className="space-y-10">
      <div className="h-10 w-2/3 max-w-md rounded-md bg-hairline" />
      <div className="h-40 rounded-2xl bg-hairline/70" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-hairline/70" />
        ))}
      </div>
    </div>
  )
}
