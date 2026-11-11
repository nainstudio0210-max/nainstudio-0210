"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

/** A sample tile that is a film: the poster until it is pressed, then the
 *  player in the same frame. Nothing is fetched from YouTube, and no byte of
 *  the local file is read, before that press. */
export default function SampleVideo({
  src,
  alt,
  caption,
  youtubeId,
  video,
}: {
  src: string
  alt: string
  caption: string
  youtubeId?: string
  video?: string
}) {
  const [on, setOn] = useState(false)

  return (
    <figure className="group relative aspect-video overflow-hidden bg-black">
      {on ? (
        youtubeId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0`}
            title={caption}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-contain"
            src={video}
            controls
            controlsList="nodownload"
            autoPlay
            loop
            playsInline
            onContextMenu={(e) => e.preventDefault()}
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          aria-label={`${caption} 재생`}
          className="absolute inset-0 w-full h-full cursor-pointer text-left"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-14 h-14 rounded-full border border-white/70 bg-black/35 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#D9772B] group-hover:border-[#D9772B]">
            <Play className="w-5 h-5 translate-x-[1px] fill-white text-white" />
          </span>
          <span className="absolute bottom-4 left-4 text-sm">{caption}</span>
        </button>
      )}
    </figure>
  )
}
