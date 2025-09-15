// app/api/contact/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(req: Request) {
  try {
    const { name = "", email = "", phone = "", message = "" } = await req.json().catch(() => ({}))

    if (!message || !email) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 465)
    const secure = (process.env.SMTP_SECURE ?? "true") !== "false"
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.TO_EMAIL || user

    if (!host || !user || !pass || !to) {
      return NextResponse.json({ error: "메일 서버 환경변수가 설정되지 않았습니다." }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    })

    // 연결 확인(설정 오류를 빠르게 잡기 위함)
    await transporter.verify()

    const text = `이름: ${name}\n이메일: ${email}\n연락처: ${phone}\n\n메시지:\n${message}`
    const html = `
      <div style="font-size:14px;line-height:1.7">
        <p><b>이름:</b> ${name || "-"}</p>
        <p><b>이메일:</b> ${email || "-"}</p>
        <p><b>연락처:</b> ${phone || "-"}</p>
        <hr/>
        <pre style="white-space:pre-wrap">${message}</pre>
      </div>
    `

    await transporter.sendMail({
      // DMARC 문제 회피: 발송자는 반드시 본인 계정으로
      from: `"NAIN STUDIO 웹 문의" <${user}>`,
      to,
      subject: `[NAIN STUDIO] 새 문의: ${name || "무명"}`,
      text,
      html,
      // 답장은 사용자가 적은 메일로 가도록
      replyTo: isEmail(email) ? email : undefined,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("MAIL_ERROR", err)
    return NextResponse.json({ error: "메일 전송 중 오류가 발생했습니다." }, { status: 500 })
  }
}
