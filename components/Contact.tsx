"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PROFILE } from "@/lib/content";
import { DrawPath, SectionHeading, SketchFrame } from "./sketch";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; message: string };

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Mesaj gönderilemedi.");
      form.reset();
      setStatus({ kind: "ok" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Mesaj gönderilemedi." });
    }
  }

  return (
    <section id="iletisim" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-10 pt-20 md:px-8 md:pt-28">
      <SectionHeading kicker="son sayfa —" title="İletişim" seed={29} />

      <div className="grid items-start gap-12 md:grid-cols-[5fr_7fr]">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-hand text-4xl leading-tight text-graphite">
            Bir fikrin, bir projen ya da sadece bir merhaban mı var?
          </p>
          <p className="mt-4 text-charcoal/85">
            Yapay zekâ, bilgisayarlı görü veya web/mobil projeler hakkında konuşmaya her zaman açığım.
            Formu doldur ya da doğrudan profillerimden ulaş.
          </p>
          <div className="mt-6 flex gap-6 font-marker text-lg">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="underline decoration-dashed underline-offset-4 hover:decoration-solid">GitHub ↗</a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-dashed underline-offset-4 hover:decoration-solid">LinkedIn ↗</a>
          </div>
          {/* el çizimi kâğıt uçak */}
          <svg aria-hidden viewBox="0 0 220 120" className="mt-8 hidden w-56 text-graphite md:block" style={{ filter: "url(#pencil)" }}>
            <DrawPath d="M10 100 C60 96 96 70 120 50" width={1.2} opacity={0.5} duration={1.4} />
            <DrawPath d="M120 50 L205 18 L150 82 Z M205 18 L140 62 L150 82 M140 62 L132 74" width={1.8} delay={1.2} duration={1} />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 1.2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <SketchFrame seed={777} className="bg-[#fffdf8] px-6 py-8 sm:px-10">
            <div className="tape absolute -top-3 left-10 h-6 w-24 -rotate-6" aria-hidden />
            <div className="tape absolute -top-3 right-10 h-6 w-24 rotate-3" aria-hidden />
            <form onSubmit={onSubmit} className="space-y-7">
              <label className="block">
                <span className="font-hand text-2xl text-graphite">Adın</span>
                <input name="name" required maxLength={100} autoComplete="name" placeholder="Ada Lovelace" className="field" />
              </label>
              <label className="block">
                <span className="font-hand text-2xl text-graphite">E-posta</span>
                <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="ornek@mail.com" className="field" />
              </label>
              <label className="block">
                <span className="font-hand text-2xl text-graphite">Mesajın</span>
                <textarea name="message" required rows={5} maxLength={4000} placeholder="Merhaba Oğuzhan, ..." className="field resize-none leading-8" />
              </label>
              {/* bot tuzağı — gerçek kullanıcı görmez */}
              <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <div className="flex flex-wrap items-center gap-5">
                <motion.button
                  type="submit"
                  disabled={status.kind === "sending"}
                  whileHover={{ rotate: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-graphite bg-graphite px-6 py-2.5 font-marker text-lg text-paper shadow-[3px_4px_0_rgba(26,26,26,0.25)] disabled:opacity-60"
                >
                  {status.kind === "sending" ? "Gönderiliyor…" : "Gönder"}
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                </motion.button>
                <AnimatePresence mode="wait">
                  {status.kind === "ok" && (
                    <motion.p key="ok" role="status" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-hand text-2xl text-graphite">
                      Mesajın ulaştı, teşekkürler! ✓
                    </motion.p>
                  )}
                  {status.kind === "error" && (
                    <motion.p key="err" role="alert" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-marker text-base text-margin">
                      {status.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </SketchFrame>
        </motion.div>
      </div>

      <footer className="mt-24 flex flex-col items-center gap-2 border-t border-dashed border-charcoal/30 pt-8 text-center">
        <p className="font-hand text-3xl text-graphite">Hand-crafted &amp; Coded by Oğuzhan Dilmaç</p>
        <p className="text-sm text-smudge">© {new Date().getFullYear()} · kurşun kalem, kahve ve bolca kodla.</p>
      </footer>
    </section>
  );
}
