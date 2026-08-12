"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import SequenceCanvas from "./SequenceCanvas"

// One continuous 382-frame scrub: night skyline -> tower facade -> studio
// interior -> into the monitor -> forest -> the pavilion builds itself, then
// the finished courtyard takes over as live footage and the studio statement
// rises on top of it.
//
// The courtyard and the statement used to live in their own sticky section. Two
// sticky stages meant two releases, and each release left ~100vh of dead scroll
// where the first stage slid away before the second pinned — a full screen of
// nothing between the pavilion and the copy. One stage has one release, at the
// very end, onto the black the next section already starts from.
const FRAME_COUNT = 382
const frameSrc = (i: number) =>
  `/sequences/intro/frame_${String(i + 1).padStart(3, "0")}.webp`

type CinematicIntroProps = {
  videoSrc?: string
  paragraphs: string[]
}

export default function CinematicIntro({
  videoSrc = "/ambient-courtyard.mp4",
  paragraphs,
}: CinematicIntroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // The frame sequence owns the first stretch; the rest belongs to the footage
  // and the copy.
  const frameProgress = useTransform(scrollYProgress, [0, 0.58], [0, 1])

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])
  const headlineY = useTransform(scrollYProgress, [0, 0.04], [0, -40])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])

  // The video sits under the canvas at full opacity and the canvas dissolves off
  // it, so the handover never passes through a moment where both are faded and
  // the black backdrop shows through.
  const canvasOpacity = useTransform(scrollYProgress, [0.56, 0.66], [1, 0])

  const dimOpacity = useTransform(scrollYProgress, [0.66, 0.78], [0, 0.68])
  const copyOpacity = useTransform(scrollYProgress, [0.68, 0.8], [0, 1])
  const copyY = useTransform(scrollYProgress, [0.68, 0.8], [32, 0])

  // Land on black so the release into the next section is a cut, not a tear.
  const exitFade = useTransform(scrollYProgress, [0.95, 1], [0, 1])

  return (
    <section ref={ref} className="relative h-[720vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-black">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload noplaybackrate"
        />

        {/* Opacity here tracks scroll position rather than animating on its own,
            so it stays on under reduced motion — only the translations go. */}
        <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
          <SequenceCanvas
            frameCount={FRAME_COUNT}
            frameSrc={frameSrc}
            progress={frameProgress}
            fit="cover"
            step={4}
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{ opacity: headlineOpacity, y: prefersReducedMotion ? 0 : headlineY }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.3] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
            건축 이미지를 넘어,
            <br />
            설계의도를 설계합니다.
          </h1>
          <p className="mt-6 text-sm md:text-base text-white/70 max-w-xl">
            공간이 지어지기 전, 그 가치를 먼저 보여드립니다.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-[10px] tracking-[0.25em] text-white/60">SCROLL</span>
          <span className="w-px h-8 bg-white/40" />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: dimOpacity }}
        />

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: copyOpacity, y: prefersReducedMotion ? 0 : copyY }}
        >
          <div className="max-w-2xl md:max-w-3xl mx-auto text-center flex flex-col gap-5">
            {paragraphs.map((p) => (
              <p
                key={p}
                className="text-lg md:text-2xl font-light leading-relaxed tracking-[-0.01em] text-white text-balance"
              >
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: exitFade }}
        />
      </div>
    </section>
  )
}
