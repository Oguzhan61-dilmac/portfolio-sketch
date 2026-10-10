"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, GitFork, Star } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import type { Project } from "@/lib/github";
import { PROFILE } from "@/lib/content";
import { SectionHeading, SketchFrame } from "./sketch";
import { scribbleLine } from "@/lib/rough";

export default function Projects({ projects, source }: { projects: Project[]; source: "live" | "fallback" }) {
  const languages = useMemo(() => {
    const count = new Map<string, number>();
    projects.forEach((p) => p.language && count.set(p.language, (count.get(p.language) ?? 0) + 1));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);
  }, [projects]);
  const [filter, setFilter] = useState<string>("Tümü");
  const shown = filter === "Tümü" ? projects : projects.filter((p) => p.language === filter);

  return (
    <section id="projeler" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <SectionHeading kicker="sayfa 04 —" title="Dijital Projelerim" seed={19} />

      <div className="-mt-6 mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl text-charcoal/80">
          {source === "live" ? (
            <>
              Bu liste{" "}
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="underline decoration-dashed underline-offset-4 hover:decoration-solid">
                GitHub profilimden
              </a>{" "}
              canlı çekiliyor ve saatte bir güncelleniyor — {projects.length} proje.
            </>
          ) : (
            <>GitHub'a şu an ulaşılamadı; kayıtlı proje listesi gösteriliyor ({projects.length} proje).</>
          )}
        </p>
        {languages.length > 1 && (
          <div role="tablist" aria-label="Dile göre filtrele" className="flex flex-wrap gap-2">
            {["Tümü", ...languages].map((l) => {
              const active = filter === l;
              return (
                <button
                  key={l}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(l)}
                  className={`relative rounded-full px-3.5 py-1 font-marker text-base transition-colors ${
                    active ? "text-paper" : "text-charcoal hover:bg-graphite/5"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-0 rounded-[999px_40px_999px_60px] bg-graphite"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <motion.ul layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

const TILTS = [-1.2, 0.9, -0.5, 1.4, -1.6, 0.6];

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 });

  const onMove = (e: MouseEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHover(false);
  };

  const tilt = TILTS[index % TILTS.length];
  const seed = p.id % 1000;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.5 }}
      whileHover={{ rotate: 0, y: -6 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="list-none"
    >
      <SketchFrame seed={seed + 400} delay={0.1} className="flex h-full flex-col bg-[#fffdf8]/80 px-6 pb-6 pt-7">
        {/* köşe: proje numarası */}
        <span aria-hidden className="absolute right-5 top-3 font-hand text-2xl text-smudge/70">
          #{String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="relative pr-10 font-hand text-[2rem] font-bold leading-[1.05] text-graphite">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.title}
          </a>
          <svg aria-hidden className="absolute -bottom-2 left-0 h-3 w-[70%] overflow-visible text-graphite" viewBox="0 0 200 12" preserveAspectRatio="none">
            <motion.path
              d={scribbleLine(200, 6, seed)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ pathLength: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </svg>
        </h3>

        <p className="mt-4 flex-1 text-[0.97rem] leading-relaxed text-charcoal/85">
          {p.description ?? <span className="italic text-smudge">Açıklama henüz eklenmedi — repoya göz at.</span>}
        </p>

        {p.tech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Kullanılan teknolojiler">
            {p.tech.map((t) => (
              <li key={t} className="rounded-[14px_4px_12px_5px] border border-dashed border-charcoal/45 px-2.5 py-0.5 font-marker text-sm text-charcoal">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-dashed border-charcoal/25 pt-4 font-marker text-base">
          <div className="flex items-center gap-4 text-charcoal">
            <span className="inline-flex items-center gap-1" title="Yıldız">
              <Star className="h-4 w-4" strokeWidth={1.7} fill={p.stars > 0 ? "currentColor" : "none"} />
              {p.stars}
            </span>
            {p.forks > 0 && (
              <span className="inline-flex items-center gap-1" title="Fork">
                <GitFork className="h-4 w-4" strokeWidth={1.7} />
                {p.forks}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {p.homepage && (
              <a href={p.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-dashed underline-offset-4 hover:decoration-solid">
                Demo <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-dashed underline-offset-4 hover:decoration-solid">
              GitHub →
            </a>
          </div>
        </div>
      </SketchFrame>
    </motion.li>
  );
}
