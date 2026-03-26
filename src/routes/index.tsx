import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "#/components/HeroSection";
import MissionSection from "#/components/MissionSection";
import OfferSection from "#/components/OfferSection";
import VouchFooter from "#/components/VouchFooter";
import VouchHeader from "#/components/VouchHeader";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <>
      <VouchHeader />
      <main>
        <HeroSection />
        <OfferSection />
        <MissionSection />
      </main>
      <VouchFooter />
    </>
  );
}
