"use client"

import { useEffect } from "react"
import { Instagram, Youtube, MessageCircle } from "lucide-react"
import SiteHeader from "./components/home/SiteHeader"
import CinematicIntro from "./components/home/CinematicIntro"
import ClientMarquee from "./components/home/ClientMarquee"
import ContactForm from "./components/home/ContactForm"
import ServiceFlow, { SelectedWorkFlow } from "./components/home/ServiceFlow"
import { serviceIcons } from "./components/home/ServiceIcons"
import { clients } from "./data/clients"

// Paper palette, shared with the leaflet and the company profile.
const PAPER = "#e4dbcb"
const PAPER2 = "#dad0bd"
const INK = "#1f1b16"
const MUTE = "#584e42"
const ACC = "#9a4424"

const CART_URL = "https://yn-golf-cart-parts-explorer.vercel.app/"

const featuredWork = [
  {
    title: "LE|EL UPPERHOUSE",
    kind: "현상설계 CG · 360VR · VR 웹페이지",
    src: "/work/leel-home-mono.webp",
    preview: undefined as string | undefined,
    // Greyscale and locked: the client has not cleared this one for the site.
    locked: true,
    cta: "문의 주시면 보여드립니다",
    href: "/contact",
  },
  {
    title: "GOLF CART & LSV PARTS",
    kind: "인터랙티브 웹 카탈로그",
    src: "/work/golfcart-home.webp",
    preview: "/work/golfcart-preview.mp4",
    locked: false,
    cta: "카탈로그 열기",
    href: CART_URL,
  },
  {
    title: "NAIN STUDIO SHOWREEL",
    kind: "2026 쇼릴",
    src: "/work/Logo_1920x1080_White_2026.jpg",
    preview: "/work/showreel-preview.mp4",
    locked: false,
    cta: "쇼릴 재생",
    href: "https://www.youtube.com/watch?v=-ZPEkh02j3c",
  },
]

// Each card is the entry point to its /services page — the one route search
// actually lands on. Copy is repeated here rather than imported from
// app/services/data.ts on purpose: this is a client component, and importing
// that module would ship every landing page's body text in the home bundle.
const services = [
  { label: "스틸 이미지", en: "Still", icon: "perspective", desc: "설계 의도를 한 장의 이미지로 압축합니다.", href: "/services/architectural-rendering" },
  { label: "애니메이션 · 홍보영상", en: "Animation", icon: "cinematic", desc: "공간의 동선과 분위기를 시간 위에 펼칩니다. 숏폼 소셜 리컷까지.", href: "/services/animation" },
  { label: "리얼타임 · VR", en: "Realtime", icon: "vr", desc: "실시간 워크스루로, 완공 전 공간을 미리 걷습니다.", href: "/services/vr" },
  { label: "현상설계 CG", en: "Competition", icon: "aerial", desc: "제출 일정에서 역산해 패널 이미지와 심사용 영상을 맞춥니다.", href: "/services/competition" },
] as const

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

      {/* The intro ends on black and the sequence starts on paper. Without
          this the two meet on a hard line across the page; a band of their own
          gradient lets the eye walk from one to the other. */}
      <div
        id="flow-lead"
        aria-hidden
        className="h-[42vh] md:h-[55vh] -mb-px"
        style={{ background: `linear-gradient(to bottom, #000 0%, #0f0d0b 22%, #6b5f50 68%, ${PAPER} 100%)` }}
      />

      {/* ---- 스크롤로 넘기는 서비스 시퀀스 → 주요 실적 ---- */}
      <ServiceFlow />
      <SelectedWorkFlow />

      {/* ---------------- Services ---------------- */}
      {/* The sequence above shows the work; this grid is the index under it —
          the only place on the home page that links into /services/*. */}
      <section
        id="services"
        className="py-20 md:py-28 px-6 md:px-14 lg:px-16"
        style={{ background: PAPER, color: INK, borderTop: `1px solid ${PAPER2}` }}
      >
        <span className="text-xs tracking-[0.2em]" style={{ color: ACC }}>SERVICES</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em] mb-14 md:mb-20">
          서비스 자세히 보기
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: PAPER2 }}>
          {services.map((s) => (
            <a
              key={s.en}
              href={s.href}
              className="group p-8 md:p-10 flex flex-col gap-4 transition-colors"
              style={{ background: PAPER }}
            >
              {(() => {
                const Icon = serviceIcons[s.icon]
                return <Icon className="w-10 h-10" />
              })()}
              <span className="text-[10px] tracking-[0.15em]" style={{ color: ACC }}>{s.en}</span>
              <h3 className="text-lg md:text-xl font-normal">{s.label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTE }}>{s.desc}</p>
              <span
                className="mt-auto pt-6 text-xs transition-opacity opacity-60 group-hover:opacity-100"
                style={{ color: ACC }}
              >
                자세히 보기 →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------------- 대표 프로젝트 ---------------- */}
      <section
        id="work-preview"
        className="py-20 md:py-28 px-6 md:px-14 lg:px-16"
        style={{ background: PAPER, color: INK, borderTop: `1px solid ${PAPER2}` }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20">
          <div>
            <span className="text-xs tracking-[0.2em]" style={{ color: ACC }}>WORK</span>
            <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">대표 프로젝트</h2>
          </div>
          <a
            href="/work"
            className="text-sm px-5 py-2.5 self-start md:self-auto transition-colors"
            style={{ border: `1px solid ${ACC}`, color: ACC }}
          >
            포트폴리오 보기
          </a>
        </div>

        {/* Hovering a card should feel like a frame being set, not like the
            card wobbling. Four things move together and none of them is a
            tilt: the outline closes in on the picture, the picture comes up
            out of grey, a rule draws under the title, and the label gives way
            to where the card actually goes. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {featuredWork.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group block focus:outline-none"
              // The preview only runs under the pointer, and goes back to its
              // first frame on the way out so the next hover starts clean.
              onMouseEnter={(e) => void e.currentTarget.querySelector("video")?.play().catch(() => {})}
              onMouseLeave={(e) => {
                const v = e.currentTarget.querySelector("video")
                if (v) {
                  v.pause()
                  v.currentTime = 0
                }
              }}
            >
              <div
                className="relative aspect-[16/10] overflow-hidden bg-[#15120f] outline outline-[1.5px] outline-[#9a4424]
                           [outline-offset:10px] group-hover:[outline-offset:2px] group-focus-visible:[outline-offset:2px]
                           transition-[outline-offset] duration-700 ease-out"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[.45] saturate-[.85]
                             transition-[transform,filter] duration-[1100ms] ease-out
                             group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.06]"
                  draggable={false}
                />
                {item.preview && (
                  <video
                    src={item.preview}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                {item.locked && (
                  <>
                    {/* The veil thins on hover — enough to say there is
                        something here without showing the project. */}
                    <div className="absolute inset-0 backdrop-blur-[7px] bg-black/40 transition-all duration-700 group-hover:backdrop-blur-[3px] group-hover:bg-black/20" />
                    <span
                      className="absolute top-4 right-4 z-10 text-[10px] tracking-[0.18em] px-3 py-1.5"
                      style={{ background: PAPER, color: INK }}
                    >
                      비공개
                    </span>
                  </>
                )}

                {/* The index slides in from the edge it is pinned to. */}
                <span className="absolute top-4 left-4 z-10 font-mono text-[11px] tracking-[0.2em] text-[#f3ede3]/0 -translate-x-2 transition-all duration-500 group-hover:text-[#f3ede3]/80 group-hover:translate-x-0">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="absolute inset-x-5 bottom-5 z-10 block">
                  <span className="flex items-end justify-between gap-3">
                    <span className="text-[#f3ede3] text-sm md:text-base tracking-[0.02em] transition-transform duration-500 group-hover:-translate-y-1">
                      {item.title}
                    </span>
                    {/* Wiped in from the left rather than faded: a fade on a
                        chip this small just reads as a rendering hiccup. */}
                    <span
                      className="shrink-0 text-[10px] md:text-xs px-3 py-1.5 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-out group-hover:[clip-path:inset(0_0_0_0)]"
                      style={{ background: ACC, color: "#f6efe4" }}
                    >
                      {item.cta} ↗
                    </span>
                  </span>
                  <span
                    className="mt-3 block h-px origin-left scale-x-0 transition-transform duration-700 delay-75 ease-out group-hover:scale-x-100"
                    style={{ background: ACC }}
                  />
                </span>
              </div>
              <p className="mt-6 text-xs md:text-sm transition-colors duration-500 group-hover:text-[#9a4424]" style={{ color: MUTE }}>
                {item.kind}
              </p>
            </a>
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
              Architecture Visualization Studio — 건축 시각화 · 애니메이션 · 리얼타임 경험
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
