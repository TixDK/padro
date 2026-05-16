import { Hero } from '../components/Hero'
import { ValueProps } from '../components/ValueProps'
import { ForCoaches } from '../components/ForCoaches'
import { DownloadApp } from '../components/DownloadApp'
import { Pricing } from '../components/Pricing'
import { FinalCTA } from '../components/FinalCTA'

export function Home() {
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
