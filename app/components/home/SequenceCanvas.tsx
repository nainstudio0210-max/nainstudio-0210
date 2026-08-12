"use client"

import { useEffect, useRef } from "react"
import { MotionValue, useMotionValueEvent } from "framer-motion"

type SequenceCanvasProps = {
  frameCount: number
  frameSrc: (index: number) => string
  progress: MotionValue<number>
  /**
   * "cover"  — fill the canvas, cropping overflow (use when the source matches
   *            the viewport orientation; gives a full-bleed cinematic look).
   * "letterbox" — fit the whole frame inside, with a blurred copy behind to
   *            fill the gaps (only for source whose aspect differs wildly).
   */
  fit?: "cover" | "letterbox"
  /**
   * Load every Nth frame first, then backfill the rest. With a few hundred
   * frames, firing every request at once stalls the whole sequence behind a
   * queue; a coarse pass makes the scrub usable almost immediately and
   * `nearestReady` covers the gaps until the fill-in lands.
   */
  step?: number
  className?: string
}

export default function SequenceCanvas({
  frameCount,
  frameSrc,
  progress,
  fit = "cover",
  step = 4,
  className = "",
}: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentPosRef = useRef(0)

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(frameCount).fill(null)
    imagesRef.current = images
    let cancelled = false

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (cancelled || images[i]) return resolve()
        const img = new Image()
        img.decoding = "async"
        img.onload = () => {
          images[i] = img
          // Any frame landing may be the best one to show right now.
          drawAt(currentPosRef.current)
          resolve()
        }
        img.onerror = () => resolve()
        img.src = frameSrc(i)
      })

    const coarse: number[] = []
    for (let i = 0; i < frameCount; i += step) coarse.push(i)
    if (coarse[coarse.length - 1] !== frameCount - 1) coarse.push(frameCount - 1)

    load(coarse[0])
      .then(() => Promise.all(coarse.map(load)))
      .then(() => {
        if (cancelled) return
        const rest = []
        for (let i = 0; i < frameCount; i++) if (!images[i]) rest.push(i)
        return Promise.all(rest.map(load)).then(() => undefined)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, step])

  // The canvas can be measured at 0x0 immediately after mount, before layout
  // settles; that draw would silently no-op and nothing would repaint it since
  // scroll is the only other trigger. ResizeObserver covers that and any later
  // viewport change.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => drawAt(currentPosRef.current))
    observer.observe(canvas)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function isReady(img: HTMLImageElement | undefined): img is HTMLImageElement {
    return !!img && img.complete && img.naturalWidth > 0
  }

  /** Nearest loaded frame to `idx`, searching outward — never returns a blank. */
  function nearestReady(idx: number): HTMLImageElement | null {
    const images = imagesRef.current
    if (isReady(images[idx])) return images[idx]
    for (let d = 1; d < frameCount; d++) {
      if (isReady(images[idx - d])) return images[idx - d]
      if (isReady(images[idx + d])) return images[idx + d]
    }
    return null
  }

  function paint(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number,
    alpha: number
  ) {
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    ctx.globalAlpha = alpha

    if (fit === "letterbox") {
      const coverScale = Math.max(w / iw, h / ih) * 1.15
      ctx.save()
      ctx.filter = "blur(38px) brightness(0.5)"
      ctx.drawImage(img, (w - iw * coverScale) / 2, (h - ih * coverScale) / 2, iw * coverScale, ih * coverScale)
      ctx.restore()
      const s = Math.min(w / iw, h / ih)
      ctx.drawImage(img, (w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s)
    } else {
      const s = Math.max(w / iw, h / ih)
      ctx.drawImage(img, (w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s)
    }

    ctx.globalAlpha = 1
  }

  /**
   * Draws a fractional frame position (e.g. 12.4) by cross-dissolving the two
   * neighbouring frames, so scrubbing reads as continuous motion rather than
   * stepping frame to frame.
   */
  function drawAt(pos: number) {
    const canvas = canvasRef.current
    if (!canvas) return

    const clamped = Math.min(frameCount - 1, Math.max(0, pos))
    const i0 = Math.floor(clamped)
    const frac = clamped - i0

    const img0 = nearestReady(i0)
    if (!img0) return
    const img1 = frac > 0.01 ? nearestReady(Math.min(frameCount - 1, i0 + 1)) : null

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w === 0 || h === 0) return
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    paint(ctx, img0, w, h, 1)
    if (img1 && img1 !== img0) paint(ctx, img1, w, h, frac)
  }

  useMotionValueEvent(progress, "change", (v) => {
    const pos = Math.min(frameCount - 1, Math.max(0, v * (frameCount - 1)))
    currentPosRef.current = pos
    drawAt(pos)
  })

  return <canvas ref={canvasRef} className={className} />
}
