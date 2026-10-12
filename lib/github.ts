import "server-only";

export const GITHUB_USER = "Oguzhan61-dilmac";

/**
 * Pasif projeler — isim karşılaştırması büyük/küçük harf ve noktalama
 * bağımsızdır: "ALGO.SYS", "algo-sys", "AlgoSys" hepsi elenir.
 */
// Sitede GÖSTERİLMEYECEK repolar (büyük/küçük harf ve tire/alt çizgi fark etmez).
// Yeni birini gizlemek için buraya adını ekle.
const EXCLUDED = [
  "dijifizyo",
  "algosys",
  "veri-bilimi-notlari",
  "makine-ogrenmesi-notlari",
  "antipark-app",
  "python-egitim-notlari",
  "Solaris-One-tan-t-m-Web",
  "nereye-gidilir",
  "web-gelistirme-notlari",
  "portfolio-sketch",
  "Oguzhan61-dilmac.github.io",
].map((n) => n.toLowerCase().replace(/[^a-z0-9]/g, ""));

export type Project = {
  id: number;
  name: string;
  title: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  tech: string[];
  updatedAt: string;
  /** GitHub dışı projeler için: bağlantı etiketi (varsayılan "GitHub") ve yıldız sayacını gizleme */
  linkLabel?: string;
  hideStars?: boolean;
};

export type ProjectsResult = {
  projects: Project[];
  source: "live" | "fallback";
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  pushed_at: string;
  languages_url: string;
};


/** Kaynak kodu gizli olabilen ama canlı demosu olan proje: API'de görünmezse de listeye eklenir. */
const BERBER: Project = {
  id: 11, name: "berber-randevu-sistemi", title: "Berber Randevu Sistemi",
  description: "Berber salonları için online randevu sistemi: hizmet ve saat seçerek 7/24 randevu alma, randevularım ekranı ve yönetim paneli.",
  url: `https://github.com/${GITHUB_USER}/berber-randevu-sistemi`, homepage: "https://berberotomasyon.vercel.app",
  stars: 0, forks: 0, language: null, tech: [], updatedAt: "2026-06-15",
};
/**
 * Mood Blocks — Google Play'de yayında olan blok bulmaca oyunu (GitHub'da gösterilen bir repo değil).
 */
const MOOD_BLOCKS: Project = {
  id: 12, name: "mood-blocks", title: "Mood Blocks",
  description: "Google Play'de yayında olan blok bulmaca oyunu. Tasarımından yayına kadar kendi geliştirdiğim mobil oyun projem.",
  url: "https://play.google.com/store/apps/details?id=com.moodblocks.game", homepage: null,
  stars: 0, forks: 0, language: null, tech: ["Mobil Oyun", "Google Play"], updatedAt: "2026-10-12",
  linkLabel: "Google Play", hideStars: true,
};
const MANUAL: Project[] = [BERBER, MOOD_BLOCKS];

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const isExcluded = (name: string) => EXCLUDED.includes(normalize(name));

/** "radiation-telemetry-recovery" → "Radiation Telemetry Recovery" */
export function prettifyName(name: string) {
  const known: Record<string, string> = {
    nepisirsem: "Ne Pişirsem",
    "nereye-gidilir": "Nereye Gidilir",
    "antipark-app": "AntiPark",
    "mnist-ann-digit-classification": "MNIST ANN Digit Classification",
  };
  if (known[name.toLowerCase()]) return known[name.toLowerCase()];
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b(ai|ui|ann|api|tua|cnn|ml|io)\b/gi, (m) => m.toUpperCase())
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Topic'leri okunur teknoloji etiketlerine çevirir. */
function prettyTopic(t: string) {
  const map: Record<string, string> = {
    nextjs: "Next.js", reactjs: "React", react: "React", typescript: "TypeScript",
    javascript: "JavaScript", python: "Python", pytorch: "PyTorch", opencv: "OpenCV",
    tensorflow: "TensorFlow", keras: "Keras", tailwindcss: "Tailwind CSS",
    supabase: "Supabase", firebase: "Firebase", flutter: "Flutter",
    "react-native": "React Native", expo: "Expo", streamlit: "Streamlit",
    "computer-vision": "Computer Vision", "deep-learning": "Deep Learning",
    "machine-learning": "Machine Learning", csharp: "C#", unity: "Unity",
    mapbox: "Mapbox", leaflet: "Leaflet", openstreetmap: "OpenStreetMap",
  };
  return map[t] ?? t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const headers = (): HeadersInit => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

/** Saatte bir yeniden doğrulanır (ISR) — yeni repo eklediğinde site kendini günceller. */
const REVALIDATE = 3600;

async function fetchLanguages(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { headers: headers(), next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, number>;
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([lang]) => lang);
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<ProjectsResult> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=pushed`,
      { headers: headers(), next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = (await res.json()) as GitHubRepo[];

    const visible = repos.filter(
      (r) =>
        !r.private &&
        !r.fork &&
        !isExcluded(r.name) &&
        // profil README reposu (Oguzhan61-dilmac/Oguzhan61-dilmac) proje değildir
        normalize(r.name) !== normalize(GITHUB_USER),
    );

    const projects = await Promise.all(
      visible.map(async (r): Promise<Project> => {
        const langs = await fetchLanguages(r.languages_url);
        const topics = (r.topics ?? []).map(prettyTopic);
        const tech = Array.from(new Set([...langs, ...topics])).slice(0, 6);
        return {
          id: r.id,
          name: r.name,
          title: prettifyName(r.name),
          description: r.description,
          url: r.html_url,
          homepage: r.homepage || null,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          tech: tech.length ? tech : r.language ? [r.language] : [],
          updatedAt: r.pushed_at,
        };
      }),
    );

    for (const m of MANUAL) {
      const live = projects.find((p) => normalize(p.name) === normalize(m.name));
      // canlı veride varsa demo linkini koru, yoksa elle eklenen kaydı kullan
      if (live) live.homepage = live.homepage ?? m.homepage;
      else if (!isExcluded(m.name)) projects.push(m);
    }
    projects.sort((a, b) => b.stars - a.stars || +new Date(b.updatedAt) - +new Date(a.updatedAt));
    return { projects, source: "live" };
  } catch (err) {
    console.warn("[github] canlı veri alınamadı, yedek liste kullanılıyor:", err);
    return { projects: [...FALLBACK, MOOD_BLOCKS].filter((p) => !isExcluded(p.name)), source: "fallback" };
  }
}

/**
 * Yedek liste: GitHub'a ulaşılamazsa (rate-limit, ağ hatası) gösterilir.
 * 9 Ekim 2026'da profilinden doğrulanan herkese açık repolar.
 */
export const FALLBACK: Project[] = [
  {
    id: 1, name: "media-downloader-hub", title: "Media Downloader Hub",
    description: "Farklı platformlardan medya indirmeyi tek merkezde toplayan araç.",
    url: `https://github.com/${GITHUB_USER}/media-downloader-hub`, homepage: null,
    stars: 4, forks: 0, language: "Python", tech: ["Python"], updatedAt: "2026-10-01",
  },
  {
    id: 2, name: "radiation-telemetry-recovery", title: "Radiation Telemetry Recovery",
    description: "Radyasyon kaynaklı bozulmuş uzay telemetrisini analiz eden ve kurtaran Streamlit dashboard'u.",
    url: `https://github.com/${GITHUB_USER}/radiation-telemetry-recovery`, homepage: null,
    stars: 3, forks: 0, language: "Python", tech: ["Python", "Streamlit", "Pandas"], updatedAt: "2026-09-20",
  },
  {
    id: 3, name: "nepisirsem", title: "Ne Pişirsem",
    description: "Türk yemek tarifleri için, kategori ve malzemeye göre tarif öneren web uygulaması.",
    url: `https://github.com/${GITHUB_USER}/nepisirsem`, homepage: null,
    stars: 1, forks: 0, language: "JavaScript", tech: ["JavaScript"], updatedAt: "2026-09-10",
  },
  {
    id: 4, name: "mnist-ann-digit-classification", title: "MNIST ANN Digit Classification",
    description: "MNIST veri setinde el yazısı rakamları sınıflandıran yapay sinir ağı.",
    url: `https://github.com/${GITHUB_USER}/mnist-ann-digit-classification`, homepage: null,
    stars: 1, forks: 0, language: "Python", tech: ["Python", "TensorFlow", "Keras"], updatedAt: "2026-09-05",
  },
  {
    id: 5, name: "emotion-face-recognition", title: "Emotion Face Recognition",
    description: "Canlı kamera akışıyla yüz duygusu tanıma için derin öğrenme tabanlı uygulama.",
    url: `https://github.com/${GITHUB_USER}/emotion-face-recognition`, homepage: null,
    stars: 0, forks: 0, language: "Jupyter Notebook", tech: ["Python", "TensorFlow", "OpenCV"], updatedAt: "2026-08-28",
  },
  {
    id: 6, name: "nereye-gidilir", title: "Nereye Gidilir",
    description: "OpenStreetMap verileriyle Türkiye için gezi keşfi uygulaması.",
    url: `https://github.com/${GITHUB_USER}/nereye-gidilir`, homepage: null,
    stars: 0, forks: 0, language: "Python", tech: ["JavaScript", "Python", "Leaflet"], updatedAt: "2026-08-20",
  },
  {
    id: 7, name: "antipark-app", title: "AntiPark",
    description: "Harita odaklı mobil uygulama geliştirme çalışması.",
    url: `https://github.com/${GITHUB_USER}/antipark-app`, homepage: null,
    stars: 0, forks: 0, language: "TypeScript", tech: ["TypeScript", "React Native", "Expo", "Mapbox"], updatedAt: "2026-08-10",
  },
  {
    id: 8, name: "DeepVision-CIFAR10", title: "DeepVision CIFAR-10",
    description: "CIFAR-10 veri seti üzerinde Keras ve TensorFlow ile görüntü sınıflandırma (CNN) projesi.",
    url: `https://github.com/${GITHUB_USER}/DeepVision-CIFAR10`, homepage: null,
    stars: 0, forks: 0, language: "Python", tech: ["Python", "TensorFlow", "Keras", "CNN"], updatedAt: "2026-07-01",
  },
  {
    id: 9, name: "video-splitter-studio", title: "Video Splitter Studio",
    description: null,
    url: `https://github.com/${GITHUB_USER}/video-splitter-studio`, homepage: null,
    stars: 0, forks: 0, language: null, tech: [], updatedAt: "2026-06-01",
  },
  {
    id: 10, name: "youtube-auto-scheduler", title: "YouTube Auto Scheduler",
    description: null,
    url: `https://github.com/${GITHUB_USER}/youtube-auto-scheduler`, homepage: null,
    stars: 0, forks: 0, language: null, tech: [], updatedAt: "2026-06-01",
  },
  BERBER,
];

