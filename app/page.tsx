"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion"
// ✅ next/image는 컴포넌트라서 브라우저의 window.Image와 이름이 겹치지 않게 별칭 사용
import NextImage from "next/image"

// ---------- 작은 유틸 ----------
function Spacer() {
  return <div className="h-16 md:h-24 bg-black" />
}
function BigSpacer({ h = "180vh" }: { h?: string }) {
  return <div style={{ height: h }} className="bg-black" />
}

// ---------- 히어로들 ----------
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

      {/* 로고 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 0.8 }}
        className="absolute z-10 left-1/2 -translate-x-1/2 top-28 md:top-32"
      >
        <NextImage
          src="/logo.png"
          alt="NAIN"
          width={380}
          height={88}
          priority
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </motion.div>
    </section>
  )
}

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

// ---------- 스크롤 시퀀스 (캔버스) ----------
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
      // ✅ 브라우저 생성자 강제 사용 (next/image와 이름 충돌 방지)
      const img = new window.Image() as HTMLImageElement
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

// ---------- 스티키 리빌 ----------
function StickyReveal({ src }: { src: string }) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.25 })

  const videoOpacity = useTransform(smooth, [0, 0.01, 0.99, 1], [0, 1, 1, 0])
  const ctaOpacity = useTransform(smooth, [0.08, 0.2, 0.8, 0.92], [0, 1, 1, 0])
  const ctaX = useTransform(smooth, [0.08, 0.2], [80, 0])

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
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

        <motion.div
          style={{ opacity: ctaOpacity, x: ctaX }}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10 text-right pointer-events-auto"
        >
          <p className="text-base md:text-2xl tracking-wide">Want to see more?</p>
          <a href="/work" className="block text-xl md:text-4xl font-medium underline underline-offset-4 hover:opacity-80">
            Check out our work!
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ---------- 페이지 ----------
export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // 간단 보호: 우클릭/드래그/일부 단축키 차단
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
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

      {/* Bottom Section */}
      <section className="py-16 bg-black text-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8 items-center">
          <div className="pl-6 md:pl-14 lg:pl-25">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.04em] md:tracking-[0.04em]">NAIN STUDIO</h2>
          </div>

          <div className="flex md:justify-end gap-6 pr-6 md:pr-14 lg:pr-25">
            <a
              href="https://www.instagram.com/nainstudio0210/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80"
              aria-label="Instagram"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
              </svg>
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@Nainstudio-v5x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80"
              aria-label="YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23 7.5a4 4 0 0 0-2.8-2.8C18.3 4 12 4 12 4s-6.3 0-8.2.7A4 4 0 0 0 1 7.5 41 41 0 0 0 0 12a41 41 0 0 0 1 4.5 4 4 0 0 0 2.8 2.8C5.7 20 12 20 12 20s6.3 0 8.2-.7A4 4 0 0 0 23 16.5 41 41 0 0 0 24 12a41 41 0 0 0-1-4.5zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </div>

          <div className="pl-6 md:pl-14 lg:pl-25 pr-6 md:pr-14 lg:pr-25 md:col-span-2">
            <p className="text-lg leading-relaxed max-w-2xl">
              We are a creative visualization studio specializing in architectural imagery, animation, and realtime
              experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
