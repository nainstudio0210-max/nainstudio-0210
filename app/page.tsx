// force update 2024-09-24
"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Youtube } from "lucide-react"

export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ===== 보안 차단 (오리지널 로직 유지) =====
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      if (
        k === "contextmenu" ||
        (mod && (k === "s" || k === "p" || k === "u" || k === "i" || k === "j")) ||
        k === "printscreen"
      ) {
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
      
      {/* ---------------- Header (빈얀 스타일 초슬림 모드) ---------------- */}
      {/* ★ pt-[10px] 처럼 픽셀 단위로 넣으면 숫자가 작을수록 더 위로 올라갑니다. */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent pt-[10px] md:pt-[20px]">
        {/* ★ py-0으로 아래쪽 여백을 완전히 없애서 슬림하게 만들었습니다. */}
        <nav className="w-full px-6 md:px-14 lg:px-16 py-0 flex items-center justify-between">
          
          {/* Left: Contact (opacity-70 추가로 밝기 조절) */}
          <div className="flex-1">
            <a href="/contact" className="text-sm md:text-base hover:text-white transition-colors opacity-70 hover:opacity-100">
              Contact
            </a>
          </div>

          {/* Center: Large Logo */}
          <div className="flex-1 flex justify-center">
            <a href="/">
              <motion.img
                src="/logo.png"
                alt="NAIN"
                className="w-48 md:w-80 h-auto object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                // ★ opacity: 0.8 등으로 조절하면 로고의 투명도(밝기)가 조절됩니다.
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.8 }}
                draggable={false}
              />
            </a>
          </div>

          {/* Right: Work (text-white/60 처럼 색상 투명도 방식도 가능) */}
          <div className="flex-1 flex justify-end">
            <a href="/work" className="text-sm md:text-base hover:text-white transition-colors text-white/60 hover:text-white">
              Work
            </a>
          </div>
        </nav>
      </header>

      {/* ---------------- Main Hero (단일 영상 섹션) ---------------- */}
      <section className="relative h-screen w-full flex items-center justify-center text-center">
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
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </section>

      {/* ---------------- Bottom Section (오리지널 스타일 100%) ---------------- */}
      <section className="py-16 bg-black text-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8 items-center">
          <div className="pl-6 md:pl-14 lg:pl-25">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.04em]">
              NAIN STUDIO
            </h2>
          </div>

          <div className="flex md:justify-end gap-6 pr-6 md:pr-14 lg:pr-25">
            <a href="https://www.instagram.com/nainstudio0210/" target="_blank" className="inline-flex items-center gap-2 hover:opacity-80">
              <Instagram className="w-6 h-6" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a href="https://www.youtube.com/@Nainstudio-v5x" target="_blank" className="inline-flex items-center gap-2 hover:opacity-80">
              <Youtube className="w-6 h-6" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </div>

          <div className="pl-6 md:pl-14 lg:pl-25 pr-6 md:pr-14 lg:pr-25 md:col-span-2">
            <p className="text-lg leading-relaxed max-w-2xl opacity-80">
              We are a creative visualization studio specializing in architectural imagery,
              animation, and realtime experiences.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  )
}