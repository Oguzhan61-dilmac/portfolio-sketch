import "server-only";
import { MEDIUM_USERNAME } from "./content";

export type Post = {
  title: string;
  url: string;
  date: string; // ISO
  tags: string[];
  excerpt: string;
};

const unwrap = (s: string) => s.replace(/^<!\[CDATA\[|\]\]>$/g, "").trim();
const tag = (block: string, name: string) =>
  block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "";
const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");

/** Medium RSS → yazı listesi. Kullanıcı adı yoksa ya da feed alınamazsa boş liste döner. */
export async function getPosts(): Promise<Post[]> {
  if (!MEDIUM_USERNAME) return [];
  try {
    const res = await fetch(`https://medium.com/feed/@${MEDIUM_USERNAME.replace(/^@/, "")}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 6).map(([, item]) => {
      const html = unwrap(tag(item, "content:encoded"));
      const firstP = html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "";
      const text = decode(firstP.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
      return {
        title: decode(unwrap(tag(item, "title"))),
        url: unwrap(tag(item, "link")).split("?")[0],
        date: new Date(unwrap(tag(item, "pubDate"))).toISOString(),
        tags: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) => unwrap(m[1])).slice(0, 3),
        excerpt: text.length > 170 ? text.slice(0, 167).trimEnd() + "…" : text,
      };
    });
  } catch {
    return [];
  }
}
