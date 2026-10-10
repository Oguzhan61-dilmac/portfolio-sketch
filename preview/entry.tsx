import { createRoot } from "react-dom/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Achievements from "@/components/Achievements";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Notes from "@/components/Notes";
import Contact from "@/components/Contact";
import { SketchFilters } from "@/components/sketch";
import { FALLBACK } from "@/lib/github";

// Önizleme anlık görüntüsü: gerçek sitede yazılar Medium RSS'inden canlı gelir (özet metni dahil).
const POSTS = [
  { title: "Kod Yazmak Değil, Kod Yaşatmak: Sürdürülebilir Mimari ve Temiz Kod Kılavuzu", url: "https://medium.com/@dilmacoguz33/kod-yazmak-de%C4%9Fil-kod-ya%C5%9Fatmak-s%C3%BCrd%C3%BCr%C3%BClebilir-mimari-ve-temiz-kod-k%C4%B1lavuzu-47ad3a3fe1ea", date: "2026-10-01T20:15:49Z", tags: ["clean-code", "solid-principles", "software-architecture"], excerpt: "" },
  { title: "1.398 Siparişten 3 Müşteri Segmentine: K-Means ile E-Ticaret Analizi", url: "https://medium.com/@dilmacoguz33/1-398-sipari%C5%9Ften-3-m%C3%BC%C5%9Fteri-segmentine-k-means-ile-e-ticaret-analizi-1edf2b0eef0b", date: "2026-08-16T14:10:13Z", tags: ["makine-öğrenimi", "k-means-clustering", "ecommerce"], excerpt: "" },
];

createRoot(document.getElementById("root")!).render(
  <>
    <SketchFilters />
    <Navbar />
    <main>
      <Hero />
      <Journey />
      <Achievements />
      <TechStack />
      <Projects projects={FALLBACK} source="fallback" />
      <Notes posts={POSTS} mediumUrl="https://medium.com/@dilmacoguz33" />
      <Contact />
    </main>
  </>,
);
