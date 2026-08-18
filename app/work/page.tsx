import type { Metadata } from "next";
import WorkClient from "./WorkClient";

// A thin server shell purely so this route can carry its own metadata — the
// gallery below it stays a client component, untouched.
export const metadata: Metadata = {
  title: "포트폴리오 — 건축 CG·애니메이션·VR 프로젝트",
  description:
    "나인스튜디오가 작업한 건축 투시도, 조감도, 시네마틱 애니메이션, 리얼타임 VR 프로젝트를 모았습니다. 국내외 주거·상업·호텔 프로젝트 포트폴리오.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "포트폴리오 — 건축 CG·애니메이션·VR 프로젝트 | 나인스튜디오",
    description:
      "건축 투시도, 조감도, 시네마틱 애니메이션, 리얼타임 VR 프로젝트 포트폴리오.",
    url: "/work",
    // Declaring openGraph on a route replaces the layout's block outright
    // rather than merging into it, so the share image has to be repeated.
    images: ["/og-cover.jpg"],
  },
};

export default function Page() {
  return <WorkClient />;
}
