// force update 2024-09-24
"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Youtube } from "lucide-react"

export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // 스크롤을 내리면 헤더 배경이 살짝 어두워지게 설정
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ===== 우클릭 및 단축키 보안 차단 =====
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
  // ========================================

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* ---------------- Header (Binyan 스타일 중앙 로고 + 오리지널 폰트) ---------------- */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled ? "bg-black/20 backdrop-blur-md py-4" : "bg-transparent py-8"
        }`}
      >
        <nav className="max-w-[1800px] mx-auto px-6 md:px-14 flex items-center justify-between">
          
          {/* Left: Contact (오리지널 폰트 스타일 복구) */}
          <div className="flex-1">
            <a href="/contact" className="text-sm md:text-base hover:text-gray-200 transition-colors">
              CONTACT
            </a>
          </div>

          {/* Center: Logo (크기 확대 반영) */}
          <div className="flex-1 flex justify-center">
            <a href="/">
              <motion.img
                src="/logo.png"
                alt="NAIN"
                className="w-32 md:w-48 h-auto object-contain"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </a>
          </div>

          {/* Right: Work (오리지널 폰트 스타일 복구) */}
          <div className="flex-1 flex justify-end">
            <a href="/work" className="text-sm md:text-base hover:text-gray-200 transition-colors">
              WORK
            </a>
          </div>
        </nav>
      </header>

      {/* ---------------- Main Hero (심플한 단일 영상 섹션) ---------------- */}
      <section className="relative h-screen w-full overflow-hidden">
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
          {/* ★ 추후 Vercel Blob 등 호스팅 주소로 교체할 부분 */}
          <source src="/background.mp4" type="video/mp4" />
        </video>
        
        {/* 영상 위 어두운 오버레이 (가독성을 위해 10% 어둡게, 필요시 조절) */}
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* ---------------- Bottom Section (완전한 오리지널 구조 및 폰트 복구) ---------------- */}
      <section className="py-16 bg-black text-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8 items-center">
          
          {/* Left: Title */}
          <div className="pl-6 md:pl-14 lg:pl-25">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.04em] md:tracking-[0.04em]">
              NAIN STUDIO
            </h2>
          </div>

          {/* Right: Socials (icons + uppercase text) */}
          <div className="flex md:justify-end gap-6 pr-6 md:pr-14 lg:pr-25">
            <a
              href="https://www.instagram.com/nainstudio0210/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
              <span className="hidden sm:inline">INSTAGRAM</span>
            </a>
            <a
              href="https://www.youtube.com/@Nainstudio-v5x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
              <span className="hidden sm:inline">YOUTUBE</span>
            </a>
          </div>

          {/* Description */}
          <div className="pl-6 md:pl-14 lg:pl-25 pr-6 md:pr-14 lg:pr-25 md:col-span-2">
            <p className="text-lg leading-relaxed max-w-2xl">
              We are a creative visualization studio specializing in architectural imagery,
              animation, and realtime experiences.
            </p>
          </div>
          
        </div>
      </section>
      
    </div>
  )
}