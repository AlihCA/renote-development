import CTASection from "@/components/landing/CTASection"
import HeroSection from "@/components/landing/HeroSection"
import KeyFeaturesSection from "@/components/landing/KeyFeaturesSection"
import ProblemSection from "@/components/landing/ProblemSection"
import SectionScrollButton from "@/components/landing/SectionScrollButton"

function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <KeyFeaturesSection />
      <CTASection />
      <SectionScrollButton />
    </>
  )
}

export default LandingPage
