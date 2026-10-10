"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Zap } from "lucide-react";
import { JOURNEY } from "@/lib/content";
import { DrawPath, SectionHeading } from "./sketch";
import { roughEllipse } from "@/lib/rough";

const ICON = { Eğitim: GraduationCap, Liderlik: Users, Deneyim: Zap } as const;

export default function Journey() {
  return (
    <section id="yolculuk" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading kicker="sayfa 01 —" title="Yolculuk" seed={13} />

      <ol className="relative grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNEY.map((j, i) => {
          const Icon = ICON[j.kind];
          return (
            <motion.li
              key={j.title + j.place}
              initial={{ opacity: 0, y: 18, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative flex gap-4"
            >
              <div className="relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center text-graphite">
                <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 h-full w-full overflow-visible" style={{ filter: "url(#pencil)" }}>
                  <DrawPath d={roughEllipse(24, 24, 21, 20, 60 + i)} delay={0.2 + i * 0.08} duration={0.8} width={1.6} />
                </svg>
                <Icon className="h-5 w-5 transition-transform group-hover:rotate-[-8deg] group-hover:scale-110" strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-hand text-lg leading-none text-smudge">{j.kind}</p>
                <h3 className="font-marker text-xl font-bold leading-tight text-graphite">{j.title}</h3>
                <p className="text-[0.98rem] text-charcoal">{j.place}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
