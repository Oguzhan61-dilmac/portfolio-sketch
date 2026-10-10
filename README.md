# Oğuzhan Dilmaç — Karakalem Portfolyo

Next.js (App Router) · Tailwind CSS v4 · Framer Motion · lucide-react · kendi SVG çizimleri.

## Çalıştırma

```bash
npm install
cp .env.example .env.local   # isteğe bağlı
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Vercel'e doğrudan deploy edilebilir (repo'yu bağla → Deploy).

## Projeler GitHub'dan nasıl çekiliyor?

`lib/github.ts` → `getProjects()`

- `https://api.github.com/users/Oguzhan61-dilmac/repos` uç noktasından **tüm herkese açık repolar** sunucuda çekilir.
- Her repo için `languages` uç noktasından dil dağılımı + repo **topics** birleştirilip teknoloji etiketleri üretilir.
- **DijiFizyo** ve **ALGO.SYS** elenir (büyük/küçük harf ve noktalama bağımsız: `algo-sys`, `ALGO.SYS`, `AlgoSys` hepsi yakalanır). Listeyi `EXCLUDED` dizisinden değiştirebilirsin.
- Fork'lar ve profil README reposu proje sayılmaz.
- Sayfa **saatte bir** yeniden üretilir (ISR, `revalidate = 3600`): GitHub'a yeni repo eklediğinde site kendiliğinden güncellenir.
- GitHub'a ulaşılamazsa (rate-limit vb.) `FALLBACK` listesi gösterilir ve sayfada bu belirtilir.
- Kartlarda açıklama görünmesi için GitHub'da her reponun **About** kısmına açıklama ve **topics** eklemen yeterli — buradaki kartlar otomatik dolar. Repo'nun "Website" alanını doldurursan karta **Demo** linki eklenir.

`GITHUB_TOKEN` tanımlarsan API limiti 60 → 5000 istek/saat olur (izin gerektirmeyen bir fine-grained token yeterli).

## İletişim formu

`app/api/contact/route.ts` mesajı [Resend](https://resend.com) ile e-postana iletir. `.env.local` içine `RESEND_API_KEY` ve `CONTACT_TO_EMAIL` ekle. Tanımlı değilse form kullanıcıya açıkça "yapılandırılmadı" der; sahte başarı mesajı göstermez. Bot tuzağı (honeypot) alanı vardır.

## Dosya yapısı

```
app/
  layout.tsx          # fontlar, SVG kalem filtreleri, metadata
  page.tsx            # bölümler + GitHub verisi (ISR)
  globals.css         # tema renkleri, kâğıt dokusu, defter yaprağı, bant, fosforlu kalem
  api/contact/route.ts
components/
  sketch.tsx          # SketchFrame, DrawPath, ScribbleUnderline, CircleOnHover, SectionHeading
  Portrait.tsx        # karakalem portre + kenar eskizleri (yüz tamamen temiz)
  Hero.tsx  Journey.tsx  TechStack.tsx  Projects.tsx  Notes.tsx  Contact.tsx  Navbar.tsx
lib/
  github.ts           # canlı GitHub veri katmanı + filtre + yedek liste
  content.ts          # profil, yolculuk, teknoloji yığını — metinleri buradan düzenle
  rough.ts            # el çizimi titrek çizgi/dikdörtgen/daire üreticileri (deterministik)
```

## Özelleştirme

- **Portre:** `public/portrait-sketch.webp` fotoğrafından üretilmiş karakalem çizimdir. Değiştirmek için aynı isimle yeni bir görsel koy (en/boy oranı farklıysa `Portrait.tsx` içindeki `width`/`height` değerlerini güncelle).
- **Renkler / fontlar:** `app/globals.css` → `@theme` (kâğıt `#FDFBF7`, kurşun kalem `#1A1A1A`, kömür `#2B2B2B`). Fontlar Fontsource ile yerel olarak paketlenir (Caveat, Kalam, IBM Plex Sans — Türkçe karakter destekli).
- **Animasyonlar:** `prefers-reduced-motion` açıksa CSS geçişleri kısalır.
