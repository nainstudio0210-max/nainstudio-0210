import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const SITE_URL = "https://www.nainstudio.com";

// Service words lead, the studio name trails. Nobody looking to commission this
// work searches the studio by name yet — they search what they need made.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "건축 CG 렌더링·시네마틱 영상·VR 제작 | 나인스튜디오",
    template: "%s | 나인스튜디오",
  },
  description:
    "20년 경력의 건축 시각화 스튜디오. 건축 투시도와 조감도, 시네마틱 애니메이션, 리얼타임 VR 워크스루까지 완공 전 공간을 가장 설득력 있는 장면으로 제작합니다.",
  keywords: [
    "건축 CG",
    "건축 시각화",
    "건축 투시도",
    "건축 조감도",
    "건축 렌더링",
    "3D 렌더링 업체",
    "건축 애니메이션",
    "시네마틱 영상",
    "리얼타임 VR",
    "언리얼 건축 시각화",
    "분양 홍보 영상",
    "나인스튜디오",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "나인스튜디오",
    title: "건축 CG 렌더링·시네마틱 영상·VR 제작 | 나인스튜디오",
    description:
      "완공 전 공간을 가장 설득력 있는 장면으로. 건축 투시도, 시네마틱 애니메이션, 리얼타임 VR 제작.",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "나인스튜디오 건축 시각화 야경 렌더링",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "건축 CG 렌더링·시네마틱 영상·VR 제작 | 나인스튜디오",
    description:
      "완공 전 공간을 가장 설득력 있는 장면으로. 건축 투시도, 시네마틱 애니메이션, 리얼타임 VR 제작.",
    images: ["/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Tells search engines this is a specific local business rather than an
// anonymous site: who, where, reachable how, and offering what.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "나인스튜디오",
  legalName: "나인",
  alternateName: ["NAIN STUDIO", "나인 스튜디오"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo_2026.png`,
  image: `${SITE_URL}/og-cover.jpg`,
  description:
    "건축 이미지, 애니메이션, 리얼타임 경험을 전문으로 하는 건축 시각화 스튜디오입니다.",
  telephone: "+82-10-4112-3739",
  email: "nainstudio0210@naver.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "김포한강11로 312 2층 201호",
    addressLocality: "김포시",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  areaServed: { "@type": "Country", name: "대한민국" },
  knowsLanguage: ["ko", "en"],
  sameAs: [
    "https://www.instagram.com/nainstudio0210/",
    "https://www.youtube.com/@Nainstudio-v5x",
    "https://pf.kakao.com/_hPAlX",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "건축 시각화 서비스",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "건축 투시도·조감도 (스틸 이미지)",
          description: "설계 의도를 한 장의 이미지로 압축한 건축 CG 렌더링.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "건축 애니메이션·시네마틱 영상",
          description: "공간의 동선과 분위기를 담아내는 3D 건축 영상 제작.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "리얼타임 VR 워크스루",
          description:
            "언리얼 엔진 기반 실시간 워크스루로 완공 전 공간을 직접 걸어보는 인터랙티브 경험.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI 소셜 콘텐츠 패키지",
          description: "짧은 형식의 소셜 콘텐츠로 확장되는 비주얼 패키지.",
        },
      },
    ],
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "나인스튜디오",
  inLanguage: "ko-KR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Values here are all hardcoded above, but escaping `<` is still the
            correct habit: it keeps any future string from closing this tag. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationLd, websiteLd]).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        {children}
      </body>
    </html>
  );
}
