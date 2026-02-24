"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { AnimatePresence, motion, Variants } from "framer-motion"
import { Instagram, Youtube, Play, ChevronLeft, ChevronRight, X as XIcon, Maximize, Layers, ZoomIn, Menu } from "lucide-react"

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

  // 1. 메인 팝업창 상태
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  
  // 2. 모바일 쿠팡 스타일 스와이프 상태
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  
  // 3. 우측 상단 드롭다운 메뉴 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 4. 스와이프 터치 좌표 기록
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const active = activeIndex == null ? null : items[activeIndex]

  // 모바일 스와이프용 배열 변환
  const flatGalleryItems = useMemo<GalleryContent[]>(() => {
    if (!active) return []
    if (active.type === 'gallery') {
      if (active.galleryContents) return active.galleryContents
      if (active.images) return active.images.map(img => ({ type: 'image', src: img }))
    }
    if (active.type === 'image') return [{ type: 'image', src: active.src }]
    if (active.type === 'youtube') return [{ type: 'youtube', youtubeId: active.youtubeId }]
    return []
  }, [active])

  // --- 메인 팝업 핸들러 ---
  const openAt = useCallback((idx: number) => {
    setActiveIndex(idx)
    setLightboxIndex(null)
  }, [])

  const close = useCallback(() => {
    setActiveIndex(null)
    setLightboxIndex(null)
  }, [])

  const goPrev = useCallback((e?: React.MouseEvent) => {
    if(e) e.stopPropagation()
    setActiveIndex((idx) => (idx == null ? null : (idx - 1 + items.length) % items.length))
  }, [items.length])

  const goNext = useCallback((e?: React.MouseEvent) => {
    if(e) e.stopPropagation()
    setActiveIndex((idx) => (idx == null ? null : (idx + 1) % items.length))
  }, [items.length])

  // --- 모바일 전용 Lightbox 스와이프 핸들러 ---
  const goLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null
      return prev > 0 ? prev - 1 : flatGalleryItems.length - 1
    })
  }, [flatGalleryItems.length])

  const goLightboxNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null
      return prev < flatGalleryItems.length - 1 ? prev + 1 : 0
    })
  }, [flatGalleryItems.length])

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goLightboxNext()
    } else if (isRightSwipe) {
      goLightboxPrev()
    }
    
    setTouchStartX(null)
    setTouchEndX(null)
  }

  // 키보드 조작 & 메뉴 바깥영역 클릭 시 닫기
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMenuOpen) setIsMenuOpen(false)
        else if (lightboxIndex !== null) setLightboxIndex(null)
        else if (activeIndex !== null) close()
      }
      if (e.key === "ArrowLeft") {
        if (lightboxIndex !== null) goLightboxPrev()
        else if (activeIndex !== null) goPrev()
      }
      if (e.key === "ArrowRight") {
        if (lightboxIndex !== null) goLightboxNext()
        else if (activeIndex !== null) goNext()
      }
    }
    
    document.addEventListener("contextmenu", prevent)
    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("contextmenu", prevent)
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeIndex, lightboxIndex, close, goNext, goPrev, goLightboxNext, goLightboxPrev, isMenuOpen])

  // 드롭다운 메뉴 애니메이션 설정 (주루룩 효과)
  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -15, scale: 0.97, transition: { duration: 0.2 } },
    visible: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { 
        duration: 0.3, ease: "easeOut",
        when: "beforeChildren", staggerChildren: 0.08 
      } 
    },
    exit: { opacity: 0, y: -15, scale: 0.97, transition: { duration: 0.2 } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      
      {/* ---------------- ★ 우측 상단 드롭다운 메뉴 (햄버거 아이콘 유지) ★ ---------------- */}
      <div className="fixed top-5 right-5 md:top-8 md:right-8 z-[200]" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center text-white/80 hover:text-white transition-colors focus:outline-none"
          aria-label="Open Menu"
        >
          {isMenuOpen ? (
            <XIcon className="w-7 h-7 md:w-8 md:h-8" />
          ) : (
            <Menu className="w-7 h-7 md:w-8 md:h-8" />
          )}
        </button>

        {/* 쪼르륵 내려오는 드롭다운 애니메이션 영역 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="absolute right-0 mt-3 w-44 md:w-52 bg-[#111] border border-white/10 rounded-lg shadow-2xl flex flex-col py-2 overflow-hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={itemVariants}>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 text-sm md:text-base text-white/70 hover:text-white hover:bg-white/10 transition-colors">Home</Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/work" onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 text-sm md:text-base text-white font-medium bg-white/10 transition-colors">Works</Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block px-5 py-3 text-sm md:text-base text-white/70 hover:text-white hover:bg-white/10 transition-colors">Contact</Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- 사이드바 ---------------- */}
      <aside className={`fixed left-0 top-0 bottom-0 ${SIDEBAR_W} z-40 bg-black/95 border-r border-white/10 flex flex-col items-center select-none`}>
        <Link href="/" className="mt-6 block" aria-label="Go to Home">
          <Image src="/logo.png" alt="NAIN" width={200} height={22} draggable={false} className="w-12 md:w-auto h-auto opacity-90 hover:opacity-100 transition" />
        </Link>
        
        {/* ★ 수정: 오리지널 디자인 복구 (얇은 폰트, 가운데 정렬, 원래 간격 유지) */}
        <nav
          className="w-full flex flex-col items-center text-[10px] md:text-sm tracking-wide"
          style={{ marginTop: NAV_OFFSET_PX + 12, gap: NAV_GAP_PX + 4 }}
        >
          <span className="text-white/70 mb-1">Works</span>
          
          <Link href="/work" className="text-white hover:text-white flex items-center justify-center gap-1.5">
            <div className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border-[1.5px] border-[#e85d22] bg-transparent" />
            <span className="font-light">Projects & Portfolio</span>
          </Link>
          
          <Link href="/media-art" className="text-white/50 hover:text-white flex items-center justify-center gap-1.5 group transition-colors">
            <div className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border-[1.5px] border-white/30 bg-transparent group-hover:border-[#e85d22] transition-colors" />
            <span className="font-light">Media Art</span>
          </Link>
        </nav>

        <div className="w-full px-1 md:px-4 mt-auto mb-4 md:mb-6 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 md:gap-3 text-white/70 justify-center md:justify-start pl-0 md:pl-2">
            <a href="https://www.instagram.com/nainstudio0210/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
            <a href="https://www.youtube.com/@Nainstudio-v5x" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white"><Youtube className="w-4 h-4 md:w-5 md:h-5" /></a>
          </div>
          <p className="mt-2 md:mt-3 text-[8px] md:text-[11px] leading-3 md:leading-5 text-white/50 md:text-white/60 text-center md:text-left md:max-w-[11.5rem] md:pl-2 break-keep px-1 md:px-0">
            We are a creative visualization studio specializing in architectural imagery, animation, and realtime experiences.
          </p>
        </div>
      </aside>

      {/* ---------------- 메인 프로젝트 타일 ---------------- */}
      <main className="pl-20 md:pl-36">
        <div className="mx-auto max-w-[1700px] grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-6 auto-rows-[120px] md:auto-rows-[170px] lg:auto-rows-[190px] p-3 md:p-6">
          {items.map((item, i) => (
            <Tile key={item.id} item={item} span={item.span} onOpen={() => openAt(i)} priority={i < 6} />
          ))}
        </div>
      </main>

      {/* ---------------- Layer 1: 메인 프로젝트 모달 ---------------- */}
      <AnimatePresence>
        {active && activeIndex != null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}
          >
            <motion.div
              className="relative w-[90%] h-[85%] md:w-[85%] md:h-[90%] rounded-xl overflow-hidden bg-zinc-900/50 shadow-2xl"
              initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center p-4 md:p-8">
                
                {active.type === "gallery" ? (
                  <div className="w-full flex flex-col items-center gap-6">
                    {flatGalleryItems.map((content, index) => (
                      <div 
                        key={index} 
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.innerWidth < 768 && content.type === 'image') {
                            setLightboxIndex(index)
                          }
                        }}
                        className="relative w-full max-w-5xl shadow-2xl bg-black md:cursor-default cursor-pointer"
                      >
                        {content.type === "youtube" ? (
                          <div className="w-full aspect-video">
                            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=0&controls=1`} allowFullScreen />
                          </div>
                        ) : (
                          <div className="relative w-full">
                            <Image
                              src={content.src || ""} alt={`Gallery Item ${index}`}
                              width={0} height={0} sizes="100vw"
                              className="w-full h-auto object-contain rounded-sm select-none"
                              style={{ WebkitTouchCallout: 'none' }} draggable={false} priority={index === 0}
                            />
                            <div className="absolute bottom-3 right-3 md:hidden bg-black/60 p-2 rounded-full pointer-events-none">
                              <ZoomIn className="w-5 h-5 text-white/90" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : active.type === "image" ? (
                  <div 
                    className="w-full h-full relative cursor-pointer md:cursor-default flex items-center justify-center p-4" 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 768) setLightboxIndex(0)
                    }}
                  >
                    <Image src={active.src || ''} alt={active.title} fill sizes="100vw" draggable={false} className="object-contain bg-black select-none p-2" style={{ WebkitTouchCallout: 'none' }} priority />
                    <div className="absolute bottom-6 right-6 md:hidden bg-black/60 p-3 rounded-full pointer-events-none">
                      <ZoomIn className="w-6 h-6 text-white/90" />
                    </div>
                  </div>
                ) : active.type === "youtube" ? (
                  <div className="w-full h-full bg-black">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&controls=1`} allowFullScreen />
                  </div>
                ) : null}
                <div className="h-20" />
              </div>

              <button onClick={close} className="absolute right-3 top-3 md:right-5 md:top-5 bg-black/40 hover:bg-white text-white hover:text-black p-2 md:p-2.5 rounded-full z-10 border border-white/20 transition-colors"><XIcon className="w-5 h-5" /></button>
              <button onClick={(e) => goPrev(e)} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-3 md:p-4 rounded-full z-10 border border-white/20 transition-colors"><ChevronLeft className="w-6 h-6 md:w-8 md:h-8" /></button>
              <button onClick={(e) => goNext(e)} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-3 md:p-4 rounded-full z-10 border border-white/20 transition-colors"><ChevronRight className="w-6 h-6 md:w-8 md:h-8" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Layer 2: 모바일 쿠팡 스타일 스와이프 뷰어 ---------------- */}
      <AnimatePresence>
        {lightboxIndex !== null && flatGalleryItems.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col md:hidden touch-none"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[110] bg-gradient-to-b from-black/80 to-transparent pt-8">
              <span className="text-white/90 font-semibold tracking-widest pl-2">
                {lightboxIndex + 1} <span className="text-white/50 text-sm">/ {flatGalleryItems.length}</span>
              </span>
              <button onClick={() => setLightboxIndex(null)} className="p-2 bg-white/10 rounded-full text-white">
                <XIcon size={24} />
              </button>
            </div>

            <div 
              className="w-full h-full relative flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {flatGalleryItems[lightboxIndex].type === "youtube" ? (
                <div className="w-full aspect-video">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${flatGalleryItems[lightboxIndex].youtubeId}?autoplay=1`} allowFullScreen />
                </div>
              ) : (
                <Image
                  src={flatGalleryItems[lightboxIndex].src || ""}
                  alt="Full Screen View"
                  fill
                  className="object-contain select-none"
                  draggable={false}
                  style={{ WebkitTouchCallout: 'none' }}
                  priority
                />
              )}
            </div>

            {flatGalleryItems.length > 1 && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-[110]">
                {flatGalleryItems.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === lightboxIndex ? 'bg-[#e85d22]' : 'bg-white/30'}`} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// ---------------- Tile 컴포넌트 ----------------
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