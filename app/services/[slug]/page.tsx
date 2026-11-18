import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Instagram, Youtube, MessageCircle } from "lucide-react"
import SiteHeader from "../../components/home/SiteHeader"
import { SITE_URL } from "../../layout"
import { getService, services } from "../data"
import SampleVideo from "./SampleVideo"

// One template, four URLs. The copy that differs between the services lives in
// ../data.ts; nothing here is service-specific.

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  const url = `/services/${service.slug}`

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.metaTitle} | 나인스튜디오`,
      description: service.metaDescription,
      url,
      // A route's openGraph block replaces the layout's outright instead of
      // merging into it, so the share image has to be repeated here.
      images: ["/og-cover.jpg"],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const pageUrl = `${SITE_URL}/services/${service.slug}`

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: service.schemaName,
    description: service.schemaDescription,
    serviceType: service.schemaName,
    url: pageUrl,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "대한민국" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.label} 작업 범위`,
      itemListElement: service.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d.title, description: d.desc },
      })),
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: service.label, item: pageUrl },
    ],
  }

  // The FAQ answers are the ones rendered below, verbatim — Google drops rich
  // results when the markup and the visible text diverge.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-clip break-keep">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceLd, breadcrumbLd, faqLd]).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <SiteHeader />

      {/* ---------------- Hero ---------------- */}
      <section className="relative min-h-[88svh] flex items-end">
        <Image
          src={service.hero.src}
          alt={service.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          draggable={false}
        />
        {service.heroVideo && (
          <video
            src={service.heroVideo}
            poster={service.hero.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* The headline sits over whatever the hero happens to be — a bright
            daylight render included — so the scrim is heavy at the bottom. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

        <div className="relative w-full px-6 md:px-14 lg:px-16 pb-16 md:pb-24 pt-40">
          <span className="text-xs tracking-[0.2em] text-[#D9772B]">
            {service.eyebrow.toUpperCase()}
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.25] whitespace-pre-line">
            {service.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">
            {service.lead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="text-sm bg-white text-black px-6 py-3 hover:bg-white/85 transition-colors"
            >
              견적 문의하기
            </Link>
            <Link
              href="/work"
              className="text-sm border border-white/40 hover:border-white transition-colors px-6 py-3"
            >
              포트폴리오 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 이런 경우에 ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">WHEN</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          이런 경우에 필요합니다
        </h2>
        <ul className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {service.situations.map((text, i) => (
            <li key={text} className="bg-black p-8 md:p-10">
              <span className="text-xs tracking-[0.15em] text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- 작업 범위 ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">SCOPE</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          작업 범위
        </h2>
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {service.deliverables.map((d) => (
            <div key={d.title} className="bg-black p-8 md:p-10">
              <h3 className="text-xl md:text-[22px] font-normal">{d.title}</h3>
              <p className="mt-4 text-base text-white/60 leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 진행 방식 ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">PROCESS</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          진행 방식
        </h2>
        <ol className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10">
          {service.process.map((p) => (
            <li key={p.step} className="bg-black p-8 md:p-10 flex flex-col gap-4">
              <span className="text-xs tracking-[0.15em] text-white/40">
                {p.step}
              </span>
              <h3 className="text-xl md:text-[22px] font-normal">{p.title}</h3>
              <p className="text-base text-white/60 leading-relaxed">{p.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- 작업 사례 ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20">
          <div>
            <span className="text-xs tracking-[0.2em] text-[#D9772B]">WORK</span>
            <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
              작업 사례
            </h2>
          </div>
          <Link
            href="/work"
            className="text-sm border border-white/40 hover:border-white transition-colors px-5 py-2.5 self-start md:self-auto"
          >
            전체 포트폴리오
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {service.samples.map((s) =>
            s.youtubeId || s.video ? (
              <SampleVideo key={s.src} {...s} />
            ) : (
              <figure
                key={s.src}
                className="group relative aspect-video overflow-hidden bg-neutral-900"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {s.locked && (
                  <span className="absolute top-4 right-4 text-[10px] tracking-[0.18em] px-3 py-1.5 bg-[#e4dbcb] text-[#1f1b16]">
                    비공개
                  </span>
                )}
                <figcaption className="absolute bottom-4 left-4 text-sm">
                  {s.caption}
                </figcaption>
              </figure>
            ),
          )}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">FAQ</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          자주 묻는 질문
        </h2>
        <dl className="mt-14 md:mt-20 max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {service.faq.map((f) => (
            <div key={f.q} className="py-8">
              <dt className="text-lg md:text-xl font-normal">{f.q}</dt>
              <dd className="mt-3 text-base md:text-lg text-white/60 leading-relaxed">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- 다른 서비스 ---------------- */}
      <section className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">SERVICES</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          다른 서비스
        </h2>
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {services
            .filter((s) => s.slug !== service.slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="bg-black p-8 md:p-10 flex flex-col gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="text-xs tracking-[0.15em] text-white/40">
                  {s.eyebrow.toUpperCase()}
                </span>
                <h3 className="text-xl md:text-[22px] font-normal">{s.label}</h3>
                <p className="text-base text-white/60 leading-relaxed">
                  {s.metaDescription.split(".")[0]}.
                </p>
              </Link>
            ))}
        </div>
      </section>

      {/* ---------------- 문의 ---------------- */}
      {/* id="contact" so the fixed header's Contact link resolves on this page
          too — it is an in-page anchor, not a route. */}
      <section
        id="contact"
        className="py-20 md:py-28 px-6 md:px-14 lg:px-16 border-t border-white/10"
      >
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">CONTACT</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em]">
          {service.label}, 어떻게 시작할까요?
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/60">
          20년 경력의 디렉터가 첫 미팅부터 방향을 잡아드립니다.
          <br />
          간단한 브리핑만으로 견적과 일정 안내를 도와드립니다.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/#contact"
            className="text-sm bg-white text-black px-6 py-3 hover:bg-white/85 transition-colors"
          >
            문의 남기기
          </Link>
          <a
            href="tel:+821041123739"
            className="text-sm border border-white/40 hover:border-white transition-colors px-6 py-3"
          >
            010-4112-3739
          </a>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="py-16 bg-black text-white border-t border-white/10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8 items-center">
          <div className="pl-6 md:pl-14 lg:pl-25">
            <Link
              href="/"
              className="text-4xl md:text-6xl font-light tracking-[0.04em]"
            >
              NAIN STUDIO
            </Link>
          </div>

          <div className="flex md:justify-end gap-6 pr-12 md:pr-24 lg:pr-36">
            <a
              href="https://www.instagram.com/nainstudio0210/"
              target="_blank"
              className="inline-flex items-center gap-2 hover:opacity-80"
            >
              <Instagram className="w-6 h-6" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@Nainstudio-v5x"
              target="_blank"
              className="inline-flex items-center gap-2 hover:opacity-80"
            >
              <Youtube className="w-6 h-6" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
            <a
              href="https://pf.kakao.com/_hPAlX"
              target="_blank"
              className="inline-flex items-center gap-2 hover:opacity-80"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="hidden sm:inline">KakaoTalk</span>
            </a>
          </div>

          <div className="pl-6 md:pl-14 lg:pl-25 pr-6 md:pr-14 lg:pr-25 md:col-span-2">
            <p className="text-sm md:text-base leading-relaxed max-w-2xl opacity-70">
              Architecture Visualization Studio — 건축 시각화 · 애니메이션 · 리얼타임 경험
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
