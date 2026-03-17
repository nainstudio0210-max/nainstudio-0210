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
      
      {/* ---------------- Header (블러 효과 완전 삭제 및 투명 고정) ---------------- */}
      {/* 배경을 투명(bg-transparent)으로 고정하여 빨간색으로 표시하셨던 블러 효과를 원천 차단했습니다. */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        
        {/* ★ 강제 중앙 정렬(items-center)을 상단 정렬(items-start)로 바꿔서 족쇄를 풀었습니다! */}
        <nav className="w-full px-6 md:px-14 lg:px-16 flex items-start justify-between">
          
          {/* Left: Contact */}
          {/* ★ 글씨 높이 조절 1: mt-[30px] 숫자를 줄이면 위로 올라갑니다. (예: mt-[10px]) */}
          <div className="flex-1 mt-[20px] md:mt-[30px]">
            <a href="/contact" className="text-sm md:text-base hover:text-white transition-colors opacity-70 hover:opacity-100">
              Contact
            </a>
          </div>

          {/* Center: Large Logo */}
          {/* ★ 로고 높이 조절: mt-[15px] 숫자를 조절하세요. 화면 밖으로 밀어 올리고 싶으면 -mt-[10px] 처럼 마이너스를 쓰세요! */}
          <div className="flex-1 flex justify-center -mt-[4px] md:mt-[15px]">
            <a href="/">
              <motion.img
                src="/logo02.png"
                alt="NAIN"
                className="w-40 md:w-64 h-auto object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.8 }}
                draggable={false}
              />
            </a>
          </div>

          {/* Right: Work */}
          {/* ★ 글씨 높이 조절 2: 왼쪽 Contact와 똑같은 mt- 숫자로 맞춰주세요. */}
          <div className="flex-1 flex justify-end mt-[20px] md:mt-[30px]">
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