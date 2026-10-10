"use client";

import { motion } from "framer-motion";
import { ArrowDown, FolderGit2, BriefcaseBusiness, PenLine } from "lucide-react";
import Portrait from "./Portrait";
import { CircleOnHover, ScribbleUnderline } from "./sketch";
import { PROFILE } from "@/lib/content";

const NAME_LINES = ["OĞUZHAN", "DİLMAÇ"];

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-5 pb-16 pt-28 md:grid-cols-[5fr_7fr] md:gap-14 md:px-8 md:pt-24">
      {/* Sol: portre */}
      <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] md:max-w-none">
        <div className="tape absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3" aria-hidden />
        <div className="relative rounded-[3px] bg-[#fffdf8] p-3 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(26,26,26,0.45)] rotate-[-1.5deg]">
          <Portrait />
        </div>
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="absolute -bottom-9 left-2 font-hand text-xl text-smudge md:-left-4"
        >
          ↖ karakalem ben :)
        </motion.p>
      </div>

      {/* Sağ: başlık */}
      <div className="relative text-center md:text-left">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-marker text-lg text-smudge"
        >
          Merhaba, ben —
        </motion.p>

        <h1 className="pencil-text font-hand font-bold leading-[0.82] tracking-tight" aria-label={PROFILE.name}>
          {NAME_LINES.map((line, li) => (
            <span key={line} aria-hidden className="block whitespace-nowrap text-[clamp(4.2rem,15vw,9.5rem)]">
              {Array.from(line).map((ch, ci) => (
                <motion.span
                  key={ci}
                  className="inline-block"
                  initial={{ opacity: 0, y: 18, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: (ci % 3) - 1 }}
                  transition={{ delay: 0.35 + li * 0.45 + ci * 0.06, type: "spring", stiffness: 260, damping: 18 }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="relative mx-auto mt-6 inline-block font-marker text-xl leading-snug text-charcoal sm:text-2xl md:mx-0"
        >
          {PROFILE.role}
          <ScribbleUnderline seed={21} delay={1.7} />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
          className="mx-auto mt-7 max-w-xl text-[1.05rem] leading-relaxed text-charcoal/85 md:mx-0"
        >
          <span className="highlight">İnönü Üniversitesi Bilgisayar Mühendisliği</span> öğrencisi,{" "}
          <span className="highlight">Huawei Student Developers</span> Komiteler Lideri ve{" "}
          <span className="highlight">Türkiye Yapay Zeka Akademisi</span> Kampüs Elçisi. Bilgisayarlı görü, derin
          öğrenme ve modern web/mobil teknolojileriyle fikirleri çalışan ürünlere dönüştürüyorum.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-6 md:justify-start"
        >
          <SocialLink href={PROFILE.github} label="GitHub" seed={31}>
            <FolderGit2 className="h-5 w-5" strokeWidth={1.7} />
          </SocialLink>
          <SocialLink href={PROFILE.linkedin} label="LinkedIn" seed={47}>
            <BriefcaseBusiness className="h-5 w-5" strokeWidth={1.7} />
          </SocialLink>
          <SocialLink href={PROFILE.medium} label="Medium" seed={59}>
            <PenLine className="h-5 w-5" strokeWidth={1.7} />
          </SocialLink>
          <a
            href="#projeler"
            className="group inline-flex items-center gap-2 font-marker text-lg text-graphite underline decoration-dashed decoration-1 underline-offset-[6px] hover:decoration-solid"
          >
            Projelere bak
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </a>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-hand text-lg text-smudge md:block"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        aşağı kaydır ↓
      </motion.div>
    </section>
  );
}

function SocialLink({ href, label, seed, children }: { href: string; label: string; seed: number; children: React.ReactNode }) {
  return (
    <CircleOnHover seed={seed}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} profilim (yeni sekmede açılır)`}
        className="inline-flex items-center gap-2 px-2 py-1 font-marker text-lg text-graphite transition-transform hover:-rotate-2"
      >
        {children}
        {label}
      </a>
    </CircleOnHover>
  );
}
