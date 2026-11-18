"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { serviceIcons } from "./ServiceIcons"

/* ------------------------------------------------------------------ *
 * Scroll-driven services sequence.
 *
 * Palette is the one the printed leaflet and the company profile use — paper,
 * ink, burnt orange — so the site, the PDF and the leaflet read as one studio.
 *
 * 05 and 06 are recordings of the live VR site, and they are SCRUBBED, not
 * played: the scroll position is the playhead. Nothing moves unless the reader
 * moves it, so the page cannot run past a clip while it is mid-gesture, and a
 * drag back rewinds the panel and the season switch. Both are cut and masked
 * in public/flow.
 * ------------------------------------------------------------------ */

const PAPER = "#e4dbcb"
const PAPER2 = "#dad0bd"
const INK = "#1f1b16"
const MUTE = "#584e42"
const ACC = "#9a4424"
const DARK = "#2a231c"

type Chapter = {
  no: string
  title: string
  sub: string
  line: string
  icon: keyof typeof serviceIcons
}

const chapters: Chapter[] = [
  { no: "01", icon: "aerial", title: "조감도", sub: "심의 · 인허가 · 분양", line: "단지 전체와 주변 맥락을 한 장에 담습니다." },
  { no: "02", icon: "perspective", title: "투시도", sub: "설계 의도를 한 장의 이미지로", line: "빛과 재질, 마감까지 완공 후의 공기를 미리 만들어 둡니다." },
  { no: "03", icon: "iso", title: "아이소메트릭", sub: "공간 구성을 한눈에", line: "절개 투시로 동선과 마감 계획을 도면보다 빠르게 전달합니다." },
  { no: "04", icon: "cinematic", title: "시네마틱 영상", sub: "분양 홍보 · 온라인 광고", line: "스틸이 담지 못하는 시간과 호흡을 영상으로 펼칩니다." },
  { no: "05", icon: "web", title: "웹페이지", sub: "분양 · 홍보 사이트", line: "자리마다 정보를 열고, 계절과 시간대를 바로 바꿔봅니다." },
  { no: "06", icon: "vr", title: "360VR 영상", sub: "한 바퀴를 도는 파노라마", line: "한자리에 서서 사방을 둘러보는 장면을 만듭니다." },
]

// 04 runs longer than the still chapters — it is a film. 05 and 06 are sized
// to their clips (16.3s and 9.5s) with enough scroll that a scrub feels like a
// drag rather than a flick.
const TITLE: [number, number] = [0.0, 0.105]
const W: [number, number][] = [
  [0.088, 0.195],
  [0.195, 0.315],
  [0.315, 0.425],
  [0.425, 0.575],
  [0.575, 0.835],
  [0.83, 1.0],
]

function useLocal(p: MotionValue<number>, win: [number, number]) {
  return useTransform(p, win, [0, 1], { clamp: true })
}

/** Presence gate, read off section progress so a chapter is absent — not
 *  "fully in" — before its window starts. `ramp` widens the crossfade where
 *  two chapters are meant to dissolve into each other rather than cut. */
function useHold(
  p: MotionValue<number>,
  win: [number, number],
  { last = false, ramp = 0.004 }: { last?: boolean; ramp?: number } = {},
) {
  const [a, b] = win
  return useTransform(
    p,
    last ? [a - ramp, a, 1] : [a - ramp, a, b - ramp, b],
    last ? [0, 1, 1] : [0, 1, 1, 0],
  )
}

/* ----------------------------- kinetic type ----------------------------- */

function Syllable({ ch, local, at }: { ch: string; local: MotionValue<number>; at: number }) {
  const o = useTransform(local, [at, at + 0.022], [0, 1])
  const y = useTransform(local, [at, at + 0.05], ["0.75em", "0em"])
  const blur = useTransform(local, [at, at + 0.04], [10, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)
  return (
    <motion.span style={{ opacity: o, y, filter }} className="inline-block whitespace-pre will-change-transform">
      {ch}
    </motion.span>
  )
}

function Kinetic({
  text,
  local,
  at,
  span = 0.07,
  className,
}: {
  text: string
  local: MotionValue<number>
  at: number
  span?: number
  className?: string
}) {
  const chars = [...text]
  return (
    <span className={className}>
      {chars.map((c, i) => (
        <Syllable key={i} ch={c} local={local} at={at + (i / chars.length) * span} />
      ))}
    </span>
  )
}

function Line({
  local,
  at,
  className,
  children,
}: {
  local: MotionValue<number>
  at: number
  className?: string
  children: React.ReactNode
}) {
  const o = useTransform(local, [at, at + 0.04], [0, 1])
  const y = useTransform(local, [at, at + 0.07], [18, 0])
  return (
    <motion.div style={{ opacity: o, y }} className={className}>
      {children}
    </motion.div>
  )
}

function Ghost({ no, local, className = "" }: { no: string; local: MotionValue<number>; className?: string }) {
  const o = useTransform(local, [0.02, 0.12, 0.72, 0.86], [0, 0.07, 0.07, 0])
  const y = useTransform(local, [0, 1], ["8%", "-8%"])
  return (
    <motion.span
      aria-hidden
      style={{ opacity: o, y, color: INK }}
      className={`pointer-events-none absolute font-mono font-light leading-none text-[34vw] ${className}`}
    >
      {no}
    </motion.span>
  )
}

/** Caption over a dark picture. */
function MediaCaption({
  c,
  local,
  at = 0.3,
  quick = false,
}: {
  c: Chapter
  local: MotionValue<number>
  at?: number
  /** For a caption that is only on screen briefly: the whole title is set
   *  before the caption starts to leave, instead of half of it. */
  quick?: boolean
}) {
  const Icon = serviceIcons[c.icon]
  const k = quick ? 0.25 : 1
  return (
    <>
      <Line local={local} at={at} className="flex items-center gap-4">
        <span className="shrink-0 text-[#f3ede3]">
          <Icon className="w-9 h-9 md:w-11 md:h-11" />
        </span>
        <span className="font-mono text-sm" style={{ color: "#e9a27c" }}>{c.no}</span>
        <span className="text-[10px] md:text-xs tracking-[0.2em] text-white/60">{c.sub}</span>
      </Line>
      <h3 className="mt-3 text-4xl md:text-7xl font-light tracking-[-0.04em] text-[#f3ede3]">
        <Kinetic text={c.title} local={local} at={at + 0.04 * k} span={0.12 * k} />
      </h3>
      <Line local={local} at={at + 0.16 * k} className="mt-4 text-sm md:text-base text-white/70 max-w-xl">
        {c.line}
      </Line>
    </>
  )
}

function Plate({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ outline: `1.5px solid ${ACC}`, outlineOffset: 6 }}>
      {children}
    </div>
  )
}

/* ------------------------------ scrubbing ------------------------------ */

/** Scroll IS the playhead. The clip never calls play(); every frame shown is
 *  one the reader dragged to, so a recording cannot run on past the reader and
 *  scrolling back rewinds it. Seeks are coalesced to one per animation frame —
 *  a wheel event storm would otherwise queue dozens of seeks the decoder then
 *  has to work through. The clips are encoded with a keyframe every 5 frames
 *  so landing on an arbitrary time is cheap. */
function useScrub(
  ref: React.RefObject<HTMLVideoElement | null>,
  p: MotionValue<number>,
  win: [number, number],
) {
  const want = useRef(0)
  const queued = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // iOS will not decode for a seek until the element has been touched by a
    // play attempt. One muted play/pause at mount is enough and shows nothing.
    const prime = () => {
      void el.play().then(() => el.pause()).catch(() => {})
    }
    if (el.readyState >= 1) prime()
    else el.addEventListener("loadedmetadata", prime, { once: true })
    return () => el.removeEventListener("loadedmetadata", prime)
  }, [ref])

  useMotionValueEvent(p, "change", (v) => {
    const el = ref.current
    if (!el) return
    const d = el.duration
    if (!d || !isFinite(d)) return

    const t = (v - win[0]) / (win[1] - win[0])
    want.current = Math.min(Math.max(t, 0), 1) * (d - 0.04)
    if (queued.current) return
    queued.current = requestAnimationFrame(() => {
      queued.current = 0
      const el2 = ref.current
      if (el2 && Math.abs(el2.currentTime - want.current) > 0.02) {
        el2.currentTime = want.current
      }
    })
  })

  useEffect(() => () => cancelAnimationFrame(queued.current), [])
}

/* ------------------------------- chapters ------------------------------- */

/* The title is a reel in two movements.
 *
 * The descent follows the scroll: each letter comes out of the line where the
 * black lead-in gives way to paper and rides down to its slot as the page
 * comes up, smoothed by a spring so a wheel's notches do not show.
 *
 * The turn runs on a clock. Tied to the scroll it sat frozen on a line of
 * nonsense letters whenever the wheel stopped; on a clock it plays once at
 * the speed it was drawn for — it runs out of speed, and the letter clicks
 * into place a hair past its mark and settles back.
 *
 * The glyphs are picked from a fixed table by index — no Math.random, so the
 * server and the client render the same strip. */
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const HANGUL = "가나다라마바사아자차카타파하거너더러머버서어저처"
const SPIN = 11 // glyphs each slot flicks past before it lands
const SLOT_H = 1.2 // em; room for Hangul and descenders inside the mask
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** The letter it lands on is first, so the strip travels downward — the same
 *  way the slot itself arrives. */
function reelFor(ch: string, slot: number) {
  const pool = /[A-Za-z]/.test(ch) ? LATIN : HANGUL
  const out: string[] = [ch]
  for (let i = 0; i < SPIN; i++) out.push(pool[(slot * 7 + i * 5 + 3) % pool.length])
  return out
}

function Slot({
  ch,
  slot,
  on,
  delay,
  q,
  from,
  rise,
}: {
  ch: string
  slot: number
  on: boolean
  delay: number
  /** 0 when the section's top edge is at the bottom of the screen, 1 when the
   *  stage pins. */
  q: MotionValue<number>
  /** This slot's own share of that approach — later letters leave later. */
  from: number
  /** How far above its slot the letter starts, in px: on the line where the
   *  black above gives way to the paper. */
  rise: number
}) {
  const reel = useMemo(() => reelFor(ch, slot), [ch, slot])
  // The descent belongs to the scroll: the letter leaves the line as the page
  // comes up and is in its slot when the stage pins, so it is on screen the
  // whole way down however fast or slowly the reader scrolls.
  const y = useTransform(q, [from, from + 0.68], [-rise, 0], { ease: (t) => 1 - (1 - t) ** 2 })
  const o = useTransform(q, [from, from + 0.14], [0, 1])
  if (ch === " ") return <span className="inline-block w-[0.32em]" />
  const top = `-${((reel.length - 1) * SLOT_H).toFixed(2)}em`
  return (
    // The slot is exactly as wide as the letter it lands on — an invisible
    // copy sets that width — so the settled line keeps the typeface's own
    // spacing.
    <motion.span
      // Masked top and bottom only. Clipping the sides as well sliced every
      // glyph wider than the landing letter into a shard mid-turn.
      style={{ y, opacity: o, height: `${SLOT_H}em`, clipPath: "inset(0 -0.7em)" }}
      className="relative inline-block align-bottom will-change-transform"
    >
      <span className="invisible">{ch}</span>
      <motion.span
        initial={false}
        animate={{ y: on ? [top, "0.1em", "0em"] : top }}
        transition={
          on
            ? { duration: 1.0, delay: delay + 0.1, times: [0, 0.84, 1], ease: [[0.1, 0.7, 0.18, 1], "easeInOut"] }
            : { duration: 0 }
        }
        className="absolute inset-x-0 top-0 block will-change-transform"
      >
        {reel.map((g, i) => (
          // Only the letter it lands on is full ink. The ones turning past
          // are ghosts, so the line never reads as a wrong word on the way.
          <span
            key={i}
            style={{ height: `${SLOT_H}em`, lineHeight: `${SLOT_H}em`, opacity: i === 0 ? 1 : 0.28 }}
            className="flex justify-center"
          >
            {g}
          </span>
        ))}
      </motion.span>
    </motion.span>
  )
}

function TitleCard({ p, approach }: { p: MotionValue<number>; approach: MotionValue<number> }) {
  const local = useLocal(p, TITLE)
  const hold = useHold(p, TITLE, { ramp: 0.03 })
  const o = useTransform(local, [0, 0.86, 1], [1, 1, 0])
  const scale = useTransform(local, [0, 1], [0.99, 1.08])
  const chars = [..."NAIN STUDIO 서비스"]
  const head = useRef<HTMLHeadingElement>(null)
  // A wheel moves the page in notches; the spring turns those into one glide.
  const q = useSpring(approach, { stiffness: 90, damping: 24, mass: 0.5 })

  // The line the letters come out of: where the lead-in band above the
  // section stops being black. Measured, because the band is a different
  // height on a phone.
  const [rise, setRise] = useState(700)
  useEffect(() => {
    const measure = () => {
      const h = head.current
      const band = document.getElementById("flow-lead")
      const stage = h?.closest("[data-stage]")
      if (!h || !band || !stage) return
      const inStage = h.getBoundingClientRect().top - stage.getBoundingClientRect().top
      setRise(Math.round(band.offsetHeight * 0.7 + inStage))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // The reels start turning once the letters are well on their way, and
  // re-arm when the section has been scrolled back out of.
  const [on, setOn] = useState(false)
  useMotionValueEvent(q, "change", (v) => setOn((was) => (was ? v > 0.04 : v > 0.3)))
  const STEP = 0.03
  const done = (chars.length - 1) * STEP + 0.1 + 1.0

  // The page waits at the pin until the title has finished assembling: a
  // quick scroll used to carry straight past it mid-spin. Only a scroll that
  // arrives from above is held — a jump (an anchor link, a reload deep in the
  // page) lands well past the pin and is left alone.
  const ready = useRef(false)
  useEffect(() => {
    if (!on) {
      ready.current = false
      return
    }
    const t = setTimeout(() => (ready.current = true), (done + 0.2) * 1000)
    return () => clearTimeout(t)
  }, [on, done])
  useEffect(() => {
    const sec = head.current?.closest("section")
    if (!sec) return
    const pin = () => sec.getBoundingClientRect().top + window.scrollY
    // Held at the source: a downward wheel, swipe or key is swallowed before
    // it scrolls. Letting it scroll and then putting the page back made the
    // screen bob on every notch.
    const held = (dy: number) => {
      if (ready.current || dy <= 0) return false
      const y = window.scrollY
      const top = pin()
      if (y > top + 2 || y + dy <= top) return false
      if (y < top) window.scrollTo(0, top)
      return true
    }
    const onWheel = (e: WheelEvent) => {
      if (held(e.deltaY)) e.preventDefault()
    }
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchY - e.touches[0].clientY
      touchY = e.touches[0].clientY
      if (e.cancelable && held(dy)) e.preventDefault()
    }
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", " "].includes(e.key) && held(window.innerHeight)) e.preventDefault()
    }
    // Whatever gets past those (a scrollbar drag, momentum already in flight)
    // is put back once; a jump from elsewhere lands far below and is let go.
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const top = pin()
      if (!ready.current && y > top) {
        if (last <= top + 2 && y < top + window.innerHeight) {
          window.scrollTo(0, top)
          last = top
          return
        }
        ready.current = true
      }
      last = y
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    // The title carries its own paper: the stage behind it is dark, so the
    // card dissolving out is a dissolve through black into the first picture
    // rather than two photographs crossfading over a light ground.
    <motion.div
      style={{ opacity: hold, background: PAPER }}
      className="absolute inset-0 grid place-items-center"
    >
      <motion.div style={{ opacity: o, scale }} className="text-center px-6">
        <motion.span
          initial={false}
          animate={on ? { opacity: 1, letterSpacing: "0.35em" } : { opacity: 0, letterSpacing: "0.6em" }}
          transition={on ? { duration: 0.9, delay: 0.05, ease: EXPO } : { duration: 0 }}
          style={{ color: ACC }}
          className="block text-[10px] md:text-xs"
        >
          WHAT WE MAKE
        </motion.span>
        <h2
          ref={head}
          className="mt-5 text-4xl md:text-7xl font-light tracking-[-0.03em]"
          style={{ color: INK, lineHeight: `${SLOT_H}em` }}
          aria-label="NAIN STUDIO 서비스"
        >
          <span aria-hidden className="inline-flex items-end">
            {chars.map((c, i) => (
              <Slot
                key={i}
                ch={c}
                slot={i}
                on={on}
                delay={i * STEP}
                q={q}
                from={(i / chars.length) * 0.3}
                rise={rise}
              />
            ))}
          </span>
        </h2>
        {/* Drawn from the middle outward as the last letter settles. */}
        <motion.span
          initial={false}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={on ? { duration: 0.7, delay: done - 0.4, ease: EXPO } : { duration: 0 }}
          style={{ background: ACC }}
          className="mt-7 block h-px w-full opacity-60"
        />
      </motion.div>
    </motion.div>
  )
}

/** 01 — the hand-off from the title. It crossfades in at near full size and
 *  only drifts: the old version snapped up from a third of the frame, which
 *  on the way out of the title read as a jump cut. */
function AerialChapter({ p }: { p: MotionValue<number> }) {
  const local = useLocal(p, W[0])
  const hold = useHold(p, W[0], { ramp: 0.03 })
  const scale = useTransform(local, [0, 0.5, 1], [0.94, 1.0, 1.06])
  const inner = useTransform(local, [0, 1], [1.12, 1.02])
  const io = useTransform(local, [0, 0.16, 0.9, 1], [0, 1, 1, 0])
  const frame = useTransform(local, [0.14, 0.34], [1, 0])

  return (
    <motion.div style={{ opacity: hold }} className="absolute inset-0">
      <Ghost no="01" local={local} className="right-[4vw] top-[8vh]" />
      <motion.div style={{ scale, opacity: io }} className="absolute inset-0 will-change-transform">
        <motion.div style={{ outline: `1.5px solid ${ACC}`, outlineOffset: 6, opacity: frame }} className="absolute inset-0" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/flow/01-aerial.webp"
            alt="수변 복합 단지 건축 조감도 CG"
            style={{ scale: inner }}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        </div>
      </motion.div>
      <motion.div style={{ opacity: io }} className="absolute inset-x-0 bottom-0 px-6 md:px-14 lg:px-16 pb-14 md:pb-20">
        <MediaCaption c={chapters[0]} local={local} at={0.3} />
      </motion.div>
    </motion.div>
  )
}

/** 02 and 03 are shown whole. A 2.6:1 render cropped to a 16:9 window loses
 *  the ends of the room, which is the whole point of shooting it that wide —
 *  so the frame letterboxes instead of cropping, and the drift is small enough
 *  that nothing leaves the screen. */
function WideChapter({
  p,
  win,
  c,
  src,
  alt,
  ground,
  veil,
}: {
  p: MotionValue<number>
  win: [number, number]
  c: Chapter
  src: string
  alt: string
  ground: string
  veil: string
}) {
  const local = useLocal(p, win)
  const hold = useHold(p, win)
  const scale = useTransform(local, [0, 1], [1.0, 1.035])
  const out = useTransform(local, [0.9, 1], [1, 0])

  return (
    <motion.div style={{ opacity: hold }} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ opacity: out, background: ground }} className="absolute inset-0">
        <motion.img
          src={src}
          alt={alt}
          style={{ scale }}
          className="absolute inset-0 w-full h-full object-cover md:object-contain will-change-transform"
          draggable={false}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${veil}`} />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-14 lg:px-16 pb-10 md:pb-14">
          <MediaCaption c={c} local={local} at={0.28} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function CinematicChapter({ p }: { p: MotionValue<number> }) {
  const local = useLocal(p, W[3])
  const hold = useHold(p, W[3])
  const out = useTransform(local, [0.96, 1], [1, 0])
  const ref = useRef<HTMLVideoElement>(null)
  const [, setLive] = useState(false)

  useMotionValueEvent(p, "change", (v) => {
    const on = v > W[3][0] - 0.08 && v < W[3][1] + 0.02
    setLive((was) => {
      if (was !== on) {
        const el = ref.current
        if (el) on ? void el.play().catch(() => {}) : el.pause()
      }
      return on
    })
  })

  return (
    <motion.div style={{ opacity: hold }} className="absolute inset-0">
      <Ghost no="04" local={local} className="left-[3vw] top-[6vh]" />
      <motion.div style={{ opacity: out }} className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden bg-black">
          <video
            ref={ref}
            className="absolute inset-0 w-full h-full object-cover"
            src="/flow/04-cinematic.mp4"
            poster="/flow/04-poster.webp"
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-14 lg:px-16 pb-20 md:pb-28">
          <MediaCaption c={chapters[3]} local={local} at={0.3} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/** 05 — the live site under the reader's own hand: landing in the garden,
 *  opening a spot's panel, then Day → Night → Fall. Scrubbed, not played. */
function WebChapter({ p }: { p: MotionValue<number> }) {
  const local = useLocal(p, W[4])
  const hold = useHold(p, W[4])
  const out = useTransform(local, [0.95, 1], [1, 0])
  const ref = useRef<HTMLVideoElement>(null)
  useScrub(ref, p, W[4])

  // The copy rides the aerial and is gone before the cursor presses the
  // garden; after that the site's own interface is the picture.
  const cap = useTransform(local, [0.005, 0.03, 0.17, 0.215], [0, 1, 1, 0])

  return (
    <motion.div style={{ opacity: hold }} className="absolute inset-0 overflow-hidden bg-black">
      {/* Contained at every width: this clip is an interface, and cropping
          it to fill a phone would cut the very buttons it is showing. */}
      <motion.video
        ref={ref}
        style={{ opacity: out }}
        className="absolute inset-0 w-full h-full object-contain"
        src="/flow/05-web.mp4"
        poster="/flow/05-poster.webp"
        muted
        playsInline
        preload="auto"
      />
      <motion.div
        style={{ opacity: cap }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
      />
      <motion.div style={{ opacity: cap }} className="absolute inset-x-0 bottom-0 px-6 md:px-14 lg:px-16 pb-14 md:pb-20">
        <MediaCaption c={chapters[4]} local={local} at={0.01} quick />
      </motion.div>

      <ScrubHint local={local} />
    </motion.div>
  )
}

/** 06 — the same site, dragged left and right: the 360 itself. */
function VrChapter({ p }: { p: MotionValue<number> }) {
  const local = useLocal(p, W[5])
  const hold = useHold(p, W[5], { last: true })
  const ref = useRef<HTMLVideoElement>(null)
  useScrub(ref, p, W[5])

  const cap = useTransform(local, [0.04, 0.14, 0.7, 0.82], [0, 1, 1, 0])
  const sweep = useTransform(local, (v) => `${Math.round(Math.min(v / 0.95, 1) * 100)}%`)

  return (
    <motion.div style={{ opacity: hold }} className="absolute inset-0 overflow-hidden bg-black">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover md:object-contain"
        src="/flow/06-vr.mp4"
        poster="/flow/06-poster.webp"
        muted
        playsInline
        preload="auto"
      />
      <motion.div
        style={{ opacity: cap }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
      />
      <motion.div style={{ opacity: cap }} className="absolute inset-x-0 bottom-0 px-6 md:px-14 lg:px-16 pb-14 md:pb-20">
        <MediaCaption c={chapters[5]} local={local} at={0.06} />
        <div className="mt-8 flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/55">360°</span>
          <span className="relative block w-32 md:w-48 h-px bg-white/25">
            <motion.span style={{ width: sweep, background: "#e9a27c" }} className="absolute inset-y-0 left-0 block h-px" />
          </span>
        </div>
      </motion.div>
      <ScrubHint local={local} />
    </motion.div>
  )
}

/** Says, once, that the picture is tied to the scroll — otherwise a reader who
 *  stops scrolling thinks the video has frozen. */
function ScrubHint({ local }: { local: MotionValue<number> }) {
  const o = useTransform(local, [0, 0.03, 0.12, 0.18], [0, 1, 1, 0])
  return (
    <motion.div
      style={{ opacity: o }}
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-20 md:top-24 flex items-center gap-2"
    >
      <span className="font-mono text-[10px] tracking-[0.18em] text-white/60">SCROLL</span>
      <span className="text-white/60 text-xs">↓</span>
    </motion.div>
  )
}

/* -------------------------------- section -------------------------------- */

export default function ServiceFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const reduced = useReducedMotion()

  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // The film gets a proper iris: the frame closes to black going into 04 and
  // closes again coming out of it, so the cut at each end is deliberate rather
  // than a clip appearing and vanishing mid-shot.
  // The approach: from the section's top edge reaching the bottom of the
  // screen to the stage pinning. The title's letters come down across it.
  const { scrollYProgress: approach } = useScroll({ target: ref, offset: ["start end", "start start"] })

  // The first stretch of pinned scroll moves nothing. The title has only just
  // settled when the stage pins; without this the very next notch of the
  // wheel starts dissolving it. Every chapter reads `p`, which sits at 0
  // through that stretch and then runs 0→1 over the rest exactly as before.
  const dwell = compact ? 18 : 24
  const run = compact ? 780 : 1080
  const lead = dwell / (run + dwell - 100)
  const p = useTransform(scrollYProgress, (v) => Math.min(Math.max((v - lead) / (1 - lead), 0), 1))

  const bars = useTransform(
    p,
    [W[2][1] - 0.022, W[2][1], W[3][0] + 0.035, W[3][1] - 0.055, W[3][1] - 0.004, W[4][0] + 0.03],
    ["0%", "52%", "7%", "7%", "52%", "0%"],
  )
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  if (reduced) return <StaticFallback />

  return (
    <section
      ref={ref}
      id="service-flow"
      className="relative"
      style={{ height: `${run + dwell}vh` }}
    >
      {/* The stage is dark; only the title card paints paper over it. The
          stage itself does not clip — the title's letters start above it, in
          the lead-in band — so the chapters get their own clipping layer. */}
      <div data-stage className="sticky top-0 h-[100svh]" style={{ background: "#120f0c" }}>
        <TitleCard p={p} approach={approach} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none [&>*]:pointer-events-auto">
        <AerialChapter p={p} />
        <WideChapter
          p={p}
          win={W[1]}
          c={chapters[1]}
          src="/flow/02-perspective.webp"
          alt="쉐이크쉑 인천 매장 실내 건축 투시도 CG"
          ground={DARK}
          veil="from-black/85 via-black/10 to-transparent"
        />
        <WideChapter
          p={p}
          win={W[2]}
          c={chapters[2]}
          src="/flow/03-iso.webp"
          alt="카페 인테리어 아이소메트릭 절개 투시 CG"
          ground="#1a1512"
          veil="from-[#1a1512] via-[#1a1512]/20 to-transparent"
        />
        <CinematicChapter p={p} />
        <WebChapter p={p} />
        <VrChapter p={p} />
        </div>

        <motion.div style={{ height: bars }} className="pointer-events-none absolute inset-x-0 top-0 bg-black z-20" />
        <motion.div style={{ height: bars }} className="pointer-events-none absolute inset-x-0 bottom-0 bg-black z-20" />

        <div
          className="pointer-events-none absolute right-5 md:right-8 top-1/2 -translate-y-1/2 h-32 md:h-44 w-px z-10"
          style={{ background: "rgba(255,255,255,.22)" }}
        >
          <motion.span style={{ height: railFill, background: ACC }} className="absolute top-0 left-0 w-px block" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ 주요 실적 ------------------------------ */

type Work = {
  src: string
  name: string
  kind: string
  place: string
  tall?: boolean
  /** Shown at the picture's own proportions, uncropped. */
  full?: boolean
}

const works: Work[] = [
  { src: "/flow/work-leel-01.webp", name: "롯데건설 르엘 어퍼하우스", kind: "주거", place: "하이엔드 주거", full: true },
  { src: "/flow/work-shake-incheon-01.webp", name: "Shake Shack 인천", kind: "상업", place: "인천", tall: true },
  { src: "/flow/work-myongwolgwan-01.webp", name: "VISTA WALKERHILL SEOUL 명월관", kind: "호텔", place: "서울 광진" },
  { src: "/flow/work-byredo-04.webp", name: "BYREDO Blanche", kind: "광고", place: "캠페인", full: true },
  { src: "/flow/work-josun-01.webp", name: "GRAND JOSUN 제주", kind: "리조트", place: "제주", full: true },
  { src: "/flow/work-shake-01.webp", name: "Shake Shack 싱가포르", kind: "상업", place: "싱가포르" },
  { src: "/flow/work-byredo-02.webp", name: "BYREDO Blanche", kind: "광고", place: "캠페인", tall: true },
  { src: "/flow/work-shake-03.webp", name: "Shake Shack 싱가포르", kind: "상업", place: "싱가포르", full: true },
  { src: "/flow/work-josun-02.webp", name: "GRAND JOSUN 제주", kind: "리조트", place: "제주" },
]

// The index the company profile prints on its 주요 실적 page, in its order.
// The Lotte row was held back until the studio decided to list it (2026-11);
// it is shown with the one 1-2 garden picture and nothing else from the job.
const ledger: [string, string][] = [
  ["주거", "롯데건설 르엘 어퍼하우스"],
  ["호텔", "VISTA WALKERHILL SEOUL 명월관"],
  ["리조트", "GRAND JOSUN 제주"],
  ["주거", "HERMETIA 서초"],
  ["상업", "Shake Shack 인천 · 싱가포르"],
  ["광고", "BYREDO"],
]

/** 주요 실적, laid out like the company profile's spread rather than as a
 *  scroll-jacked reel: the index holds the left column while the work scrolls
 *  past it on the right. No sticky stage, no screen-per-project — the earlier
 *  version spent 560vh of scroll to show eight pictures, most of it paper. */
export function SelectedWorkFlow() {
  return (
    <section
      id="selected-work"
      className="relative px-6 md:px-14 lg:px-16 py-20 md:py-28"
      style={{ background: PAPER, borderTop: `1px solid ${PAPER2}` }}
    >
      <div className="md:flex md:gap-14 lg:gap-20">
        <div className="md:w-[32%] lg:w-[28%] shrink-0">
          <div className="md:sticky md:top-24">
            <span className="text-sm tracking-[0.25em]" style={{ color: ACC }}>SELECTED PROJECTS</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-[-0.03em]" style={{ color: INK }}>
              주요 실적
            </h2>
            <p className="mt-5 text-base leading-relaxed max-w-md" style={{ color: MUTE }}>
              호텔과 리조트, 상업 공간과 광고 캠페인까지 — 완공 전의 마감과 조명을
              먼저 확인할 수 있게 만든 장면들입니다.
            </p>

            <dl className="mt-10 border-t" style={{ borderColor: PAPER2 }}>
              {ledger.map(([kind, name]) => (
                <div
                  key={name}
                  className="flex gap-5 py-3.5 border-b text-base"
                  style={{ borderColor: PAPER2 }}
                >
                  <dt className="w-14 shrink-0 text-[13px] tracking-[0.12em] pt-0.5" style={{ color: ACC }}>
                    {kind}
                  </dt>
                  <dd style={{ color: INK }}>{name}</dd>
                </div>
              ))}
            </dl>

            <a
              href="/work"
              className="mt-10 inline-block text-base px-5 py-2.5 transition-colors hover:bg-[#9a4424] hover:text-[#f6efe4]"
              style={{ border: `1px solid ${ACC}`, color: ACC }}
            >
              포트폴리오 보기
            </a>
          </div>
        </div>

        {/* Columns, not a grid: the tiles are different heights on purpose and
            a grid would align them into rows, leaving a band of paper under
            every short one. */}
        <div className="mt-14 md:mt-0 flex-1 columns-1 sm:columns-2 gap-6 md:gap-8">
          {works.map((w, i) => (
            <WorkTile key={w.src + i} w={w} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkTile({ w, i }: { w: Work; i: number }) {
  return (
    <figure className="group mb-10 md:mb-12 break-inside-avoid">
      <Plate className={`w-full ${w.full ? "" : w.tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <img
          src={w.src}
          alt={`${w.name} 건축 CG`}
          loading="lazy"
          className={`${w.full ? "block w-full h-auto" : "absolute inset-0 w-full h-full object-cover"} transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]`}
          draggable={false}
        />
      </Plate>
      <figcaption className="mt-4 flex items-baseline gap-3">
        <span className="font-mono text-[10px] shrink-0" style={{ color: ACC }}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="text-sm md:text-[15px] leading-snug" style={{ color: INK }}>
          {w.name}
        </span>
        <span className="ml-auto shrink-0 text-[11px]" style={{ color: MUTE }}>
          {w.place}
        </span>
      </figcaption>
    </figure>
  )
}

/** Reduced-motion readers get the same six things as a plain grid. */
function StaticFallback() {
  const media = [
    "/flow/01-aerial.webp",
    "/flow/02-perspective.webp",
    "/flow/03-iso.webp",
    "/flow/04-poster.webp",
    "/flow/05-poster.webp",
    "/flow/06-poster.webp",
  ]
  return (
    <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16" style={{ background: PAPER, color: INK }}>
      <span className="text-xs tracking-[0.2em]" style={{ color: ACC }}>WHAT WE MAKE</span>
      <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">NAIN STUDIO 서비스</h2>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {chapters.map((c, i) => (
          <div key={c.no}>
            <Plate className="w-full aspect-[4/3]">
              <img src={media[i]} alt={`${c.title} 작업 예시`} className="absolute inset-0 w-full h-full object-cover" />
            </Plate>
            <div className="mt-5">
              <span className="font-mono text-sm" style={{ color: ACC }}>{c.no}</span>
              <h3 className="mt-2 text-lg md:text-xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTE }}>{c.line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
