"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Instagram, Youtube, Play, ChevronLeft, ChevronRight, X as XIcon } from "lucide-react"

type MediaItem = {
  id: string
  type: "image" | "video"
  src: string
  title: string
  caption?: string
  poster?: string
  span?: string
}

/* 6열 반복 패턴 (빈칸 없이 타일링) */
function spanFor(i: number) {
  const r = i % 14
  switch (r) {
    case 0:  return "md:col-span-3 md:row-span-2"
    case 1:  return "md:col-span-3 md:row-span-2"
    case 2:  return "md:col-span-2 md:row-span-2"
    case 3:  return "md:col-span-2 md:row-span-2"
    case 4:  return "md:col-span-2 md:row-span-2"
    case 5:  return "md:col-span-4 md:row-span-2"
    case 6:  return "md:col-span-2 md:row-span-2"
    case 7:  return "md:col-span-3 md:row-span-2"
    case 8:  return "md:col-span-3 md:row-span-2"
    case 9:  return "md:col-span-2 md:row-span-2"
    case 10: return "md:col-span-4 md:row-span-2"
    case 11: return "md:col-span-2 md:row-span-2"
    case 12: return "md:col-span-2 md:row-span-2"
    default: return "md:col-span-2 md:row-span-2"
  }
}

export default function WorkPage() {
  /* 사이드바 폭(로고 크게 사용) */
  const SIDEBAR_W = "w-32 md:w-36"

  /* 네비 위치/간격 조절용 상수 (px) */
  const NAV_OFFSET_PX = 14
  const NAV_GAP_PX = 8

  const items: MediaItem[] = useMemo(
    () => [
      { id: "01", type: "video", src: "/work/01.mp4", poster: "/work/01_poster.jpg", title: "High-rise Above the Clouds", caption: "Exterior visualization / Concept" },
      { id: "02", type: "image", src: "/work/02.jpg", title: "Arcade of Umbrellas", caption: "Commercial / Garden" },
      { id: "03", type: "video", src: "/work/03_low.mp4", poster: "/work/03_poster.jpg", title: "Fabric Facade", caption: "Detail / Motion" },
      { id: "04", type: "video", src: "/work/04_low.mp4", poster: "/work/04_poster.jpg", title: "Board & Pieces", caption: "Lifestyle / Motion" },
      { id: "05", type: "video", src: "/work/05.mp4", poster: "/work/05_poster.jpg", title: "Yellow Sprint", caption: "Automotive / Motion" },
      { id: "06", type: "video", src: "/work/06.mp4", poster: "/work/06_poster.jpg", title: "Forest Bridge", caption: "Exterior / Night" },
      { id: "07", type: "image", src: "/work/07.jpg", title: "Lobby Frame", caption: "Interior / Detail" },
      { id: "08", type: "video", src: "/work/08.mp4", poster: "/work/08_poster.jpg", title: "Ribbon Bridge", caption: "Aerial / Motion" },
      { id: "09", type: "image", src: "/work/09.jpg", title: "Brick Courtyard", caption: "Landscape / Still" },
      { id: "10", type: "image", src: "/work/10.jpg", title: "Pool Pavilion", caption: "Resort / Still" },
      { id: "11", type: "video", src: "/work/11.mp4", poster: "/work/11_poster.jpg", title: "Seaside Towers", caption: "Sunset Sequence" },
      { id: "12", type: "video", src: "/work/12.mp4", poster: "/work/12_poster.jpg", title: "Red Stadium", caption: "Competition / Concept" },
      { id: "13", type: "image", src: "/work/13.jpg", title: "Misty Pines", caption: "Nature / Motion" },
      { id: "14", type: "image", src: "/work/14.jpg", title: "Forest Road", caption: "Environment / Still" },
      { id: "15", type: "video", src: "/work/15.mp4", poster: "/work/15_poster.jpg", title: "Minimal Loft", caption: "Interior / Still" },
      { id: "16", type: "image", src: "/work/16.jpg", title: "Timber Curve", caption: "Architecture / Still" },
    ],
    []
  )

  /* 라이트박스: 현재 인덱스로 관리 */
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex == null ? null : items[activeIndex]

  const openAt = useCallback((idx: number) => setActiveIndex(idx), [])
  const close = useCallback(() => setActiveIndex(null), [])

  const goPrev = useCallback(() => {
    setActiveIndex((idx) => {
      if (idx == null) return idx
      return (idx - 1 + items.length) % items.length
    })
  }, [items.length])

  const goNext = useCallback(() => {
    setActiveIndex((idx) => {
      if (idx == null) return idx
      return (idx + 1) % items.length
    })
  }, [items.length])

  /* 간단 보안: 우클릭/드래그/일부 단축키 차단 */
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
      /* 라이트박스 열렸을 때 좌우 화살표 네비 */
      if (activeIndex != null) {
        if (e.key === "ArrowLeft") goPrev()
        if (e.key === "ArrowRight") goNext()
        if (e.key === "Escape") close()
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
  }, [activeIndex, close, goNext, goPrev])

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* 좌측 사이드바 */}
      <aside
        className={`fixed left-0 top-0 bottom-0 ${SIDEBAR_W} z-40 bg-black/95 border-r border-white/10 flex flex-col items-center select-none`}
      >
        {/* 로고 */}
        <Link href="/" className="mt-6 block" aria-label="Go to Home">
          <Image
            src="/logo.png"
            alt="NAIN"
            width={200}
            height={22}
            draggable={false}
            className="opacity-90 hover:opacity-100 transition"
          />
        </Link>

        {/* 네비 (로고 바로 아래) */}
        <nav
          className="w-full flex flex-col items-center text-xs md:text-sm tracking-wide"
          style={{ marginTop: NAV_OFFSET_PX, gap: NAV_GAP_PX }}
        >
          <Link href="/" className="text-white/70 hover:text-white">Home</Link>
          <Link href="/work" className="text-white/70 hover:text-white">Work</Link>
          <Link href="/contact" className="text-white/70 hover:text-white">Contact</Link>
        </nav>

        {/* 하단: SNS + 소개 */}
        <div className="w-full px-3 md:px-4 mt-auto mb-6">
          <div className="flex items-center gap-3 text-white/70 justify-start pl-1">
            <a
              href="https://www.instagram.com/nainstudio0210/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-white"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@Nainstudio-v5x"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-white"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-white/60 max-w-[11.5rem] pl-1">
            We are a creative visualization studio specializing in architectural imagery,
            animation, and realtime experiences.
          </p>
        </div>
      </aside>

      {/* 콘텐츠 그리드 (순서 고정) */}
      <main className="pl-32 md:pl-36">
        <div
          className="
            mx-auto max-w-[1700px]
            grid gap-3 md:gap-4
            grid-cols-2 md:grid-cols-6
            auto-rows-[120px] md:auto-rows-[170px] lg:auto-rows-[190px]
            p-3 md:p-6
          "
        >
          {items.map((item, i) => (
            <Tile
              key={item.id}
              item={item}
              span={item.span ?? spanFor(i)}
              onOpen={() => openAt(i)}
              priority={i < 6}
            />
          ))}
        </div>
      </main>

      {/* 라이트박스 */}
      <AnimatePresence>
        {active && activeIndex != null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="absolute inset-6 md:inset-10 lg:inset-14 rounded-xl overflow-hidden"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 미디어 */}
              {active.type === "image" ? (
                <Image
                  src={active.src}
                  alt={active.title}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="object-contain bg-black select-none"
                  priority
                />
              ) : (
                <video
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload noplaybackrate"
                  poster={active.poster}
                >
                  <source src={active.src} type="video/mp4" />
                </video>
              )}

              {/* 좌상단 타이틀(배경 없이 텍스트만) */}
              <div className="absolute left-4 top-4 text-white drop-shadow-sm">
                <div className="text-base md:text-lg font-medium">{active.title}</div>
                {active.caption && (
                  <div className="text-white/80 text-xs md:text-sm">{active.caption}</div>
                )}
              </div>

              {/* 오른쪽 상단 X 버튼 */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 grid place-items-center rounded-full bg-white/90 text-black hover:bg-white w-9 h-9"
                title="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* 좌우 네비게이션 화살표 */}
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Previous"
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/45 hover:bg-black/65 border border-white/20"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Next"
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/45 hover:bg-black/65 border border-white/20"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* 개별 타일 */
function Tile({
  item,
  span,
  onOpen,
  priority = false,
}: {
  item: MediaItem
  span: string
  onOpen: () => void
  priority?: boolean
}) {
  return (
    <div
      className={[
        "group relative cursor-pointer overflow-hidden rounded-md md:rounded-lg bg-zinc-900 select-none",
        "col-span-2 row-span-2",
        span,
      ].join(" ")}
      onClick={onOpen}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0">
        {item.type === "image" ? (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            draggable={false}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            {item.poster ? (
              <Image
                src={item.poster}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                draggable={false}
                className="object-cover"
                priority={priority}
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-800" />
            )}
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full bg-black/55 border border-white/30 p-3">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hover 텍스트 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-sm md:text-base font-medium">{item.title}</div>
        {item.caption && <div className="text-xs md:text-sm text-white/70">{item.caption}</div>}
      </div>
    </div>
  )
}
