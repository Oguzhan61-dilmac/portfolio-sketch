export const PROFILE = {
  name: "Oğuzhan Dilmaç",
  role: "Bilgisayar Mühendisi & Yapay Zekâ / Software Developer",
  bio: "İnönü Üniversitesi Bilgisayar Mühendisliği öğrencisi, Huawei Student Developers Komiteler Lideri ve Türkiye Yapay Zeka Akademisi Kampüs Elçisi. Bilgisayarlı görü, derin öğrenme ve modern web/mobil teknolojileriyle fikirleri çalışan ürünlere dönüştürüyorum.",
  github: "https://github.com/Oguzhan61-dilmac",
  linkedin: "https://www.linkedin.com/in/o%C4%9Fuz-dilma%C3%A7/",
  medium: "https://medium.com/@dilmacoguz33",
};

export const JOURNEY = [
  {
    kind: "Eğitim",
    title: "Bilgisayar Mühendisliği",
    place: "İnönü Üniversitesi",
    note: "Lisans öğrencisi",
  },
  {
    kind: "Liderlik",
    title: "Komiteler Lideri",
    place: "Huawei Student Developers",
    note: "Komitelerin koordinasyonu",
  },
  {
    kind: "Liderlik",
    title: "Kampüs Elçisi",
    place: "Türkiye Yapay Zeka Akademisi",
    note: "Kampüste yapay zekâ farkındalığı",
  },
  {
    kind: "Deneyim",
    title: "Enerji Sistemleri Stajyeri",
    place: "Samsun Makina Sanayi",
    note: "Staj",
  },
] as const;

export const ACHIEVEMENTS = [
  {
    rank: "5.",
    place: "TUA Astro Hackathon · Malatya",
    title: "Hackathonda ekipçe 5. olduk",
    detail: "Projemizle Ankara'da Gençlik Bakanlığı'nda düzenlenen finalde sunum yapma hakkı kazandık.",
  },
  {
    rank: "Final",
    place: "Kırşehir 5. Ar-Ge Pazarı",
    title: "Solaris One ile finale kaldık",
    detail: "Solaris One projemizle finale kalarak projemizi orada sunma fırsatı elde ettik.",
  },
] as const;

export type Skill = { name: string; level?: string };

export const STACK: { group: string; items: Skill[] }[] = [
  {
    group: "Programlama Dilleri",
    items: [
      { name: "Python", level: "ileri seviye" },
      { name: "Java", level: "orta düzey" },
    ],
  },
  {
    group: "Yapay Zekâ & Görü",
    items: ["Makine Öğrenmesi", "Deep Learning", "Computer Vision", "PyTorch", "OpenCV", "MobileNetV2"].map((name) => ({ name })),
  },
  {
    group: "Web",
    items: ["Next.js", "React", "Tailwind CSS", "HTML5 Canvas"].map((name) => ({ name })),
  },
  {
    group: "Backend & Veri",
    items: ["Supabase", "Firebase"].map((name) => ({ name })),
  },
  {
    group: "Mobil",
    items: ["Flutter", "React Native"].map((name) => ({ name })),
  },
  {
    group: "İlgi Duyduğum Ek Konular",
    items: [{ name: "Gömülü Sistemler" }],
  },
];

/**
 * Medium kullanıcı adın (başındaki @ olmadan). Varsayılan: dilmacoguz33
 * Doldurduğunda blog bölümü Medium yazılarını RSS'ten otomatik çeker.
 * Hiç yazı yoksa bölüm "yazılar yolda" boş durumunu gösterir; sahte içerik üretilmez.
 */
export const MEDIUM_USERNAME = process.env.NEXT_PUBLIC_MEDIUM_USERNAME || "dilmacoguz33";
