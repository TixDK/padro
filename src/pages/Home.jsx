import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { ValueProps } from '../components/ValueProps'
import { ForCoaches } from '../components/ForCoaches'
import { DownloadApp } from '../components/DownloadApp'
import { Pricing } from '../components/Pricing'
import { FinalCTA } from '../components/FinalCTA'
import { scrollToId } from '../lib/scroll'

export function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  // Honour a router-state scroll request (e.g. coming from /account QuickLinks)
  // without touching the URL hash.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    // Defer so the section is mounted before we scroll.
    const id = requestAnimationFrame(() => scrollToId(target))
    // Consume the state so a later refresh doesn't re-scroll.
    navigate(location.pathname, { replace: true, state: null })
    return () => cancelAnimationFrame(id)
  }, [location, navigate])

  return (
    <>
      <Hero />
      <ValueProps />
      <ForCoaches />
      <DownloadApp />
      <Pricing />
      <FinalCTA />
    </>
  )
}
