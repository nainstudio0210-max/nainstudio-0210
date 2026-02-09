"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Instagram, Youtube, Play, ChevronLeft, ChevronRight, X as XIcon, Maximize, Layers } from "lucide-react"

// 1. 갤러리/유튜브 혼합용 타입
type GalleryContent = {
  type: "image" | "youtube"
  src?: string       
  youtubeId?: string 
}

// 2. MediaItem 타입 정의
type MediaItem = {
  id: string
  type: "image" | "video" | "youtube" | "gallery"
  src?: string
  images?: string[] 
  galleryContents?: GalleryContent[]
  youtubeId?: string
  title: string
  caption?: string
  poster?: string
  span: string 
}

export default function WorkPage() {
  const SIDEBAR_W = "w-32 md:w-36"
  const NAV_OFFSET_PX = 14
  const NAV_GAP_PX = 8

  const items: MediaItem[] = useMemo(
    () => [
      // [Row 1] 3칸 + 3칸 (반반)
      { 
        id: "ocean_road", type: "youtube", youtubeId: "OInCCgrO4pA", poster: "/work/ocean_road_poster.jpg", title: "The Ocean Road", caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2" 
      },
      { 
        id: "shake01", type: "gallery", title: "Shake Shake Project", caption: "Singapore Project", poster: "/work/Shake Shake_01.jpg",
        span: "md:col-span-3 md:row-span-2",
        images: [
          "/work/Shake Shake_01.jpg", "/work/Shake Shake_02.png", "/work/Shake Shake_03.jpg", "/work/Shake Shake_04.jpg",
          "/work/Shake Shake_05.jpg", "/work/Shake Shake_06.jpg", "/work/Shake Shake_07.jpg", "/work/Shake Shake_08.jpg",
          "/work/Shake Shake_09.jpg", "/work/Shake Shake_10.jpg", "/work/Shake Shake_11.jpg", "/work/Shake Shake_12.jpg",
          "/work/Shake Shake_13.jpg", "/work/Shake Shake_14.jpg", "/work/Shake Shake_15.jpg", "/work/Shake Shake_16.jpg",
          "/work/Shake Shake_17.jpg",
        ]
      },

      // [Row 2] 2칸 + 2칸 + 2칸 (3등분)
      { 
        id: "01", type: "youtube", youtubeId: "8TDOIKj7Ebw", poster: "/work/01_poster.jpg", title: "3D dandelion animation", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "02", type: "image", src: "/work/02.jpg", title: "Umbrella Atrium", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "Byredo", type: "youtube", youtubeId: "q5WxmdEaxJY", poster: "/work/03_poster.jpg", title: "Byredo: Elemental Essence", caption: "Project",
        span: "md:col-span-2 md:row-span-2"
      },

      // [Row 3] 4칸 + 2칸 (넓은 것 + 좁은 것)
      { 
        id: "04", type: "youtube", youtubeId: "plaDbIY6Q3A", poster: "/work/04_poster.jpg", title: "3D Visual Exploration", caption: "Portfolio",
        span: "md:col-span-4 md:row-span-2"
      },
      { 
        id: "05", type: "youtube", youtubeId: "NbcLyvo1MV0", poster: "/work/05_poster.jpg", title: "Frank Lloyd Wright Fallingwater", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },

      // [Row 4] 3칸 + 3칸 (반반)
      { 
        id: "vr01", type: "youtube", youtubeId: "a73C8n-lQlQ", poster: "/work/vr01_poster.jpg", title: "Nainstudio VR 360", caption: "Project / For the best experience, please watch in highest quality",
        span: "md:col-span-3 md:row-span-2"
      },
      
      // ▼▼▼ 여기가 문제였던 부분! 완벽하게 고쳤습니다 ▼▼▼
      { 
        id: "IFC02", 
        type: "gallery", 
        title: "Seoul Nightscape Drone View", 
        caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2",
        poster: "/work/Seoul Nightscape Drone View_poster.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "Hgnd9kO2DTw" },
          { type: "image", src: "/work/IFC02_Train.jpg" },
          { type: "image", src: "/work/IFC02_Train_VP.jpg" }
        ]
      },
      // ▲▲▲ 괄호와 콤마를 정확하게 닫았습니다 ▲▲▲

      // [Row 5] 2칸 + 4칸 (좁은 것 + 넓은 것)
      { 
        id: "IFC01", type: "youtube", youtubeId: "LRPn_SX0i-I", poster: "/work/IFC Seoul Nightscape_poster.jpg", title: "IFC Seoul Nightscape", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "Sheikh", type: "youtube", youtubeId: "_OTcL-5EqZo", poster: "/work/08_poster.jpg", title: "Sheikh Zayed Bridge Reference", caption: "Portfolio",
        span: "md:col-span-4 md:row-span-2"
      },

      // [Row 6] 2칸 + 2칸 + 2칸 (3등분)
      { 
        id: "Splash Vol.1", type: "youtube", youtubeId: "n23M7AvNRDg", poster: "/work/11_poster.jpg", title: "Forest Splash Vol.1", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "Splash Vol.2", type: "youtube", youtubeId: "guC-rwfJ4bY", poster: "/work/12_poster.jpg", title: "Forest Splash Vol.2", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "Glass Villa", type: "youtube", youtubeId: "A7LAPEA3X3o", poster: "/work/06_poster.jpg", title: "Forest Glass Villa", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },

      // [Row 7] 3칸 + 3칸 (패턴 반복 시작)
      { 
        id: "Hannam01", type: "youtube", youtubeId: "fzvrlfouD54", poster: "/work/SOYO Hannam Reference_poster.jpg", title: "SOYO Hannam Reference", caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2"
      },
      { 
        id: "Hannam02", type: "image", src: "/work/10.jpg", title: "SOYO Hannam Reference", caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2"
      },

      // [Row 8] 2칸 + 2칸 + 2칸
      { 
        id: "Boulangerie", type: "gallery", title: "The Urban Boulangerie", caption: "Portfolio" , poster: "/work/07.jpg", 
        span: "md:col-span-2 md:row-span-2",
        images: [ "/work/07.jpg" ] 
      },
      { 
        id: "13", type: "image", src: "/work/13.jpg", title: "Kistefos The Twist Reference", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "14", type: "image", src: "/work/14.jpg", title: "A snowy forest path", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },

      // [Row 9] 4칸 + 2칸
      { 
        id: "15", type: "youtube", youtubeId: "OODmLCZ9bwo", poster: "/work/15_poster.jpg", title: "Misty Forest Retreat", caption: "Portfolio",
        span: "md:col-span-4 md:row-span-2"
      },
      { 
        id: "16", type: "image", src: "/work/16.jpg", title: "Industrial Loft Office", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
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
              span={item.span} 
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
              {active.type === "gallery" ? (
                <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center gap-4 p-2 md:p-4">
                  {(active.galleryContents ?? active.images?.map(img => ({ type: "image" as const, src: img })) ?? []).map((content, index) => (
                    <div key={index} className="relative w-full shadow-2xl bg-black">
                      {content.type === "youtube" ? (
                        <div className="w-full aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=0&controls=1`}
                            title={`Gallery Video ${index}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <Image
                          src={content.src || ""}
                          alt={`${active.title} - ${index + 1}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-auto object-contain rounded-sm"
                          priority={index === 0}
                        />
                      )}
                    </div>
                  ))}
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
  const posterSrc = item.poster || 
                    (item.galleryContents && item.galleryContents.find(c => c.type === "image")?.src) || 
                    (item.images && item.images[0]) || 
                    item.src || 
                    '';

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
        {(item.type === "image" || item.type === "gallery") && posterSrc ? (
          <Image
            src={posterSrc}
            alt={item.title || ""}
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
                alt={item.title || ""}
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

      {(item.title || item.caption) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.title && (
              <div className="text-sm md:text-base font-medium flex items-center gap-2">
                {item.title}
                {item.type === "gallery" && <Layers className="w-3 h-3 text-white/70" />}
              </div>
            )}
            {item.caption && <div className="text-xs md:text-sm text-white/70">{item.caption}</div>}
          </div>
        </>
      )}
    </div>
  )
}