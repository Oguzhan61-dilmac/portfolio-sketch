/**
 * Elle çizilmiş görünüm için deterministik "titrek" SVG path üreticileri.
 * Aynı seed → aynı çizgi (SSR ve istemci aynı sonucu üretir, hydration uyumu bozulmaz).
 */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/** Tek bir kalem çizgisi: hafif kavisli, uçları biraz taşan. */
export function roughLine(
  x1: number, y1: number, x2: number, y2: number,
  rnd: () => number, wobble = 1.6,
) {
  const j = () => (rnd() - 0.5) * 2 * wobble;
  const over = 2 + rnd() * 3; // uçların taşma miktarı
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const sx = x1 - ux * over * rnd() + j() * 0.4, sy = y1 - uy * over * rnd() + j() * 0.4;
  const ex = x2 + ux * over + j() * 0.4, ey = y2 + uy * over + j() * 0.4;
  const c1x = x1 + dx * 0.3 + j(), c1y = y1 + dy * 0.3 + j();
  const c2x = x1 + dx * 0.7 + j(), c2y = y1 + dy * 0.7 + j();
  return `M${f(sx)} ${f(sy)} C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(ex)} ${f(ey)}`;
}

/** Elle çizilmiş dikdörtgen (inset: kenarlardan içeri boşluk). */
export function roughRect(w: number, h: number, seed: number, inset = 4, wobble = 1.8) {
  const r = seeded(seed);
  const a = inset, b = inset, c = w - inset, d = h - inset;
  return [
    roughLine(a, b, c, b, r, wobble),
    roughLine(c, b, c, d, r, wobble),
    roughLine(c, d, a, d, r, wobble),
    roughLine(a, d, a, b, r, wobble),
  ].join(" ");
}

/** Elle çizilmiş elips/daire — kapanmayan, üst üste binen bir tur. */
export function roughEllipse(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const r = seeded(seed);
  const steps = 14;
  const start = r() * Math.PI * 2;
  const total = Math.PI * 2 * (1.08 + r() * 0.1);
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = start + (total * i) / steps;
    const k = 1 + (r() - 0.5) * 0.08;
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
  }
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`;
  }
  return d;
}

/** Dalgalı alt çizgi / karalama. */
export function scribbleLine(w: number, y: number, seed: number, amp = 3) {
  const r = seeded(seed);
  const n = Math.max(3, Math.round(w / 40));
  let d = `M2 ${f(y + (r() - 0.5) * amp)}`;
  for (let i = 1; i <= n; i++) {
    const x = (w - 2) * (i / n);
    const px = x - (w / n) / 2;
    d += ` Q${f(px)} ${f(y + (r() - 0.5) * amp * 2)} ${f(x)} ${f(y + (r() - 0.5) * amp)}`;
  }
  return d;
}
