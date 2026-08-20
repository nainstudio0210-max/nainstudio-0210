"use client"

import { useEffect } from "react"
import { Instagram, Youtube, MessageCircle } from "lucide-react"
import SiteHeader from "./components/home/SiteHeader"
import CinematicIntro from "./components/home/CinematicIntro"
import ClientMarquee from "./components/home/ClientMarquee"
import ContactForm from "./components/home/ContactForm"
import TiltCard from "./components/home/TiltCard"
import { clients } from "./data/clients"

// Stills rather than the source clips: the three hero videos are 70–100MB each
// and this section sits below a 27MB frame sequence. The moving versions live
// on /work.
const featuredWork = [
  { title: "LE|EL UPPERHOUSE VR", src: "/work/le-el-upperhouse-home.jpg" },
  { title: "Shake Shake Incheon", src: "/work/shake-shake-incheon-home.jpg" },
  { title: "Gold Coast", src: "/work/gold-coast-home.jpg" },
]

const services = [
  { label: "스틸 이미지", en: "Still", desc: "설계 의도를 한 장의 이미지로 압축합니다." },
  { label: "애니메이션", en: "Animation", desc: "공간의 동선과 분위기를 시간 위에 펼칩니다." },
  { label: "리얼타임 · VR", en: "Realtime", desc: "실시간 워크스루로, 완공 전 공간을 미리 걷습니다." },
  { label: "AI 소셜 패키지", en: "AI Social Pack", desc: "짧은 형식의 소셜 콘텐츠로 확장되는 비주얼 패키지입니다." },
]

export default function Page() {
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
    // overflow-x must be `clip`, not `hidden`: `hidden` promotes overflow-y to
    // `auto`, which turns this div into a scroll container and silently kills
    // every `position: sticky` child inside it.
    <div className="relative min-h-screen bg-black text-white overflow-x-clip break-keep">

      <SiteHeader />

      {/* ---- 콘티 1–7: 야경 → 오피스 진입 → 모니터 진입 → 숲 → 파빌리온 생성 → 중정 ---- */}
      <CinematicIntro
        paragraphs={[
          "나인스튜디오는 건축가와 시행사가 상상한 공간을, 가장 설득력 있는 장면으로 시각화하는 스튜디오입니다.",
          "도면 위의 의도가 빛과 재질, 사람의 동선을 만나 완성되는 순간까지 — 스틸 이미지, 애니메이션, 리얼타임 경험으로 구현합니다.",
        ]}
      />

      {/* ---------------- Services ---------------- */}
      <section id="services" className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">SERVICES</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em] mb-14 md:mb-20">
          공간을 보여주는 네 가지 방식
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {services.map((s) => (
            <div key={s.en} className="bg-black p-8 md:p-10 flex flex-col gap-4">
              <span className="text-[10px] tracking-[0.15em] text-white/40">{s.en}</span>
              <h3 className="text-lg md:text-xl font-normal">{s.label}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 대표 프로젝트 ---------------- */}
      <section id="work-preview" className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20">
          <div>
            <span className="text-xs tracking-[0.2em] text-[#D9772B]">WORK</span>
            <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">대표 프로젝트</h2>
          </div>
          <a
            href="/work"
            className="text-sm border border-white/40 hover:border-white transition-colors px-5 py-2.5 self-start md:self-auto"
          >
            포트폴리오 보기
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredWork.map((item) => (
            <TiltCard key={item.title} className="group relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-sm md:text-base">{item.title}</span>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ---------------- 고객사 ---------------- */}
      <ClientMarquee clients={clients} />

      {/* ---------------- 문의 ---------------- */}
      <section id="contact" className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">CONTACT</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          지금, 프로젝트를 시작해보세요.
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/60">
          20년 경력의 디렉터가 첫 미팅부터 방향을 잡아드립니다.
          <br />
          간단한 브리핑만으로 견적과 일정 안내를 도와드립니다.
        </p>
        <ContactForm />
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="py-16 bg-black text-white border-t border-white/10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8 items-center">
          <div className="pl-6 md:pl-14 lg:pl-25">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.04em]">NAIN STUDIO</h2>
          </div>

          <div className="flex md:justify-end gap-6 pr-12 md:pr-24 lg:pr-36">
            <a href="https://www.instagram.com/nainstudio0210/" target="_blank" className="inline-flex items-center gap-2 hover:opacity-80">
              <Instagram className="w-6 h-6" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a href="https://www.youtube.com/@Nainstudio-v5x" target="_blank" className="inline-flex items-center gap-2 hover:opacity-80">
              <Youtube className="w-6 h-6" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
            <a href="https://pf.kakao.com/_hPAlX" target="_blank" className="inline-flex items-center gap-2 hover:opacity-80">
              <MessageCircle className="w-6 h-6" />
              <span className="hidden sm:inline">KakaoTalk</span>
            </a>
          </div>

          <div className="pl-6 md:pl-14 lg:pl-25 pr-6 md:pr-14 lg:pr-25 md:col-span-2">
            <p className="text-sm md:text-base leading-relaxed max-w-2xl opacity-70">
              20년 경력 디렉터와 함께하는 Architecture Visualization Studio — 건축 시각화 · 애니메이션 · 리얼타임 경험
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
