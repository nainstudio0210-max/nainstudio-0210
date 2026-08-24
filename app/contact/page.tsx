import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "문의하기 — 건축 시각화 견적 상담",
  description:
    "건축 CG 렌더링, 애니메이션, VR 제작 문의. 간단한 브리핑만으로 견적과 일정을 안내해 드립니다. 경기 김포 소재, 20년 경력 디렉터와 함께하는 건축 시각화 스튜디오.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "문의하기 — 건축 시각화 견적 상담 | 나인스튜디오",
    description:
      "건축 CG 렌더링, 애니메이션, VR 제작 문의. 간단한 브리핑만으로 견적과 일정을 안내해 드립니다.",
    url: "/contact",
    images: ["/og-cover.jpg"],
  },
};

export default function Page() {
  return <ContactClient />;
}
