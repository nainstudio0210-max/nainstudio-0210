// app/contact/page.tsx
"use client"

import { useEffect, useState } from "react"

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false)

  // form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setOk(null)
    setErr(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      })

      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || "전송 실패")
      }

      setOk("메시지를 보냈습니다. 감사합니다.")
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (e: any) {
      setErr("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Header: Home / Work */}
      <header
        className={`fixed top-0 left-0 w-full z-30 transition-colors duration-500 ${
          scrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="w-full px-6 md:px-14 lg:px-16 py-8 flex items-center justify-between">
          {/* 왼쪽: Home */}
          <a href="/" className="text-sm md:text-base hover:text-gray-200">
            Home
          </a>

          {/* 오른쪽: Work */}
          <a href="/work" className="text-sm md:text-base hover:text-gray-200">
            Work
          </a>
        </nav>
      </header>

      {/* Content */}
      <main className="pt-36 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-14 lg:px-24">
          {/* 두 열 레이아웃 (레퍼런스 간격 맞춤) */}
          <div className="grid gap-14 lg:gap-24 items-start lg:grid-cols-[0.9fr_1.3fr]">
            {/* 왼쪽: 타이틀 + 소개/연락 정보 */}
            <section className="space-y-10">
              <h1 className="leading-none font-light text-[44px] md:text-7xl lg:text-8xl tracking-tight">
                <span className="block">Contact</span>
                <span className="block">us</span>
              </h1>

              <div className="space-y-5 text-gray-300 text-sm md:text-base">
                <p>
                  상담의 문은 항상 열려있습니다. 이메일을 주시면 친절하고 자세하게 답변드리겠습니다.
                </p>
                <p className="text-gray-400">경기 김포시 김포한강11로 312, 2층 201호</p>
                <p className="text-gray-400">nainstudio0210@gmail.com</p>
                <p className="text-gray-400">010-4112-3739</p>
              </div>
            </section>

            {/* 오른쪽: 폼 */}
            <section>
              <form onSubmit={onSubmit} className="space-y-10">
                {/* 1행: 이름 / 연락처 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-sm text-gray-400">이름</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="NAME"
                      className="w-full bg-transparent outline-none border-b border-neutral-700 focus:border-white transition-colors py-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm text-gray-400">연락처</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full bg-transparent outline-none border-b border-neutral-700 focus:border-white transition-colors py-2"
                    />
                  </div>
                </div>

                {/* 2행: 이메일 (전체 폭) */}
                <div className="space-y-3">
                  <label className="block text-sm text-gray-400">이메일 *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    inputMode="email"
                    className="w-full bg-transparent outline-none border-b border-neutral-700 focus:border-white transition-colors py-2"
                  />
                </div>

                {/* 3행: 메시지 (전체 폭) */}
                <div className="space-y-3">
                  <label className="block text-sm text-gray-400">문의내용을 남겨주세요</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="message here..."
                    rows={7}
                    className="w-full bg-transparent outline-none border-b border-neutral-700 focus:border-white transition-colors py-3 resize-y"
                  />
                </div>

                {/* 상태 메시지 */}
                {ok && <p className="text-emerald-400 text-sm">{ok}</p>}
                {err && <p className="text-red-400 text-sm">{err}</p>}

                {/* 버튼 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md border border-white/70 px-5 py-2 text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-60"
                >
                  {loading ? "전송 중..." : "발송"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
