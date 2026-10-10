"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#yolculuk", label: "Yolculuk" },
  { href: "#basarilar", label: "Başarılar" },
  { href: "#teknolojiler", label: "Yetkinlikler" },
  { href: "#projeler", label: "Projeler" },
  { href: "#notlar", label: "Notlar" },
  { href: "#iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300 ${
        scrolled ? "bg-paper/85 shadow-[0_1px_0_rgba(26,26,26,0.08)] backdrop-blur-sm" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8" aria-label="Ana menü">
        <a href="#top" className="font-hand text-3xl font-bold text-graphite" aria-label="Başa dön">
          O<span className="text-smudge">.</span>D<span className="text-smudge">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href} className="relative">
              <a href={l.href} className="relative block px-3 py-1 font-marker text-[1.05rem] text-charcoal hover:text-graphite">
                {l.label}
                {active === l.href && (
                  <motion.svg
                    layoutId="nav-underline"
                    aria-hidden
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    className="absolute -bottom-0.5 left-2 right-2 h-2.5 w-[calc(100%-1rem)] overflow-visible text-graphite"
                  >
                    <path d="M2 6 Q25 2 50 5 T98 4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </motion.svg>
                )}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          className="p-2 text-graphite md:hidden"
        >
          {open ? <X className="h-6 w-6" strokeWidth={1.7} /> : <Menu className="h-6 w-6" strokeWidth={1.7} />}
        </button>
      </nav>

      {/* kurşun kalemle çizilen okuma ilerleme çizgisi */}
      <motion.div aria-hidden style={{ scaleX: progress }} className="h-[2px] origin-left bg-graphite/70" />

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="notebook-page border-b border-dashed border-charcoal/30 px-5 pb-4 pl-16 md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block font-hand text-3xl leading-[3rem] text-graphite">
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
