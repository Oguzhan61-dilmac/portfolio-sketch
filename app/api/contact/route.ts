import { NextResponse } from "next/server";

/**
 * İletişim formu uç noktası.
 * RESEND_API_KEY ve CONTACT_TO_EMAIL tanımlıysa mesajı Resend ile e-posta olarak iletir.
 * Tanımlı değilse açık bir hata döner — form hiçbir zaman "gönderildi" diye yalan söylemez.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  // bot tuzağı doluysa sessizce kabul et
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Lütfen ad, geçerli bir e-posta ve mesaj gir." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json(
      { error: "Form henüz yapılandırılmadı — şimdilik LinkedIn üzerinden ulaşabilirsin." },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portfolyo <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Portfolyo mesajı — ${name}`,
      text: `Ad: ${name}\nE-posta: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Mesaj şu an gönderilemedi, lütfen biraz sonra tekrar dene." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
