"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Instagram, Youtube, Play, ChevronLeft, ChevronRight, X as XIcon, Maximize, Layers, ZoomIn } from "lucide-react"

// 1. 갤러리/유튜브 혼합용 타입 정의
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
  // 모바일 사이드바 축소 (w-20), PC는 넓게 (w-36)
  const SIDEBAR_W = "w-20 md:w-36"
  const NAV_OFFSET_PX = 14
  const NAV_GAP_PX = 8

  // 3. 전체 데이터 리스트 (누락 없이 모두 포함)
  const items: MediaItem[] = useMemo(
    () => [
      { 
        id: "gold coast", 
        type: "gallery", 
        title: "Gold Coast", 
        caption: "Portfolio", 
        span: "md:col-span-4 md:row-span-2",
        poster: "/work/Gold Coast.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "48wFptFkamc" }, 
          { type: "image", src: "/work/Gold Coast.jpg" }, 
          { type: "image", src: "/work/Gold Coast_vp.jpg" } 
        ]
      },
      { 
        id: "coffeeworks", type: "gallery", title: "COFFEE@WORKS Project", caption: "Daejeon Time World Project", poster: "/work/COFFEE@WORKS_Daejeon Time World_SPC_01.jpg",
        span: "md:col-span-2 md:row-span-2",
        galleryContents: [
          { type: "image", src: "/work/COFFEE@WORKS_Daejeon Time World_SPC_01.jpg" }, 
          { type: "image", src: "/work/COFFEE@WORKS_Daejeon Time World_SPC_02.jpg" }, 
          { type: "image", src: "/work/COFFEE@WORKS_Daejeon Time World_SPC_03.jpg" }, 
          { type: "youtube", youtubeId: "IWqxiGE4Cl0" }, 
        ]
      },
      { 
        id: "ocean_road", type: "youtube", youtubeId: "499vvzQnqiE", poster: "/work/ocean_road_poster.jpg", title: "The Ocean Road", caption: "Portfolio",
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
      { 
        id: "04", type: "youtube", youtubeId: "plaDbIY6Q3A", poster: "/work/04_poster.jpg", title: "3D Visual Exploration", caption: "Portfolio",
        span: "md:col-span-4 md:row-span-2"
      },
      { 
        id: "Fallingwater", type: "youtube", youtubeId: "aqDyOVV1Twc", poster: "/work/05_poster.jpg", title: "Frank Lloyd Wright Fallingwater", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "vr01", type: "youtube", youtubeId: "a73C8n-lQlQ", poster: "/work/vr01_poster.jpg", title: "Nainstudio VR 360", caption: "Project / For the best experience, please watch in highest quality",
        span: "md:col-span-3 md:row-span-2"
      },
      { 
        id: "IFC02", 
        type: "gallery", 
        title: "Seoul Nightscape Drone View", 
        caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2",
        poster: "/work/Seoul Nightscape Drone View_poster.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "NAc1dDK-_U8" },
          { type: "image", src: "/work/IFC02_Train.jpg" },
          { type: "image", src: "/work/Yeouido_Train_VP.jpg" }
        ]
      },
      { 
        id: "IFC01", 
        type: "gallery", 
        title: "IFC Seoul Nightscape", 
        caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2",
        poster: "/work/IFC Seoul Nightscape_poster.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "PHz9ZO2t8zY" },
          { type: "image", src: "/work/IFC Seoul Nightscape_poster.jpg" },
          { type: "image", src: "/work/IFC01_vp.jpg" }
        ]
      },
      { 
        id: "Sheikh", type: "youtube", youtubeId: "_OTcL-5EqZo", poster: "/work/08_poster.jpg", title: "Sheikh Zayed Bridge Reference", caption: "Portfolio",
        span: "md:col-span-4 md:row-span-2"
      },
      { 
        id: "Splash Vol.1", type: "youtube", youtubeId: "n23M7AvNRDg", poster: "/work/11_poster.jpg", title: "Forest Splash Vol.1", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "Splash Vol.2", type: "youtube", youtubeId: "guC-rwfJ4bY", poster: "/work/12_poster.jpg", title: "Forest Splash Vol.2", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "Forest Glass Villa", 
        type: "gallery", 
        title: "Forest Glass Villa", 
        caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2",
        poster: "/work/Forest Glass Villa.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "YIG6xQn8Gok" },
          { type: "image", src: "/work/Forest Glass Villa.jpg" },
          { type: "image", src: "/work/Forest Glass Villa_vp.jpg" }
        ]
      },
      { 
        id: "Hannam01", 
        type: "gallery", 
        title: "SOYO Hannam Reference Vol.01", 
        caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2",
        poster: "/work/SOYO Hannam Reference_01.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "jkJiAkCQtvw" },
          { type: "image", src: "/work/SOYO Hannam Reference_01.jpg" },
          { type: "image", src: "/work/SOYO Hannam Reference_01_vp.jpg" }
        ]
      },
      { 
        id: "Hannam02", 
        type: "gallery", 
        title: "SOYO Hannam Reference Vol.02", 
        caption: "Portfolio",
        span: "md:col-span-3 md:row-span-2",
        poster: "/work/SOYO 02.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "CMAMGmCGLZo" },
          { type: "youtube", youtubeId: "nnpP5N0rQPM" },
          { type: "image", src: "/work/SOYO 02.jpg" },
          { type: "image", src: "/work/SOYO 02_vp.jpg" }
        ]
      },
      { 
        id: "Boulangerie", type: "gallery", title: "The Urban Boulangerie", caption: "Portfolio" , poster: "/work/Boulangerie.jpg", 
        span: "md:col-span-2 md:row-span-2",
        images: [ "/work/Boulangerie.jpg", "/work/Boulangerie_vp.jpg" ] 
      },
      { 
        id: "Mist Twist", 
        type: "gallery", 
        title: "Kistefos The Twist Reference", 
        caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2",
        poster: "/work/Mist Twist.jpg",
        galleryContents: [
          { type: "youtube", youtubeId: "A3995JcwZKE" },
          { type: "image", src: "/work/Mist Twist.jpg" },
          { type: "image", src: "/work/Mist Twist_vp.jpg" }
        ]
      },
      { 
        id: "14", type: "image", src: "/work/14.jpg", title: "A snowy forest path", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "15", type: "youtube", youtubeId: "OODmLCZ9bwo", poster: "/work/15_poster.jpg", title: "Misty Forest Retreat", caption: "Portfolio",
        span: "md:col-span-4 md:row-span-2"
      },
      { 
        id: "Concrete Facade", type: "youtube", youtubeId: "n23M7AvNRDg", poster: "/work/11_poster.jpg", title: "Concrete Facade", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
      { 
        id: "16", type: "image", src: "/work/16.jpg", title: "Industrial Loft Office", caption: "Portfolio",
        span: "md:col-span-2 md:row-span-2"
      },
    ],
    []
  )

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  
  // ★ 쿠팡 스타일 스와이프 뷰어를 위한 상태값들
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const active = activeIndex == null ? null : items[activeIndex]

  // 현재 열린 프로젝트의 이미지/영상 목록을 일렬로 모아두는 로직 (스와이프를 위해)
  const currentGalleryItems = useMemo<GalleryContent[]>(() => {
    if (!active) return []
    if (active.type === 'gallery') {
      return active.galleryContents ?? active.images?.map(src => ({ type: "image" as const, src })) ?? []
    }
    if (active.type === 'image' && active.src) return [{ type: 'image', src: active.src }]
    if (active.type === 'youtube' && active.youtubeId) return [{ type: 'youtube', youtubeId: active.youtubeId }]
    return []
  }, [active])

  const openAt = useCallback((idx: number) => {
    setActiveIndex(idx)
    setLightboxIndex(null) // 팝업 열 때 라이트박스 초기화
  }, [])

  const close = useCallback(() => {
    setActiveIndex(null)
    setLightboxIndex(null)
  }, [])

  // 메인 프로젝트 팝업 넘기기
  const goPrev = useCallback(() => {
    setActiveIndex((idx) => (idx == null ? null : (idx - 1 + items.length) % items.length))
    setLightboxIndex(null)
  }, [items.length])

  const goNext = useCallback(() => {
    setActiveIndex((idx) => (idx == null ? null : (idx + 1) % items.length))
    setLightboxIndex(null)
  }, [items.length])

  // 쿠팡 스타일 라이트박스 내부 사진 넘기기
  const prevLightbox = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev - 1 + currentGalleryItems.length) % currentGalleryItems.length : null)
  }, [currentGalleryItems.length])

  const nextLightbox = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev + 1) % currentGalleryItems.length : null)
  }, [currentGalleryItems.length])

  // 모바일 터치(스와이프) 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (diff > 50) nextLightbox() // 왼쪽으로 스와이프하면 다음 사진
    else if (diff < -50) prevLightbox() // 오른쪽으로 스와이프하면 이전 사진
    setTouchStartX(null)
  }

  // 키보드 방향키 조작 (PC)
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      if (k === "contextmenu" || (mod && (k === "s" || k === "p" || k === "u" || k === "i" || k === "j")) || k === "printscreen") {
        e.preventDefault()
        e.stopPropagation()
      }
      if (lightboxIndex !== null) {
        // 라이트박스가 열려있을 때는 사진을 넘김
        if (e.key === "ArrowLeft") prevLightbox()
        if (e.key === "ArrowRight") nextLightbox()
        if (e.key === "Escape") setLightboxIndex(null)
      } else if (activeIndex != null) {
        // 일반 프로젝트 창일 때는 프로젝트를 넘김
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
  }, [activeIndex, lightboxIndex, close, goNext, goPrev, nextLightbox, prevLightbox])

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* ---------------- 사이드바 영역 ---------------- */}
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
            className="w-12 md:w-auto h-auto opacity-90 hover:opacity-100 transition"
          />
        </Link>

        <nav
          className="w-full flex flex-col items-center text-[10px] md:text-sm tracking-wide"
          style={{ marginTop: NAV_OFFSET_PX, gap: NAV_GAP_PX }}
        >
          <Link href="/" className="text-white/70 hover:text-white">Home</Link>
          <Link href="/work" className="text-white/70 hover:text-white">Work</Link>
          <Link href="/contact" className="text-white/70 hover:text-white">Contact</Link>
        </nav>

        <div className="w-full px-1 md:px-4 mt-auto mb-4 md:mb-6 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 md:gap-3 text-white/70 justify-center md:justify-start pl-0 md:pl-1">
            <a href="https://www.instagram.com/nainstudio0210/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white">
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <a href="https://www.youtube.com/@Nainstudio-v5x" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white">
              <Youtube className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>

          <p className="mt-2 md:mt-3 text-[8px] md:text-[11px] leading-3 md:leading-5 text-white/50 md:text-white/60 text-center md:text-left md:max-w-[11.5rem] md:pl-1 break-keep px-1 md:px-0">
            We are a creative visualization studio specializing in architectural imagery,
            animation, and realtime experiences.
          </p>
        </div>
      </aside>

      {/* ---------------- 메인 타일 갤러리 영역 ---------------- */}
      <main className="pl-20 md:pl-36">
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

      {/* ---------------- 메인 프로젝트 팝업 모달 영역 ---------------- */}
      <AnimatePresence>
        {active && activeIndex != null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              // PC는 물론, 모바일에서도 여백이 있는 원래의 이쁜 창을 유지합니다.
              className="relative overflow-hidden w-[90%] h-[85%] md:w-[85%] md:h-[90%] rounded-xl bg-zinc-900/50 shadow-2xl"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} 
            >
              
              <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center">
                
                {/* 1. 갤러리 타입 처리 */}
                {active.type === "gallery" ? (
                  <div className="w-full flex flex-col items-center gap-6 p-4 md:p-8">
                    
                    {currentGalleryItems.map((content, index) => (
                      <div 
                        key={index} 
                        className="relative shadow-2xl bg-black cursor-pointer w-[95%] md:w-[80%] max-w-6xl transition-transform active:scale-[0.98]"
                        onClick={() => {
                          // ★ 모바일 화면(너비 768px 미만)일 때만 이미지를 누르면 쿠팡 스타일 스와이프 창이 열립니다! (PC는 영향 없음)
                          if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            setLightboxIndex(index)
                          }
                        }}
                      >
                        {content.type === "youtube" ? (
                          <div className="w-full aspect-video pointer-events-auto">
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=0&controls=1`}
                              title={`Gallery Video ${index}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="relative w-full">
                            <Image
                              src={content.src || ""}
                              alt={`${active.title} - ${index + 1}`}
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="w-full h-auto object-contain rounded-sm select-none"
                              style={{ WebkitTouchCallout: 'none' }}
                              draggable={false}
                              priority={index === 0}
                            />
                            {/* 모바일에서만 돋보기 아이콘 표시 (확대할 수 있다는 신호) */}
                            <div className="absolute bottom-3 right-3 md:hidden bg-black/60 p-2 rounded-full pointer-events-none">
                              <ZoomIn className="w-5 h-5 text-white/90" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="h-20" /> {/* 하단 여백 */}
                  </div>
                  
                ) : active.type === "image" ? (
                  
                  // 2. 단일 이미지 타입 처리
                  <div 
                    className="w-full h-full relative cursor-pointer" 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setLightboxIndex(0)
                      }
                    }}
                  >
                    <Image
                      src={active.src || ''}
                      alt={active.title}
                      fill
                      sizes="100vw"
                      draggable={false}
                      className="object-contain bg-black select-none p-4"
                      style={{ WebkitTouchCallout: 'none' }}
                      priority
                    />
                    <div className="absolute bottom-6 right-6 md:hidden bg-black/60 p-3 rounded-full pointer-events-none">
                      <ZoomIn className="w-6 h-6 text-white/90" />
                    </div>
                  </div>
                  
                ) : active.type === "youtube" ? (
                  
                  // 3. 단일 유튜브 타입 처리
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
                  
                  // 4. 일반 비디오 처리
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
              </div>

              {/* 메인 팝업 닫기 및 이동 버튼 */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 md:right-5 md:top-5 grid place-items-center rounded-full bg-black/40 hover:bg-white text-white hover:text-black border border-white/20 w-10 h-10 z-[60] transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 z-[60] transition-colors"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 z-[60] transition-colors"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- ★ 핵심: 쿠팡 스타일 모바일 전체화면 스와이프 뷰어 (Lightbox) ★ ---------------- */}
      <AnimatePresence>
        {lightboxIndex !== null && currentGalleryItems.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col md:hidden touch-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* 상단 컨트롤 바 */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[110] bg-gradient-to-b from-black/80 to-transparent">
              <span className="text-white/90 font-semibold tracking-wider px-2">
                {lightboxIndex + 1} <span className="text-white/50 text-xs">/ {currentGalleryItems.length}</span>
              </span>
              <button onClick={() => setLightboxIndex(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
                <XIcon size={24} />
              </button>
            </div>

            {/* 메인 이미지/영상 렌더링 영역 */}
            <div className="w-full h-full relative flex items-center justify-center">
              {currentGalleryItems[lightboxIndex].type === "youtube" ? (
                <div className="w-full aspect-video pointer-events-auto">
                  <iframe 
                    className="w-full h-full" 
                    src={`https://www.youtube.com/embed/${currentGalleryItems[lightboxIndex].youtubeId}?autoplay=1`} 
                    allowFullScreen 
                  />
                </div>
              ) : (
                <Image
                  src={currentGalleryItems[lightboxIndex].src || ""}
                  alt="Full Screen View"
                  fill
                  className="object-contain select-none"
                  draggable={false}
                  style={{ WebkitTouchCallout: 'none' }}
                  onContextMenu={(e) => e.preventDefault()}
                  priority
                />
              )}
            </div>
            
            {/* 하단 스와이프 안내 문구 */}
            {currentGalleryItems.length > 1 && (
              <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                <span className="text-white/50 text-xs bg-black/50 px-4 py-2 rounded-full">
                  좌우로 넘겨서 확인하세요
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// ---------------- Tile 컴포넌트 (메인 화면의 이미지 썸네일) ----------------
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
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] select-none"
            style={{ WebkitTouchCallout: 'none' }}
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
                className="object-cover select-none"
                style={{ WebkitTouchCallout: 'none' }}
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