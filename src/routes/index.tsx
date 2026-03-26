import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '#/components/HeroSection'
import OfferSection from '#/components/OfferSection'
import MissionSection from '#/components/MissionSection'

export const Route = createFileRoute('/')({ component: HomePage })
function HomePage() {
  return (
    <main>
      <HeroSection />
      <OfferSection />
      <MissionSection />
    </main>
  );
}