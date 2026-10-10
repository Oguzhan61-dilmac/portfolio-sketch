"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Karakalem portre: gerçek fotoğraftan üretilmiş kurşun kalem çizimi (public/portrait-sketch.webp).
 * Görsel yukarıdan aşağıya "çiziliyormuş" gibi açılır, ardından yalnızca kenarlarda
 * minimalist eskiz çizgileri belirir. Yüzün üzerine hiçbir çizgi/şema gelmez.
 */

type Stroke = { d: string; w?: number; o?: number };

// viewBox 900×966 — tüm çizgiler kenarlarda, yüz bölgesinin (x≈240–640) dışında
const SIDE: Stroke[] = [
  // sol kenardan çıkan kavisler
  { d: "M150 210 C112 280 104 380 128 470", w: 2.4, o: 0.6 },
  { d: "M118 232 C84 300 80 396 100 486", w: 1.8, o: 0.4 },
  // sağ kenardan çıkan kavisler
  { d: "M750 210 C788 280 796 380 772 470", w: 2.4, o: 0.6 },
  { d: "M782 232 C816 300 820 396 800 486", w: 1.8, o: 0.4 },
  // köşe doodle'ları: yıldız, daire, kıvırcık parantez, zikzak
  { d: "M70 70 L88 106 M58 92 L102 84 M64 106 L96 70", w: 2.6, o: 0.8 },
  { d: "M800 70 C828 52 856 76 840 104 C822 128 790 108 800 70", w: 2.4, o: 0.75 },
  { d: "M860 560 C838 560 842 584 842 596 C842 610 830 614 824 614 C830 614 842 618 842 632 C842 646 838 668 860 668", w: 2.6, o: 0.8 },
  { d: "M40 560 L84 532 L110 586", w: 2.4, o: 0.7 },
];

export default function Portrait() {
  return (
    <div className="relative">
      <motion.div
        initial={{ clipPath: "inset(0% 0% 100% 0%)", filter: "contrast(0.35) brightness(1.35)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", filter: "contrast(1) brightness(1)" }}
        transition={{
          clipPath: { delay: 0.25, duration: 1.8, ease: [0.55, 0, 0.3, 1] },
          filter: { delay: 1.2, duration: 1.4, ease: "easeOut" },
        }}
      >
        <Image
          src="/portrait-sketch.webp"
          alt="Oğuzhan Dilmaç'ın karakalem portresi"
          width={900}
          height={966}
          priority
          sizes="(min-width: 768px) 40vw, 360px"
          className="h-auto w-full mix-blend-multiply select-none"
          draggable={false}
        />
      </motion.div>

      <svg
        aria-hidden
        viewBox="0 0 900 966"
        className="pointer-events-none absolute inset-0 h-full w-full text-graphite"
        style={{ filter: "url(#pencil)" }}
      >
        {SIDE.map((s, k) => {
          const delay = 2.1 + k * 0.14;
          return (
            <motion.path
              key={k}
              d={s.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={s.w ?? 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: s.o ?? 0.8 }}
              transition={{
                pathLength: { delay, duration: 0.7, ease: [0.6, 0, 0.3, 1] },
                opacity: { delay, duration: 0.01 },
              }}
            />
          );
        })}
        <motion.text
          x="760"
          y="940"
          className="font-hand"
          fontSize="44"
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 3.4, duration: 0.8 }}
        >
          ~ O.D.
        </motion.text>
      </svg>
    </div>
  );
}
