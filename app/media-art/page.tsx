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

export default function MediaArtPage() {
  // 대표님이 직접 세팅하신 완벽한 비율 유지 (w-40)
  const SIDEBAR_W = "w-20 md:w-40"
  const NAV_OFFSET_PX = 14
  const NAV_GAP_PX = 8

  // 3. 미디어 아트 데이터 리스트 (여기에 새로운 미디어 아트 영상들을 추가하시면 됩니다!)
  const items: MediaItem[] = useMemo(
    () => [
      { 
        id: "media_art_01", 
        type: "youtube", 
        youtubeId: "HDqSteAYnaE", // ★ 유튜브 아이디 부분
        poster: "/work/Media Art01.jpg", // ★ 썸네일 이미지 경로
        title: "Media Art Project 01", 
        caption: "Media Art",
        span: "md:col-span-4 md:row-span-2"
      },
     { 
        id: "media_art_02", 
        type: "youtube", 
        youtubeId: "rJPs07WfYEQ", // ★ 유튜브 아이디 부분
        poster: "/work/Media Art02.jpg", // ★ 썸네일 이미지 경로
        title: "Media Art Project 02", 
        caption: "Media Art",
        span: "md:col-span-2 md:row-span-2"
      },
     { 
        id: "media_art_03", 
        type: "youtube", 
        youtubeId: "Kx-CE1LrASg", // ★ 유튜브 아이디 부분
        poster: "/work/Media Art03.jpg", // ★ 썸네일 이미지 경로
        title: "Media Art Project 03", 
        caption: "Media Art",
        span: "md:col-span-3 md:row-span-2"
      },
     { 
        id: "media_art_03", 
        type: "youtube", 
        youtubeId: "Kx-CE1LrASg", // ★ 유튜브 아이디 부분
        poster: "/work/Media Art03.jpg", // ★ 썸네일 이미지 경로
        title: "Media Art Project 03", 
        caption: "Media Art",
        span: "md:col-span-3 md:row-span-2"
      }

      // 새로운 미디어 아트 영상이 생기면 이 아래로 계속 추가하시면 됩니다.
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

  // 드롭다운 메뉴 애니메이션 설정
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
      
      {/* ---------------- 우측 상단 드롭다운 메뉴 ---------------- */}
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
        
        {/* 로고 영역 */}
        <Link href="/" className="mt-6 block" aria-label="Go to Home">
          <Image src="/logo.png" alt="NAIN" width={200} height={22} draggable={false} className="w-12 md:w-auto h-auto opacity-90 hover:opacity-100 transition" />
        </Link>
        
        {/* 네비게이션 메뉴 영역 */}
        <nav className="w-full flex flex-col text-[10px] md:text-sm tracking-wide mt-4 md:mt-5">
          
          {/* 얇고 희미한 구분선 */}
          <div className="w-[60%] mx-auto border-t border-white/10 mb-3 md:mb-4" />

          {/* 하단 메뉴: Works 타이틀(가운데 정렬) 및 하위 메뉴(왼쪽 정렬 그룹) */}
          <div className="flex flex-col items-center w-full">
            
            {/* Works 텍스트 */}
            <span className="text-white font-medium mb-3 md:mb-4">Works</span>
            
            {/* 하위 메뉴 리스트 */}
            <div className="flex flex-col items-start gap-2.5 md:gap-3 pl-6 md:pl-10">
              {/* ★ 수정: 미디어 아트 페이지이므로 Projects & Portfolio를 비활성화 (회색 얇은 선) 상태로 변경 */}
              <Link href="/work" className="text-white/50 hover:text-white flex items-center gap-2 group transition-colors">
                <div className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border-[1.5px] border-white/30 bg-transparent group-hover:border-[#e85d22] transition-colors" />
                <span className="font-light group-hover:opacity-80 transition-opacity">Projects<br className="md:hidden"/> & Portfolio</span>
              </Link>
              
              {/* ★ 수정: 미디어 아트 페이지이므로 Media Art를 활성화 (주황색 굵은 선) 상태로 변경 */}
              <Link href="/media-art" className="text-white hover:text-white flex items-center gap-2 group">
                <div className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border-[1.5px] border-[#e85d22] bg-transparent" />
                <span className="font-light leading-snug">Media Art</span>
              </Link>
            </div>

          </div>
        </nav>

        {/* 하단 푸터 영역 */}
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
      {/* 대표님이 직접 수정하신 pl-40 완벽 적용 */}
      <main className="pl-20 md:pl-40">
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