"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion"
import { Instagram, Youtube } from "lucide-react"

/* -------------------- Hero (Intro) -------------------- */
function HeroIntro({ src }: { src: string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        controls={false}
        controlsList="nodownload noplaybackrate"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/0" />

      {/* 로고: 문자열 경로로 next/image 사용, 애니메이션은 래퍼에 적용 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 0.8 }}
        className="absolute z-10 left-1/2 -translate-x-1/2 top-28 md:top-130"
      >
        <Image
          src="/logo.png"
          alt="NAIN"
          width={384}         // 필요에 맞게 수정 가능
          height={88}
          priority
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="w-60 md:w-96 h-auto"
        />
      </motion.div>
    </section>
  )
}

/* -------------------- Hero (Plain Video) -------------------- */
function HeroVideo({ src }: { src: string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        controls={false}
        controlsList="nodownload noplaybackrate"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/0" />
    </section>
  )
}

/* -------------------- Spacers -------------------- */
function Spacer() {
  return <div className="h-16 md:h-24 bg-black" />
}

function BigSpacer({ h = "180vh" }: { h?: string }) {
  return <div style={{ height: h }} className="bg-black" />
}

/* -------------------- Scroll Sequence (Canvas) -------------------- */
function SequenceFixed() {
  const COUNT = 51
  const PAD = 4
  const BASE = "/sequence/02/frame_"
  const EXT = "png"
  const srcOf = (i: number) => `${BASE}${String(i).padStart(PAD, "0")}.${EXT}`

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const curRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let loaded = 0
    framesRef.current = Array.from({ length: COUNT }, (_, i) => {
      const img = new Image()
      img.src = srcOf(i)
      img.onload = () => {
        loaded += 1
        if (loaded === COUNT) {
          setReady(true)
          draw(curRef.current)
        }
      }
      return img
    })
  }, [])

  function draw(index: number) {
    const canvas = canvasRef.current
    const img = framesRef.current[index]
    if (!canvas || !img) return
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const cssW = canvas.clientWidth
    const cssH = canvas.clientHeight
    const bw = Math.round(cssW * dpr)
    const bh = Math.round(cssH * dpr)
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
    }
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(dpr, dpr)
    const s = Math.min(cssW / img.width, cssH / img.height)
    const w = img.width * s
    const h = img.height * s
    const x = (cssW - w) / 2
    const y = (cssH - h) / 2
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(img, x, y, w, h)
  }

  useEffect(() => {
    const onResize = () => draw(curRef.current)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.25 })

  useMotionValueEvent(smooth, "change", (v) => {
    if (!ready) return
    const idx = Math.max(0, Math.min(COUNT - 1, Math.round(v * (COUNT - 1))))
    if (idx !== curRef.current) {
      curRef.current = idx
      draw(idx)
    }
  })

  const slideY = useTransform(smooth, [0, 0.12], ["100vh", "0vh"])
  const overlayOpacity = useTransform(smooth, [0, 0.92, 0.96, 1], [1, 1, 0, 0])

  return (
    <section ref={sectionRef} className="relative h-[380vh]">
      {/* 클릭 가로채지 않도록 */}
      <motion.div className="fixed inset-0 z-20 pointer-events-none" style={{ y: slideY, opacity: overlayOpacity }}>
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[min(78vw,1000px)] aspect-video">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* -------------------- Sticky Reveal -------------------- */
function StickyReveal({ src }: { src: string }) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.25 })

  const videoOpacity = useTransform(smooth, [0, 0.01, 0.99, 1], [0, 1, 1, 0])
  const ctaOpacity = useTransform(smooth, [0.08, 0.2, 0.8, 0.92], [0, 1, 1, 0])
  const ctaX = useTransform(smooth, [0.08, 0.2], [80, 0])

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      {/* 고정 레이어가 클릭을 막지 않도록 */}
      <motion.div className="fixed inset-0 z-10 pointer-events-none" style={{ opacity: videoOpacity }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          controls={false}
          controlsList="nodownload noplaybackrate"
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* CTA는 클릭 가능해야 하므로 auto */}
        <motion.div
          style={{ opacity: ctaOpacity, x: ctaX }}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10 text-right pointer-events-auto"
        >
          <p className="text-base md:text-2xl tracking-wide">Want to see more?</p>
          <a href="/work" className="block text-xl md:text-4xl font-medium underline underline-offset-4 hover:opacity-80">
            Check out out work!
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* -------------------- Page -------------------- */
export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ===== Work 페이지와 동일한 보안 차단 =====
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      // 개발자도구/저장/인쇄/소스보기 일부 단축키 억제
      if (k === "contextmenu" || (mod && (k === "s" || k === "p" || k === "u" || k === "i" || k === "j")) || k === "printscreen") {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener("contextmenu", prevent)
    document.addEventListener("dragstart", prevent)
    document.addEventListener("selectstart", prevent)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("contextmenu", prevent)
      document.removeEventListener("dragstart", prevent)
      document.removeEventListener("selectstart", prevent)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])
  // ========================================

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <header
        className={`fixed top-0 left-0 w-full z-30 transition-colors duration-500 ${
          scrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="w-full px-6 md:px-14 lg:px-16 py-8 flex items-center justify-between">
          <a href="/contact" className="text-sm md:text-base hover:text-gray-200">
            Contact
          </a>
          <a href="/work" className="text-sm md:text-base hover:text-gray-200">
            Work
          </a>
        </nav>
      </header>

      <HeroIntro src="/background.mp4" />
      <SequenceFixed />
      <StickyReveal src="/background-2.mp4" />

      <BigSpacer h="200vh" />
      <HeroVideo src="/background-3.mp4" />
      <BigSpacer h="20vh" />

      {/* ===== Bottom Section ===== */}
      <section className="py-16 bg-black text-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8 items-center">
          {/* Left: Title */}
          <div className="pl-6 md:pl-14 lg:pl-25">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.04em] md:tracking-[0.04em]">NAIN STUDIO</h2>
          </div>

          {/* Right: Socials (icons + text) */}
          <div className="flex md:justify-end gap-6 pr-6 md:pr-14 lg:pr-25">
            <a
              href="https://www.instagram.com/nainstudio0210/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@Nainstudio-v5x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </div>

          {/* Description */}
          <div className="pl-6 md:pl-14 lg:pl-25 pr-6 md:pr-14 lg:pr-25 md:col-span-2">
            <p className="text-lg leading-relaxed max-w-2xl">
              We are a creative visualization studio specializing in architectural imagery, animation, and realtime
              experiences.
            </p>
          </div>
        </div>
      </section>
      {/* ===== /Bottom Section ===== */}
    </div>
  )
}
