"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Post } from "@/lib/medium";
import { SectionHeading } from "./sketch";

const TILT = [-1.4, 0.8, -0.6, 1.1, -0.9, 0.5];

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function Notes({ posts, mediumUrl }: { posts: Post[]; mediumUrl: string | null }) {
  return (
    <section id="notlar" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading kicker="sayfa 05 —" title="Blog & Notlar" seed={23} />

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 22, rotate: -1.6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="notebook-page relative max-w-xl pb-8 pl-[62px] pr-6 pt-12 shadow-[0_1px_0_rgba(0,0,0,0.05),0_22px_38px_-26px_rgba(26,26,26,0.55)]"
        >
          <div aria-hidden className="absolute left-0 right-0 top-3 flex justify-around px-6">
            {Array.from({ length: 7 }).map((_, k) => (
              <span key={k} className="h-3 w-3 rounded-full border border-charcoal/30 bg-paper-dark shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]" />
            ))}
          </div>
          <h3 className="font-hand text-[2rem] font-bold leading-8 text-graphite">{mediumUrl ? "Yazılarım Medium'da" : "Yazılar yolda"}</h3>
          <p className="mt-2 font-marker text-[1.05rem] leading-8 text-charcoal">
            {mediumUrl
              ? "Yapay zekâ, veri ve yazılım üzerine yazılarımı Medium'da paylaşıyorum. Yazılar şu an listelenemedi, profilimden okuyabilirsin."
              : "Yapay zekâ, bilgisayarlı görü ve yazılım üzerine notlarımı Medium'da yayınlayacağım. Yazılar çıktıkça bu sayfaya otomatik eklenecek."}
          </p>
          {mediumUrl && (
            <a
              href={mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 font-marker text-base leading-8 text-graphite underline decoration-dashed underline-offset-4 hover:decoration-solid"
            >
              Medium profilim <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </motion.div>
      ) : (
        <div className="grid items-start gap-10 md:grid-cols-3 md:gap-8">
          {posts.map((n, i) => (
            <motion.article
              key={n.url}
              initial={{ opacity: 0, y: 26, rotate: TILT[i % TILT.length] * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILT[i % TILT.length] }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 3) * 0.12, duration: 0.55 }}
              whileHover={{ rotate: 0, y: -5 }}
              className="notebook-page relative pb-6 pl-[62px] pr-6 pt-10 shadow-[0_1px_0_rgba(0,0,0,0.05),0_22px_38px_-26px_rgba(26,26,26,0.55)]"
            >
              <div aria-hidden className="absolute left-0 right-0 top-3 flex justify-around px-6">
                {Array.from({ length: 7 }).map((_, k) => (
                  <span key={k} className="h-3 w-3 rounded-full border border-charcoal/30 bg-paper-dark shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]" />
                ))}
              </div>
              <p className="font-hand text-lg leading-8 text-smudge">{fmt(n.date)}</p>
              <h3 className="font-hand text-[1.9rem] font-bold leading-8 text-graphite">
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                  {n.title}
                </a>
              </h3>
              {n.excerpt && <p className="mt-2 font-marker text-[1.05rem] leading-8 text-charcoal">{n.excerpt}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 leading-8">
                {n.tags.map((t) => (
                  <span key={t} className="font-hand text-lg text-smudge">#{t}</span>
                ))}
              </div>
              <span className="mt-1 inline-flex items-center gap-1.5 font-marker text-base leading-8 text-graphite underline decoration-dashed underline-offset-4">
                Medium'da oku <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
