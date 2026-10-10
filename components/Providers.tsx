"use client";

import { MotionConfig } from "framer-motion";

/** İşletim sisteminde "hareketi azalt" açıksa Framer Motion animasyonlarını sadeleştirir. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
