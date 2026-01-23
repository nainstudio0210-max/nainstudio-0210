"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Instagram, Youtube, Play, ChevronLeft, ChevronRight, X as XIcon, Maximize, Layers } from "lucide-react"

// 1. 타입 정의: gallery와 images 추가
type MediaItem = {
  id: string
  type: "image" | "video" | "youtube" | "gallery"
  src?: string
  images?: string[] // 갤러리용 이미지 배열
  youtubeId?: string
  title: string
  caption?: string
  poster?: string
  span?: string
}

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
  const SIDEBAR_W = "w-32 md:w-36"
  const NAV_OFFSET_PX = 14
  const NAV_GAP_PX = 8

  const items: MediaItem[] = useMemo(
    () => [
      // ▼ [NEW] Shake Shake 갤러리 (17장)
      { 
        id: "shake01", 
        type: "gallery", 
        title: "Shake Shake Project", 
        caption: "Multiple Images / Gallery",
        poster: "/work/Shake Shake_01.jpg", // 목록에서 보일 대표 이미지
        images: [
          "/work/Shake Shake_01.jpg",
          "/work/Shake Shake_02.png", // 2번은 png
          "/work/Shake Shake_03.jpg",
          "/work/Shake Shake_04.jpg",
          "/work/Shake Shake_05.jpg",
          "/work/Shake Shake_06.jpg",
          "/work/Shake Shake_07.jpg",
          "/work/Shake Shake_08.jpg",
          "/work/Shake Shake_09.jpg",
          "/work/Shake Shake_10.jpg",
          "/work/Shake Shake_11.jpg",
          "/work/Shake Shake_12.jpg",
          "/work/Shake Shake_13.jpg",
          "/work/Shake Shake_14.jpg",
          "/work/Shake Shake_15.jpg",
          "/work/Shake Shake_16.jpg",
          "/work/Shake Shake_17.jpg",
        ]
      },
      // ▼ 기존 아이템들
      { id: "01", type: "video", src: "/work/01.mp4", poster: "/work/01_poster.jpg", title: "High-rise Above the Clouds", caption: "Exterior visualization / Concept" },
      { id: "02", type: "image", src: "/work/02.jpg", title: "Arcade of Umbrellas", caption: "Commercial / Garden" },
      { id: "03", type: "video", src: "/work/03.mp4", poster: "/work/03_poster.jpg", title: "Fabric Facade", caption: "Detail / Motion" },
      { id: "04", type: "video", src: "/work/04.mp4", poster: "/work/04_poster.jpg", title: "Board & Pieces", caption: "Lifestyle / Motion" },
      { id: "05", type: "video", src: "/work/05.mp4", poster: "/work/05_poster.jpg", title: "Yellow Sprint", caption: "Automotive / Motion" },
      { id: "vr01", type: "youtube", youtubeId: "a73C8n-lQlQ", poster: "/work/vr01_poster.jpg", title: "", caption: "360° Virtual Reality / Experience" },
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
      <aside
        className={`fixed left-0 top-0 bottom-0 ${SIDEBAR_W} z-40 bg-black/95 border-r border-white/10 flex flex-col items-center select-none`}
      >
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

        <nav
          className="w-full flex flex-col items-center text-xs md:text-sm tracking-wide"
          style={{ marginTop: NAV_OFFSET_PX, gap: NAV_GAP_PX }}
        >
          <Link href="/" className="text-white/70 hover:text-white">Home</Link>
          <Link href="/work" className="text-white/70 hover:text-white">Work</Link>
          <Link href="/contact" className="text-white/70 hover:text-white">Contact</Link>
        </nav>

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
              className="absolute inset-6 md:inset-10 lg:inset-14 rounded-xl overflow-hidden bg-zinc-900/50"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ▼ 2. 갤러리 뷰어 로직 (새로 추가됨) */}
              {active.type === "gallery" ? (
                <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center gap-4 p-4 md:p-8">
                  {active.images?.map((img, index) => (
                    <div key={index} className="relative w-full max-w-5xl shadow-2xl">
                      <Image
                        src={img}
                        alt={`${active.title} - ${index + 1}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain rounded-sm"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                  {/* 하단 여백 */}
                  <div className="h-20" />
                </div>
              ) : active.type === "image" ? (
                <Image
                  src={active.src || ''}
                  alt={active.title}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="object-contain bg-black select-none"
                  priority
                />
              ) : active.type === "youtube" ? (
                <div className="w-full h-full bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&controls=1`}
                    title={active.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload noplaybackrate"
                  poster={active.poster}
                >
                  <source src={active.src || ''} type="video/mp4" />
                </video>
              )}

              <div className="absolute left-4 top-4 text-white drop-shadow-sm z-10 pointer-events-none">
                <div className="text-base md:text-lg font-medium">{active.title}</div>
                {active.caption && (
                  <div className="text-white/80 text-xs md:text-sm">{active.caption}</div>
                )}
              </div>

              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 grid place-items-center rounded-full bg-white/90 text-black hover:bg-white w-9 h-9 z-20"
                title="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Previous"
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/45 hover:bg-black/65 border border-white/20 z-20"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Next"
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/45 hover:bg-black/65 border border-white/20 z-20"
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
        {/* ▼ 3. Tile 렌더링 수정: gallery도 이미지를 보여주도록 설정 */}
        {item.type === "image" || item.type === "gallery" ? (
          <Image
            src={item.poster || item.images?.[0] || item.src || ''}
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
                {item.type === "youtube" ? (
                  <Maximize className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-sm md:text-base font-medium flex items-center gap-2">
            {item.title}
            {item.type === "gallery" && <Layers className="w-3 h-3 text-white/70" />}
        </div>
        {item.caption && <div className="text-xs md:text-sm text-white/70">{item.caption}</div>}
      </div>
    </div>
  )
}