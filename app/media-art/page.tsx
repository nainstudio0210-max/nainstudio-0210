import type { Metadata } from "next";
import MediaArtClient from "./MediaArtClient";

export const metadata: Metadata = {
  title: "미디어아트 — 공간 연출 영상",
  description:
    "나인스튜디오의 미디어아트 작업. 공간과 결합한 영상 연출과 몰입형 비주얼 콘텐츠 프로젝트를 소개합니다.",
  alternates: { canonical: "/media-art" },
  openGraph: {
    title: "미디어아트 — 공간 연출 영상 | 나인스튜디오",
    description:
      "공간과 결합한 영상 연출과 몰입형 비주얼 콘텐츠 프로젝트.",
    url: "/media-art",
    images: ["/og-cover.jpg"],
  },
};

export default function Page() {
  return <MediaArtClient />;
}
