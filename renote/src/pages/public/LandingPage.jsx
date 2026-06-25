import CTASection from "@/components/landing/CTASection"
import HeroSection from "@/components/landing/HeroSection"
import KeyFeaturesSection from "@/components/landing/KeyFeaturesSection"
import ProblemSection from "@/components/landing/ProblemSection"
import SectionScrollButton from "@/components/landing/SectionScrollButton"
import SolutionSection from "@/components/landing/SolutionSection"
import SystemPreviewSection from "@/components/landing/SystemPreviewSection"

function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <KeyFeaturesSection />
      <SystemPreviewSection />
      <CTASection />
      <SectionScrollButton />
    </>
  )
}

export default LandingPage
