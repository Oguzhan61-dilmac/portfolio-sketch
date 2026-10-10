import { PORTRAIT } from "./assets";
export default function Image({ src, alt, className, draggable }: { src: string; alt: string; className?: string; draggable?: boolean; [k: string]: unknown }) {
  return <img src={src.includes("portrait-sketch") ? PORTRAIT : src} alt={alt} className={className} draggable={draggable} />;
}
