"use client"

import { useState } from "react"

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string }

const field =
  "w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#D9772B] focus:outline-none transition-colors"

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus({ kind: "sending" })

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "전송에 실패했습니다.")
      form.reset()
      setStatus({ kind: "ok", message: "문의가 접수되었습니다. 빠르게 회신드리겠습니다." })
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "전송에 실패했습니다." })
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 grid gap-4 max-w-2xl">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" placeholder="이름 / 회사명" className={field} autoComplete="organization" />
        <input name="phone" placeholder="연락처" className={field} autoComplete="tel" />
      </div>
      <input
        name="email"
        type="email"
        required
        placeholder="이메일 *"
        className={field}
        autoComplete="email"
      />
      <textarea
        name="message"
        required
        rows={6}
        placeholder="프로젝트 개요, 규모, 희망 일정을 적어주세요. *"
        className={`${field} resize-y`}
      />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="px-8 py-3.5 text-sm bg-[#D9772B] text-black hover:bg-[#c5691f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status.kind === "sending" ? "전송 중…" : "문의 보내기"}
        </button>

        {status.message && (
          <p
            role="status"
            className={`text-sm ${status.kind === "ok" ? "text-white/70" : "text-[#ff8a6b]"}`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  )
}
