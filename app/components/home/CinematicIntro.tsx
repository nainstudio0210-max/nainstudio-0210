"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion"
import SequenceCanvas from "./SequenceCanvas"

// Native `loop` jump-cuts to frame 0 the instant playback hits the end —
// visible as a hard flash whenever the viewer is still looking at this point
// in the scroll. Two stacked copies of the same clip let us start the standby
// copy just before the active one ends and dissolve between them, so the seam
// reads as a soft breath instead of a cut.
const LOOP_CROSSFADE_SEC = 1.2

// The canvas starts dissolving off the footage at 0.56. Rolling a little before
// that hands the viewer frame one exactly as the video appears; the lower mark
// rearms it so a second pass down the page also starts from the top.
const VIDEO_PLAY_FROM = 0.52
const VIDEO_REARM_BELOW = 0.35

function useLoopCrossfade(
  srcA: React.RefObject<HTMLVideoElement | null>,
  srcB: React.RefObject<HTMLVideoElement | null>,
  running: boolean,
) {
  const [activeIsA, setActiveIsA] = useState(true)

  useEffect(() => {
    const a = srcA.current
    const b = srcB.current
    if (!a || !b) return

    // Parked until the scroll brings the footage into view, so the viewer
    // always meets this clip at its first frame rather than mid-loop.
    if (!running) {
      a.pause()
      b.pause()
      a.currentTime = 0
      b.currentTime = 0
      setActiveIsA(true)
      return
    }

    let active = a
    let standby = b
    let swapping = false
    let swapTimeout: number | undefined

    a.currentTime = 0
    a.play().catch(() => {})

    const onTimeUpdate = () => {
      if (swapping || !active.duration) return
      if (active.currentTime >= active.duration - LOOP_CROSSFADE_SEC) {
        swapping = true
        standby.currentTime = 0
        standby.play().catch(() => {})
        setActiveIsA(standby === a)
        swapTimeout = window.setTimeout(() => {
          active.pause()
          active.currentTime = 0
          ;[active, standby] = [standby, active]
          swapping = false
        }, LOOP_CROSSFADE_SEC * 1000)
      }
    }

    a.addEventListener("timeupdate", onTimeUpdate)
    b.addEventListener("timeupdate", onTimeUpdate)
    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate)
      b.removeEventListener("timeupdate", onTimeUpdate)
      if (swapTimeout) window.clearTimeout(swapTimeout)
    }
  }, [srcA, srcB, running])

  return activeIsA
}

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

// The loupe. The circle is only the starting shape — an SVG turbulence
// displacement warps its edge into an irregular silhouette so it never reads as
// a plain cursor spotlight. Feather stays generous because the displacement
// bites into the edge and a hard rim would show the distortion as scalloping.
const LENS_RADIUS_PX = 275
const LENS_FEATHER = 0.42
const LENS_FILTER_ID = "clay-lens-edge"
const LENS_RIM_FILTER_ID = "clay-lens-rim"

// The orange point from the wordmark, reused as the spot marker.
const ACCENT = "#e85d22"

// The locked disc sits inside the roaming one so a ring of the churning edge
// still shows around it — the crisp circle reads as something that resolved out
// of the noise rather than a second shape dropped on top.
const DETAIL_RADIUS_PX = Math.round(LENS_RADIUS_PX * 0.88)

// Roaming magnification is deliberately gentle. A hard 2x over a night skyline
// mostly returns a bigger night skyline — it reads as a gimmick. The lens earns
// its place by finding things, not by enlarging everything.
const LENS_ZOOM = 1.6

// How close the cursor has to get before a spot takes the lens over, and how
// hard the lens is pulled onto the spot once inside that radius. The pull is
// what makes the lock feel intentional instead of requiring pixel accuracy.
const LOCK_RADIUS_PX = 190
const MAGNET_STRENGTH = 0.72

// Centres are fractions of the stage, matching the four landmarks in the
// opening frame.
type Spot = { id: string; label: string; blurb: string; fx: number; fy: number }
const SPOTS: Spot[] = [
  { id: "tower", label: "오피스 타워", blurb: "야간 오피스 파사드와 실내 조명", fx: 0.103, fy: 0.388 },
  { id: "park", label: "공원", blurb: "조경과 야간 보행 조명", fx: 0.22, fy: 0.78 },
  { id: "podium", label: "저층부 광장", blurb: "상업 저층부와 진입 광장", fx: 0.444, fy: 0.636 },
  { id: "street", label: "상업가로", blurb: "가로 경관과 상업시설 사이니지", fx: 0.893, fy: 0.64 },
]
const spotSrc = (id: string) => `/spots/${id}.webp`
const PANEL_ASPECT = 800 / 1280

type CinematicIntroProps = {
  videoSrc?: string
  zoomSrc?: string
  paragraphs: string[]
}

export default function CinematicIntro({
  videoSrc = "/ambient-courtyard.mp4",
  // The 4K plate the loupe magnifies. Same framing as frame_001, or the
  // magnified view would slide off the scene underneath it.
  zoomSrc = "/intro-zoom.webp",
  paragraphs,
}: CinematicIntroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)
  const [videoRunning, setVideoRunning] = useState(false)
  const activeIsA = useLoopCrossfade(videoARef, videoBRef, videoRunning)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p >= VIDEO_PLAY_FROM) setVideoRunning(true)
    else if (p < VIDEO_REARM_BELOW) setVideoRunning(false)
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

  // Clay-reveal lens. Raw pointer coords drive springs so the patch trails the
  // cursor instead of snapping to it — motion values, not state, so moving the
  // mouse never re-renders the component.
  const pointerX = useMotionValue(-9999)
  const pointerY = useMotionValue(-9999)
  const lensX = useSpring(pointerX, { stiffness: 260, damping: 32, mass: 0.55 })
  const lensY = useSpring(pointerY, { stiffness: 260, damping: 32, mass: 0.55 })

  // The lens belongs to the un-scrolled hero only; it clears well before the
  // frame sequence starts doing real work.
  const lensOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  // Anchor the magnified plate so the point under the cursor stays under the
  // cursor: at Nx the layer is N times the stage, so its origin sits at -(N-1)
  // times the cursor position.
  const zoomOffsetX = useTransform(lensX, (v) => -v * (LENS_ZOOM - 1))
  const zoomOffsetY = useTransform(lensY, (v) => -v * (LENS_ZOOM - 1))

  const detailX = useTransform(lensX, (v) => v - DETAIL_RADIUS_PX)
  const detailY = useTransform(lensY, (v) => v - DETAIL_RADIUS_PX)

  // Caption sits just inside the lower rim, where it always has the disc behind
  // it and can never be pushed off the stage.
  const labelY = useTransform(lensY, (v) => v + DETAIL_RADIUS_PX - 62)

  const [openSpot, setOpenSpot] = useState<{ spot: Spot; x: number; y: number } | null>(null)

  // The spot the lens has currently locked onto, or null while it roams. Set on
  // every pointer move, but the SPOTS entries are stable references, so settling
  // on the same one is a no-op re-render.
  const [lockedSpot, setLockedSpot] = useState<Spot | null>(null)

  // Tracked on the window rather than on the stage itself: the fixed site header
  // covers the top strip of the viewport and would otherwise swallow the move
  // events, killing the lens whenever the cursor crossed into the nav band.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let nearest: Spot | null = null
      let nearestDist = Infinity
      let nx = 0
      let ny = 0
      for (const spot of SPOTS) {
        const sx = spot.fx * rect.width
        const sy = spot.fy * rect.height
        const d = Math.hypot(x - sx, y - sy)
        if (d < nearestDist) {
          nearest = spot
          nearestDist = d
          nx = sx
          ny = sy
        }
      }

      if (nearest && nearestDist < LOCK_RADIUS_PX) {
        // Pull hardest at the centre and release toward the edge, so entering
        // and leaving the spot both feel like easing rather than snapping.
        const pull = (1 - nearestDist / LOCK_RADIUS_PX) * MAGNET_STRENGTH
        // Two of the four landmarks sit low enough that an unclamped disc would
        // run off the bottom of the stage, so the locked centre is held far
        // enough inside the edges to keep the whole circle on screen.
        const m = DETAIL_RADIUS_PX + 18
        const clamp = (v: number, max: number) => Math.min(Math.max(v, m), max - m)
        pointerX.set(clamp(x + (nx - x) * pull, rect.width))
        pointerY.set(clamp(y + (ny - y) * pull, rect.height))
        setLockedSpot(nearest)
      } else {
        pointerX.set(x)
        pointerY.set(y)
        setLockedSpot(null)
      }
    }

    const park = () => {
      pointerX.set(-9999)
      pointerY.set(-9999)
      setLockedSpot(null)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", park)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", park)
    }
  }, [pointerX, pointerY])

  return (
    <section ref={ref} className="relative h-[720vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-[100dvh] overflow-hidden bg-black"
        style={{ cursor: lockedSpot ? "pointer" : undefined }}
        onClick={() => {
          if (!lockedSpot) return
          const rect = stageRef.current?.getBoundingClientRect()
          if (!rect) return
          // Grow the panel out of where the disc actually sits, not where the
          // marker is — the magnet means those are rarely the same point.
          setOpenSpot({
            spot: lockedSpot,
            x: rect.left + lensX.get(),
            y: rect.top + lensY.get(),
          })
        }}
      >
        <video
          ref={videoARef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${activeIsA ? "opacity-100" : "opacity-0"}`}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload noplaybackrate"
        />
        <video
          ref={videoBRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${activeIsA ? "opacity-0" : "opacity-100"}`}
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

        {/* Clay reveal: the same opening frame, untextured, shown only inside a
            lens that follows the cursor. Reduced motion drops it entirely — the
            whole point is the pointer chase. */}
        {!prefersReducedMotion && (
          <motion.svg
            aria-hidden
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: lensOpacity }}
          >
            <defs>
              {/* The wobble is applied to the mask shape alone, never to the
                  image — the clay has to read as a clean before/after cut, so
                  only the silhouette is allowed to churn. */}
              <filter
                id={LENS_FILTER_ID}
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
                colorInterpolationFilters="sRGB"
              >
                {/* Static noise field: the lens travelling across it is what
                    reshapes the outline, so nothing re-renders per frame. */}
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.009"
                  numOctaves={3}
                  seed={11}
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={58}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              {/* The mask can take a violent displacement because it is a solid
                  shape, but the same amount tears a 1.5px stroke into dashes. */}
              <filter
                id={LENS_RIM_FILTER_ID}
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.009"
                  numOctaves={3}
                  seed={11}
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={26}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              <radialGradient id="clay-lens-fade">
                <stop offset="0%" stopColor="#fff" />
                <stop offset={`${LENS_FEATHER * 100}%`} stopColor="#fff" />
                <stop offset="100%" stopColor="#000" />
              </radialGradient>

              <mask id="clay-lens-mask">
                <motion.circle
                  cx={lensX}
                  cy={lensY}
                  r={LENS_RADIUS_PX}
                  fill="url(#clay-lens-fade)"
                  filter={`url(#${LENS_FILTER_ID})`}
                />
              </mask>

              {/* The locked state gets its own mask with no displacement on it.
                  The churn resolving into a clean circle is the whole tell that
                  the lens has found something. */}
              <radialGradient id="clay-lens-core-fade">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="88%" stopColor="#fff" />
                <stop offset="100%" stopColor="#000" />
              </radialGradient>

              <mask id="clay-lens-core-mask">
                <motion.circle
                  cx={lensX}
                  cy={lensY}
                  r={DETAIL_RADIUS_PX}
                  fill="url(#clay-lens-core-fade)"
                />
              </mask>
            </defs>

            <motion.image
              href={zoomSrc}
              x={zoomOffsetX}
              y={zoomOffsetY}
              width={`${LENS_ZOOM * 100}%`}
              height={`${LENS_ZOOM * 100}%`}
              preserveAspectRatio="xMidYMid slice"
              mask="url(#clay-lens-mask)"
            />

            {/* Without a rim the roaming lens is invisible over quiet parts of
                the skyline, and nobody discovers the spots. Same displacement
                as the mask so the outline wobbles with the shape it belongs to. */}
            <motion.circle
              cx={lensX}
              cy={lensY}
              r={LENS_RADIUS_PX * 0.94}
              fill="none"
              stroke="#fff"
              strokeWidth={1.5}
              filter={`url(#${LENS_RIM_FILTER_ID})`}
              initial={false}
              animate={{ opacity: lockedSpot ? 0 : 0.38 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            />

            {/* Kept mounted per spot so the browser has the bitmap decoded before
                the cursor ever arrives — a fade that has to wait on a network
                round trip reads as a stutter, not a reveal. */}
            {SPOTS.map((spot) => (
              <motion.image
                key={spot.id}
                href={spotSrc(spot.id)}
                x={detailX}
                y={detailY}
                width={DETAIL_RADIUS_PX * 2}
                height={DETAIL_RADIUS_PX * 2}
                preserveAspectRatio="xMidYMid slice"
                mask="url(#clay-lens-core-mask)"
                initial={false}
                animate={{ opacity: lockedSpot?.id === spot.id ? 1 : 0 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              />
            ))}

            <motion.circle
              cx={lensX}
              cy={lensY}
              r={DETAIL_RADIUS_PX}
              fill="none"
              stroke="#fff"
              strokeWidth={1}
              initial={false}
              animate={{ opacity: lockedSpot ? 0.55 : 0 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            />
          </motion.svg>
        )}

        {/* Markers are purely visual. Clicking is handled on the stage against
            whatever the lens has locked, so the hit target can never disagree
            with what the viewer is actually looking at. */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: lensOpacity }}
          >
            {SPOTS.map((spot) => {
              const locked = lockedSpot?.id === spot.id
              return (
                <div
                  key={spot.id}
                  className="absolute"
                  style={{ left: `${spot.fx * 100}%`, top: `${spot.fy * 100}%` }}
                >
                  {/* The brand mark's orange point, pulsing so it is findable
                      against a skyline already full of small lights. Fades out
                      as the lens arrives — the disc replaces it. */}
                  <span
                    className="absolute grid place-items-center"
                    style={{
                      width: 66,
                      height: 66,
                      opacity: locked ? 0 : 1,
                      transform: `translate(-50%, -50%) scale(${locked ? 0.4 : 1})`,
                      transition: "opacity 300ms ease, transform 300ms ease",
                    }}
                  >
                    {/* Opacity starts and ends at zero so the loop point lands
                        while the ring is invisible — animating 0.5 -> 0 leaves a
                        visible snap back to full every cycle. */}
                    <motion.span
                      className="absolute rounded-full"
                      style={{ width: 21, height: 21, backgroundColor: ACCENT }}
                      animate={{ scale: [0.9, 1.5, 3.6], opacity: [0, 0.5, 0] }}
                      transition={{
                        duration: 2.8,
                        times: [0, 0.18, 1],
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "easeOut",
                      }}
                    />
                    <span
                      className="relative block rounded-full"
                      style={{
                        width: 21,
                        height: 21,
                        backgroundColor: ACCENT,
                        boxShadow: `0 0 18px ${ACCENT}, 0 0 4px rgba(0,0,0,0.6)`,
                      }}
                    />
                  </span>

                </div>
              )
            })}

            {/* One caption that rides the disc rather than one per marker: the
                magnet and the edge clamp both move the disc off the marker, and
                a caption pinned to the marker ends up detached or off-screen. */}
            <motion.div className="absolute top-0 left-0" style={{ x: lensX, y: labelY }}>
              <motion.div
                className="-translate-x-1/2 text-center whitespace-nowrap"
                initial={false}
                animate={{ opacity: lockedSpot ? 1 : 0, y: lockedSpot ? 0 : 8 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              >
                <span className="block text-sm text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  {lockedSpot?.label ?? ""}
                </span>
                <span className="mt-1 block text-[11px] tracking-[0.18em] text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  CLICK
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Nested opacity: the scroll fade stays on the outer node, and the
            lock dim multiplies into it, so neither one clobbers the other. */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{ opacity: lockedSpot ? 0.18 : 1 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{ opacity: headlineOpacity, y: prefersReducedMotion ? 0 : headlineY }}
        >
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.3] text-white"
            style={{
              textShadow:
                "0 0 2.4px rgba(255,255,255,1), 0 0 8.4px rgba(255,255,255,0.6), 0 0 19px rgba(255,255,255,0.3), -1.5px -1.5px 2.5px rgba(0,0,0,0.6), 1.5px -1.5px 2.5px rgba(0,0,0,0.6), -1.5px 1.5px 2.5px rgba(0,0,0,0.6), 1.5px 1.5px 2.5px rgba(0,0,0,0.6)",
            }}
          >
            비어있던 도면이
            <br />
            목소리를 갖기 시작합니다.
          </h1>
          <p
            className="mt-6 text-base md:text-lg text-white/90 tracking-wide max-w-xl"
            style={{
              textShadow:
                "0 0 1.8px rgba(255,255,255,1), 0 0 6px rgba(255,255,255,0.48), 0 0 14.4px rgba(255,255,255,0.24), -1.1px -1.1px 2px rgba(0,0,0,0.6), 1.1px -1.1px 2px rgba(0,0,0,0.6), -1.1px 1.1px 2px rgba(0,0,0,0.6), 1.1px 1.1px 2px rgba(0,0,0,0.6)",
            }}
          >
            그 침묵 속 의도를, 가장 설득력 있는 장면으로.
          </p>
        </motion.div>
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

      <SpotDetail open={openSpot} onClose={() => setOpenSpot(null)} />
    </section>
  )
}

// The detail shot is the loupe itself, grown: it starts as a disc the size of
// the lens sitting exactly where the marker was and stretches into a framed
// panel, so nothing about it reads as a modal arriving from elsewhere.
function SpotDetail({
  open,
  onClose,
}: {
  open: { spot: Spot; x: number; y: number } | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  const panelW = typeof window === "undefined" ? 960 : Math.min(1080, window.innerWidth * 0.86)
  const panelH = panelW * PANEL_ASPECT
  // Starts at exactly the disc the viewer was just looking at, so the panel
  // reads as that disc unfolding rather than a modal arriving.
  const d = DETAIL_RADIUS_PX * 2

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="absolute overflow-hidden shadow-2xl ring-1 ring-white/15"
            onClick={(e) => e.stopPropagation()}
            initial={{
              width: d,
              height: d,
              borderRadius: d / 2,
              left: open.x - d / 2,
              top: open.y - d / 2,
            }}
            animate={{
              width: panelW,
              height: panelH,
              borderRadius: 10,
              left: (window.innerWidth - panelW) / 2,
              top: (window.innerHeight - panelH) / 2,
            }}
            exit={{
              width: d,
              height: d,
              borderRadius: d / 2,
              left: open.x - d / 2,
              top: open.y - d / 2,
              opacity: 0,
            }}
            transition={{ type: "spring", stiffness: 210, damping: 30, mass: 0.9 }}
          >
            <img
              src={spotSrc(open.spot.id)}
              alt={open.spot.label}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />

            {/* Held back until the shape has settled, so the copy lands on a
                panel rather than on something still moving. */}
            <motion.div
              className="absolute inset-x-0 bottom-0 p-6 md:p-7 bg-gradient-to-t from-black/85 to-transparent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.35 }}
            >
              <span className="text-xs tracking-[0.2em] text-[#e85d22]">DETAIL</span>
              <h3 className="mt-1.5 text-xl md:text-2xl font-light text-white">{open.spot.label}</h3>
              <p className="mt-1 text-sm text-white/70">{open.spot.blurb}</p>
            </motion.div>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="absolute right-3 top-3 w-9 h-9 rounded-full border border-white/25
                         bg-black/40 text-white/80 hover:text-white hover:border-white
                         transition-colors grid place-items-center text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
