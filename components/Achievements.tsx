"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/content";
import { DrawPath, SectionHeading, SketchFrame } from "./sketch";
import { roughEllipse } from "@/lib/rough";

export default function Achievements() {
  return (
    <section id="basarilar" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading kicker="sayfa 02 —" title="Başarılar" seed={15} />

      <div className="grid gap-8 md:grid-cols-2">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.place}
            initial={{ opacity: 0, y: 22, rotate: i % 2 ? 1.6 : -1.6 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.7 : -0.7 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.12, duration: 0.55 }}
            whileHover={{ rotate: 0, y: -4 }}
          >
            <SketchFrame seed={500 + i * 31} delay={0.15 + i * 0.1} className="flex gap-5 bg-[#fffdf8]/85 px-6 py-7 sm:px-8">
              <div className="tape absolute -top-3 left-10 h-6 w-20 -rotate-3" aria-hidden />
              {/* elle çizilmiş madalya dairesi */}
              <div className="relative mt-1 flex h-20 w-20 shrink-0 items-center justify-center text-graphite">
                <svg aria-hidden viewBox="0 0 80 80" className="absolute inset-0 h-full w-full overflow-visible" style={{ filter: "url(#pencil)" }}>
                  <DrawPath d={roughEllipse(40, 40, 36, 35, 90 + i)} delay={0.3 + i * 0.1} duration={0.9} width={2} />
                  <DrawPath d={roughEllipse(40, 40, 29, 28, 120 + i)} delay={0.6 + i * 0.1} duration={0.8} width={1} opacity={0.5} />
                </svg>
                <span className={`relative font-hand font-bold leading-none ${a.rank.length > 2 ? "text-2xl" : "text-3xl"}`}>{a.rank}</span>
              </div>
              <div className="min-w-0">
                <p className="font-hand text-lg leading-none text-smudge">{a.place}</p>
                <h3 className="mt-1 font-marker text-xl font-bold leading-tight text-graphite">{a.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-charcoal/85">{a.detail}</p>
              </div>
            </SketchFrame>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
