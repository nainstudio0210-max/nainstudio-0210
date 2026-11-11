"use client"

/* Service icons, drawn in VectorCraft on a 48×48 grid and exported as SVG.
 * Inline rather than <img> so the ink follows `currentColor` — the run goes
 * from paper to an ink ground mid-way and the icons have to follow it. The
 * burnt orange stays fixed: it is the one accent, not a text colour.
 * Source document: .craft/service-icons.vectorcraft */

type Props = { className?: string }

const box = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": true,
} as const


export function AerialIcon({ className }: Props) {
  return (
    <svg {...box} className={className}>
      <path d="M4 44 C12 40 14 32 22 29 C30 26 38 20 44 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeMiterlimit="10" />
      <path d="M7 6 L19 6 C19.552 6 20 6.448 20 7 L20 15 C20 15.552 19.552 16 19 16 L7 16 C6.448 16 6 15.552 6 15 L6 7 C6 6.448 6.448 6 7 6 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M26 5 L35 5 C35.552 5 36 5.448 36 6 L36 19 C36 19.552 35.552 20 35 20 L26 20 C25.448 20 25 19.552 25 19 L25 6 C25 5.448 25.448 5 26 5 Z" fill="none" stroke="#9a4424" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M26 31 L41 31 C41.552 31 42 31.448 42 32 L42 40 C42 40.552 41.552 41 41 41 L26 41 C25.448 41 25 40.552 25 40 L25 32 C25 31.448 25.448 31 26 31 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export function PerspectiveIcon({ className }: Props) {
  return (
    <svg {...box} className={className}>
      <path d="M5.5 8 L42.5 8 C43.328 8 44 8.672 44 9.5 L44 38.5 C44 39.328 43.328 40 42.5 40 L5.5 40 C4.672 40 4 39.328 4 38.5 L4 9.5 C4 8.672 4.672 8 5.5 8 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 8 L17 19 M44 8 L31 19 M4 40 L17 30 M44 40 L31 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeMiterlimit="10" />
      <path d="M18 19 L30 19 C30.552 19 31 19.448 31 20 L31 29 C31 29.552 30.552 30 30 30 L18 30 C17.448 30 17 29.552 17 29 L17 20 C17 19.448 17.448 19 18 19 Z" fill="none" stroke="#9a4424" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function IsoIcon({ className }: Props) {
  return (
    <svg {...box} className={className}>
      <polygon points="24,6 39.6,15 24,24 8.4,15" fill="#9a4424" />
      <polygon points="24,6 39.6,15 39.6,33 24,42 8.4,33 8.4,15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 24 L24 42 M24 24 L8.4 15 M24 24 L39.6 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeMiterlimit="10" />
    </svg>
  )
}

export function CinematicIcon({ className }: Props) {
  return (
    <svg {...box} className={className}>
      <path d="M6 12 L42 12 C43.105 12 44 12.895 44 14 L44 34 C44 35.105 43.105 36 42 36 L6 36 C4.895 36 4 35.105 4 34 L4 14 C4 12.895 4.895 12 6 12 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="20,18 31,24 20,30" fill="#9a4424" />
      <path d="M6.5 16 L11.5 16 L11.5 21 L6.5 21 Z M6.5 26 L11.5 26 L11.5 31 L6.5 31 Z M36.5 16 L41.5 16 L41.5 21 L36.5 21 Z M36.5 26 L41.5 26 L41.5 31 L36.5 31 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function VrIcon({ className }: Props) {
  return (
    <svg {...box} className={className}>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeMiterlimit="10" />
      <ellipse cx="24" cy="24" rx="8" ry="16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeMiterlimit="10" />
      <ellipse cx="24" cy="24" rx="16" ry="5" fill="none" stroke="#9a4424" strokeWidth="1.5" strokeMiterlimit="10" />
    </svg>
  )
}

export function WebIcon({ className }: Props) {
  return (
    <svg {...box} className={className}>
      <path d="M6 8 L42 8 C43.105 8 44 8.895 44 10 L44 38 C44 39.105 43.105 40 42 40 L6 40 C4.895 40 4 39.105 4 38 L4 10 C4 8.895 4.895 8 6 8 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="4" y1="17" x2="44" y2="17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeMiterlimit="10" />
      <circle cx="9" cy="12.5" r="1.4" fill="#9a4424" />
      <circle cx="14" cy="12.5" r="1.4" fill="currentColor" />
      <circle cx="19" cy="12.5" r="1.4" fill="currentColor" />
      <path d="M10 25 L26 25 M10 31 L34 31" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeMiterlimit="10" />
    </svg>
  )
}


export const serviceIcons = {
  aerial: AerialIcon,
  perspective: PerspectiveIcon,
  iso: IsoIcon,
  cinematic: CinematicIcon,
  vr: VrIcon,
  web: WebIcon,
}
