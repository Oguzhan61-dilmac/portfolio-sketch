"use client";

import { motion } from "framer-motion";
import { STACK } from "@/lib/content";
import { CircleOnHover, SectionHeading, SketchFrame } from "./sketch";

const NOTE_TILT = [-1.8, 1.2, -0.8, 1.6];

export default function TechStack() {
  return (
    <section id="teknolojiler" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading kicker="sayfa 03 —" title="Yetenek & Yetkinlikler" seed={17} />

      <div className="grid gap-8 sm:grid-cols-2">
        {STACK.map((g, gi) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, rotate: NOTE_TILT[gi % NOTE_TILT.length] }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: gi * 0.1, duration: 0.55 }}
            whileHover={{ rotate: 0, y: -4 }}
          >
            <SketchFrame seed={200 + gi * 13} delay={0.15 + gi * 0.1} className="notebook-page px-6 pb-7 pl-16 pt-6">
              <div className="tape absolute -top-3 right-8 h-6 w-20 rotate-6" aria-hidden />
              <h3 className="font-hand text-3xl font-bold leading-8 text-graphite">{g.group}</h3>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                {g.items.map((t, ti) => (
                  <motion.li
                    key={t.name}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + gi * 0.1 + ti * 0.06 }}
                    className="leading-8"
                  >
                    <CircleOnHover seed={300 + gi * 10 + ti}>
                      <span className="cursor-default font-marker text-lg text-charcoal">
                        <span aria-hidden className="mr-1.5 text-smudge">✎</span>
                        {t.name}
                        {t.level && <span className="ml-1.5 font-hand text-base text-smudge">({t.level})</span>}
                      </span>
                    </CircleOnHover>
                  </motion.li>
                ))}
              </ul>
            </SketchFrame>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
