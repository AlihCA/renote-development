import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

const sectionFlow = [
  {
    id: "hero",
    label: "Scroll down",
    nextId: "problem",
  },
  {
    id: "problem",
    label: "See the solution",
    nextId: "solution",
  },
  {
    id: "solution",
    label: "Explore features",
    nextId: "features",
  },
  {
    id: "features",
    label: "View preview",
    nextId: "preview",
  },
  {
    id: "preview",
    label: "Get started",
    nextId: "cta",
  },
  {
    id: "cta",
    label: "Back to top",
    nextId: "hero",
  },
]

function getCurrentSectionId() {
  const viewportMarker = window.innerHeight * 0.45
  let currentId = sectionFlow[0].id

  sectionFlow.forEach((section) => {
    const element = document.getElementById(section.id)

    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()

    if (rect.top <= viewportMarker) {
      currentId = section.id
    }
  })

  return currentId
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

function SectionScrollButton() {
  const [activeSectionId, setActiveSectionId] = useState(sectionFlow[0].id)
  const activeSection =
    sectionFlow.find((section) => section.id === activeSectionId) ?? sectionFlow[0]
  const isBackToTop = activeSection.id === "cta"
  const Icon = isBackToTop ? ArrowUp : ArrowDown

  useEffect(() => {
    let frameId = null

    function updateActiveSection() {
      setActiveSectionId(getCurrentSectionId())
    }

    function scheduleUpdate() {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

  return (
    <button
      aria-label={activeSection.label}
      className="group fixed bottom-4 left-1/2 z-30 inline-flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-primary/20 bg-background/85 px-3 py-2 text-xs font-medium text-primary shadow-[0_14px_36px_rgb(180_59_209_/_18%)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary-soft hover:text-[var(--renote-primary-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25 sm:bottom-6 sm:px-4 sm:text-sm"
      onClick={() => scrollToSection(activeSection.nextId)}
      type="button"
    >
      <span className="truncate">{activeSection.label}</span>
      <Icon
        className={`size-4 shrink-0 transition-transform ${
          isBackToTop ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"
        }`}
      />
    </button>
  )
}

export default SectionScrollButton
