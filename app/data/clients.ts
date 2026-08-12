export type Client = {
  /** Displayed as a wordmark when `logo` is absent, and used as the img alt. */
  name: string
  /** Path under /public, e.g. "/clients/posco-enc.png". */
  logo?: string
  /**
   * Every mark renders at the same 48px row height, but blocky all-caps
   * logotypes (little internal whitespace, thick strokes edge-to-edge) read
   * visually louder than script or mixed-case marks at that same height.
   * Scale those down to balance the row; omit for anything that already
   * reads at the right weight.
   */
  scale?: number
}

// Ordered by profile — contractor ranking, then brand recognition, then project
// scale. Each mark is trimmed to its ink and keyed to white on transparency so
// the row reads as one set rather than a strip of mismatched boxes.
export const clients: Client[] = [
  { name: "포스코이앤씨", logo: "/clients/posco-enc.png" },
  { name: "롯데건설", logo: "/clients/lottecon.png" },
  { name: "롯데건설 르엘", logo: "/clients/lotte-leel.png" },
  { name: "그랜드 조선", logo: "/clients/grandjosun.png" },
  { name: "IFC Seoul", logo: "/clients/ifc-seoul.png" },
  { name: "워커힐", logo: "/clients/walkerhill.png" },
  { name: "명월관", logo: "/clients/myongwolgwan.png" },
  { name: "잭니클라우스 골프클럽 코리아", logo: "/clients/jack-nicklaus.png" },
  { name: "해안건축", logo: "/clients/haeahn.png" },
  { name: "간삼건축", logo: "/clients/gansam.png" },
  { name: "BYREDO", logo: "/clients/byredo.png" },
  { name: "Kappa", logo: "/clients/kappa.png" },
  { name: "파스꾸찌", logo: "/clients/pascucci.png", scale: 0.72 },
]
