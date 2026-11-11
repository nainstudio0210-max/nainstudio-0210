/* The NAIN mark, drawn — not traced.
 *
 * The first version was an auto-trace of public/logo_2026.png: 62 filled
 * outlines that followed the PNG's anti-aliasing, so every edge came out
 * faceted once the mark was shown at any size. The mark is really seven
 * strokes of one weight with round ends, so that is what this is: an arc,
 * three letters' worth of lines and curves, and a ring. Geometry was fitted
 * over public/logo_01_PNG.png.
 *
 * Inline, not <img>, so the lines follow `currentColor`: the mark sits on
 * black in the header and on paper further down. The ring keeps the brand's
 * burnt orange either way. public/logo.svg is the same drawing as a file. */

export default function NainLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1800 1045"
      fill="none"
      stroke="currentColor"
      strokeWidth="25"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="NAIN STUDIO"
      className={className}
    >
      {/* the dome and its foot */}
      <path d="M45 712 A684 670 0 0 1 1413 712 H1185" />
      {/* the small n beside it, and its ring */}
      <path d="M1470 712 L1453 462 Q1640 530 1757 712 V605" />
      <circle cx="1438" cy="345" r="50" stroke="#9a4424" strokeWidth="30" />
      {/* N A I N */}
      <path d="M45 1005 V800 Q260 860 400 1000 V800" />
      <path d="M612 1005 V800 Q850 850 1030 1000 M612 900 H886" />
      <path d="M1188 800 V1005" />
      <path d="M1400 1005 V800 Q1615 860 1755 1000 V800" />
    </svg>
  )
}
