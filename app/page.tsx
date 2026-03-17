// force update 2024-09-24
"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Youtube } from "lucide-react"

export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // 우클릭 및 보안 방지 로직 유지
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
      
      {/* ---------------- Header (Binyan 스타일: 좌-Contact, 중-Logo, 우-Work) ---------------- */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled ? "bg-black/20 backdrop-blur-md py-4" : "bg-transparent py-8"
        }`}
      >
        <nav className="max-w-[1800px] mx-auto px-6 md:px-14 flex items-center justify-between">
          {/* Left: Contact */}
          <div className="flex-1">
            <a href="/contact" className="text-sm md:text-base font-light tracking-widest hover:text-gray-400 transition-colors">
              CONTACT
            </a>
          </div>

          {/* Center: Logo (빈얀 스튜디오 스타일 위치 및 크기) */}
          <div className="flex-1 flex justify-center">
            <a href="/">
              <motion.img
                src="/logo.png"
                alt="NAIN"
                className="w-24 md:w-32 h-auto object-contain"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            </a>
          </div>

          {/* Right: Work */}
          <div className="flex-1 flex justify-end">
            <a href="/work" className="text-sm md:text-base font-light tracking-widest hover:text-gray-400 transition-colors">
              WORK
            </a>
          </div>
        </nav>
      </header>

      {/* ---------------- Main Hero (단일 영상 섹션) ---------------- */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* ★ 여기에 Vercel Blob이나 호스팅 주소를 넣으시면 200MB 영상도 끊김 없이 무한 반복됩니다. */}
          <source src="/background.mp4" type="video/mp4" />
        </video>
        
        {/* 영상 위 어두운 오버레이 (텍스트 가독성용, 필요 없으면 bg-black/0) */}
        <div className="absolute inset-0 bg-black/10" />

        {/* 빈얀 느낌의 하단 중앙 화살표나 안내가 필요하다면 여기에 추가 가능 */}
      </section>

      {/* ---------------- Bottom Section (기존 정보 유지) ---------------- */}
      <section className="py-24 bg-black text-white border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 md:px-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 items-end">
            
            {/* Left: Title & Description */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-light tracking-[0.05em]">
                NAIN STUDIO
              </h2>
              <p className="text-base md:text-lg leading-relaxed max-w-xl text-white/60 font-light">
                We are a creative visualization studio specializing in architectural imagery,
                animation, and realtime experiences.
              </p>
            </div>

            {/* Right: Socials */}
            <div className="flex md:justify-end gap-8">
              <a
                href="https://www.instagram.com/nainstudio0210/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-end gap-2"
              >
                <Instagram className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-[10px] md:text-xs tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">INSTAGRAM</span>
              </a>
              <a
                href="https://www.youtube.com/@Nainstudio-v5x"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-end gap-2"
              >
                <Youtube className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-[10px] md:text-xs tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">YOUTUBE</span>
              </a>
            </div>

          </div>
          
          {/* 카피라이트 (선택 사항) */}
          <div className="mt-20 text-[10px] text-white/20 tracking-widest">
            © 2024 NAIN STUDIO. ALL RIGHTS RESERVED.
          </div>
        </div>
      </section>
      
    </div>
  )
}