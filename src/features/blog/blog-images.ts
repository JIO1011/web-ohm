export interface PostVisualPalette {
  from: string;
  to: string;
  accent: string;
}

const PALETTES: Record<string, PostVisualPalette> = {
  /* Cloud & DevOps — navy gradient, amber accent */
  "kubernetes-scaling": {
    from: "oklch(0.362 0.040 252)" /* ink-700 */,
    to: "oklch(0.152 0.030 252)" /* ink-950 */,
    accent: "oklch(0.725 0.180 68)" /* amber-500 #F39237 */,
  },
  /* IA y Machine Learning — ocean blue gradient, cream accent */
  "ia-trends-2026": {
    from: "oklch(0.495 0.135 233)" /* blue-600 */,
    to: "oklch(0.215 0.042 252)" /* ink-900 */,
    accent: "oklch(0.968 0.007 30)" /* ink-0 cream */,
  },
  /* Desarrollo Web — deep blue-navy, amber accent */
  "nextjs-architectures": {
    from: "oklch(0.395 0.120 232)" /* blue-700 */,
    to: "oklch(0.152 0.030 252)" /* ink-950 */,
    accent: "oklch(0.725 0.180 68)" /* amber-500 */,
  },
  /* Ciberseguridad — deep red brand gradient, amber accent */
  "api-security-hardening": {
    from: "oklch(0.520 0.215 19)" /* brand-600 #DD0426 */,
    to: "oklch(0.162 0.062 18)" /* brand-950 */,
    accent: "oklch(0.725 0.180 68)" /* amber-500 */,
  },
};

export function getPostPalette(id: string): PostVisualPalette {
  return PALETTES[id] ?? PALETTES["nextjs-architectures"]!;
}
