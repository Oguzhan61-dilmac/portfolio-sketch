"use client";

import { motion, type Transition } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { roughEllipse, roughRect, scribbleLine } from "@/lib/rough";

/** Global SVG filtreleri: grafit dokusu ve hafif titreme. layout içinde bir kez render edilir. */
export function SketchFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="shaky" />
          <feComponentTransfer in="grain" result="mask">
            <feFuncA type="table" tableValues="0.55 1" />
          </feComponentTransfer>
          <feComposite in="shaky" in2="mask" operator="in" />
        </filter>
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" seed="8" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" />
        </filter>
      </defs>
    </svg>
  );
}

const draw = (delay = 0, duration = 1.1): Transition => ({
  pathLength: { delay, duration, ease: [0.65, 0, 0.35, 1] },
  opacity: { delay, duration: 0.01 },
});

/** Scroll ile görünür olduğunda "kalemle çizilen" path. */
export function DrawPath({
  d, delay = 0, duration = 1.1, width = 1.6, opacity = 1, className, once = true,
}: {
  d: string; delay?: number; duration?: number; width?: number; opacity?: number;
  className?: string; once?: boolean;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity }}
      viewport={{ once, amount: 0.3 }}
      transition={draw(delay, duration)}
    />
  );
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // offsetWidth/Height: padding dahil ve CSS transform'lardan (tilt) etkilenmez
    const measure = () => {
      const width = el.offsetWidth, height = el.offsetHeight;
      setSize((s) => (Math.abs(s.w - width) > 1 || Math.abs(s.h - height) > 1 ? { w: width, h: height } : s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/**
 * İçeriğini elle çizilmiş bir çerçeveyle saran kutu.
 * Çerçeve gerçek piksel boyutunda üretilir, scroll'da iki geçişle (kalem + gölge) çizilir.
 */
export function SketchFrame({
  children, seed = 1, className = "", delay = 0, double = true, inset = 4,
}: {
  children: ReactNode; seed?: number; className?: string; delay?: number; double?: boolean; inset?: number;
}) {
  const [ref, { w, h }] = useSize<HTMLDivElement>();
  return (
    <div ref={ref} className={`relative ${className}`}>
      {w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-visible text-graphite"
          width={w}
          height={h}
          style={{ filter: "url(#pencil)" }}
        >
          <DrawPath d={roughRect(w, h, seed, inset)} delay={delay} duration={1.3} width={1.7} />
          {double && (
            <DrawPath d={roughRect(w, h, seed + 97, inset + 1.5, 2.4)} delay={delay + 0.35} duration={1.3} width={1} opacity={0.45} />
          )}
        </svg>
      )}
      {children}
    </div>
  );
}

/** Metnin altına çizilen dalgalı karalama çizgisi. */
export function ScribbleUnderline({ seed = 4, delay = 0.2, className = "" }: { seed?: number; delay?: number; className?: string }) {
  const [ref, { w }] = useSize<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden className={`pointer-events-none absolute -bottom-2 left-0 block h-4 w-full ${className}`}>
      {w > 0 && (
        <svg width={w} height={16} className="overflow-visible">
          <DrawPath d={scribbleLine(w, 8, seed)} delay={delay} duration={0.9} width={2.2} />
          <DrawPath d={scribbleLine(w * 0.86, 12, seed + 5, 2)} delay={delay + 0.5} duration={0.7} width={1.3} opacity={0.6} />
        </svg>
      )}
    </span>
  );
}

/** Hover'da öğenin etrafına daire karalayan sarmalayıcı. */
export function CircleOnHover({ children, seed = 7, className = "" }: { children: ReactNode; seed?: number; className?: string }) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  return (
    <motion.span ref={ref} initial="rest" whileHover="hover" whileFocus="hover" animate="rest" className={`relative inline-flex ${className}`}>
      {children}
      {w > 0 && (
        <svg aria-hidden width={w} height={h} className="pointer-events-none absolute inset-0 overflow-visible text-graphite">
          <motion.path
            d={roughEllipse(w / 2, h / 2, w / 2 + 8, h / 2 + 6, seed)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            variants={{
              rest: { pathLength: 0, opacity: 0, transition: { duration: 0.25 } },
              hover: { pathLength: 1, opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
            }}
          />
        </svg>
      )}
    </motion.span>
  );
}

/** Bölüm başlığı: el yazısı + çizilen alt çizgi + küçük not. */
export function SectionHeading({ kicker, title, seed = 11 }: { kicker: string; title: string; seed?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6 }}
      className="mb-12 md:mb-16"
    >
      <p className="font-marker text-lg text-smudge">{kicker}</p>
      <h2 className="pencil-text relative inline-block font-hand text-5xl font-bold leading-none sm:text-6xl md:text-7xl">
        {title}
        <ScribbleUnderline seed={seed} delay={0.35} />
      </h2>
    </motion.div>
  );
}
