import { useEffect, useRef, useState } from "react"
import {
  Bot,
  FolderOpen,
  Maximize2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const VIDEO_SRC = "/media/renote-infomercial.mp4"
const VIDEO_POSTER = "/media/renote-infomercial-poster.png"

function LandingVideoPreview() {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === videoRef.current)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  async function handlePlayClick() {
    const video = videoRef.current

    if (!video) {
      return
    }

    try {
      await video.play()
      setIsPlaying(true)
    } catch {
      if (!video.paused) {
        setIsPlaying(true)
      }
    }

    try {
      await video.requestFullscreen?.()
    } catch {
      // Fullscreen is a browser enhancement; playback should continue without it.
    }
  }

  async function handleFullscreenClick() {
    try {
      await videoRef.current?.requestFullscreen?.()
    } catch {
      // Fullscreen can be blocked by the browser, but inline controls still work.
    }
  }

  return (
    <div className="renote-card overflow-hidden p-4 sm:p-5">
      <div className="relative aspect-video overflow-hidden rounded-3xl border bg-[linear-gradient(135deg,#FBE7FF_0%,#F3C6FF_45%,#DCC7FF_100%)] dark:bg-[linear-gradient(135deg,#FBE7FF_0%,#E9B7FF_48%,#CBB6FF_100%)]">
        <video
          aria-label="ReNote infomercial video"
          className={cn(
            "absolute inset-0 h-full w-full bg-black transition duration-300",
            isFullscreen
              ? "scale-100 object-contain"
              : "scale-[1.035] object-cover",
            isPlaying ? "opacity-100" : "opacity-0"
          )}
          controls={isPlaying}
          onPlay={() => setIsPlaying(true)}
          playsInline
          poster={VIDEO_POSTER}
          preload="metadata"
          ref={videoRef}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#FFF7FD_0%,#F7D4FF_45%,#D9C4FF_100%)] transition duration-300",
            isPlaying ? "opacity-0" : "opacity-100"
          )}
        />

        {!isPlaying ? (
          <>
            <div className="pointer-events-none relative flex h-full flex-col justify-between p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge
                    className="gap-1.5 rounded-2xl bg-background/80 text-primary shadow-sm backdrop-blur"
                    variant="outline"
                  >
                    <Sparkles className="size-3.5" />
                    Video preview
                  </Badge>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      ReNote Infomercial
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      A short walkthrough of how repositories, folders, AI
                      summaries, collections, and trust labels work together.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid place-items-center py-4">
                <span className="grid size-20 place-items-center rounded-3xl border border-white/70 bg-white/85 text-primary shadow-[0_18px_45px_rgb(180_59_209_/_24%)] backdrop-blur transition dark:border-white/15 dark:bg-background/75">
                  <Play className="ml-1 size-8 fill-current" />
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-2xl border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <FolderOpen className="size-3.5 text-primary" />
                  Repository flow
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-2xl border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <Bot className="size-3.5 text-primary" />
                  AI summary
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-2xl border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Trust labels
                </span>
              </div>
            </div>

            <button
              aria-label="Play ReNote infomercial"
              className="absolute inset-0 z-10 cursor-pointer rounded-3xl outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary/45"
              onClick={handlePlayClick}
              type="button"
            />
          </>
        ) : null}

        {isPlaying ? (
          <button
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-2xl border border-white/50 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
            onClick={handleFullscreenClick}
            type="button"
          >
            <Maximize2 aria-hidden="true" className="size-3.5" />
            Fullscreen
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default LandingVideoPreview
