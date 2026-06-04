"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MouseEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Clock,
  Cloud,
  Code2,
  Heart,
  Newspaper,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { blogPosts } from "@/data/mock-data";
import type { BlogPost } from "@/types";
import { getPostPalette } from "./blog-images";

/* Category → glyph shown inside the abstract cover */
const CATEGORY_ICON: Record<string, LucideIcon> = {
  "IA y Machine Learning": BrainCircuit,
  "Cloud & DevOps": Cloud,
  "Desarrollo Web": Code2,
  Ciberseguridad: ShieldCheck,
};

function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON[category] ?? Newspaper;
}

const CATEGORIES = [
  "All",
  "IA y Machine Learning",
  "Cloud & DevOps",
  "Desarrollo Web",
  "Ciberseguridad",
] as const;

type Category = (typeof CATEGORIES)[number];

/* Badges are neutral — the category color lives in the cover gradient (PostVisual),
   so badges never compete with it. Glass over images, solid ink on white surfaces. */
const BADGE_ON_IMAGE = "bg-white/90 text-ink-900 shadow-sm backdrop-blur-sm";
const BADGE_ON_SURFACE = "bg-ink-900 text-white";

/* "Lo más leído" ranks by engagement (likes desc), not raw array order. */
const TRENDING_POSTS = [...blogPosts].sort((a, b) => b.likes - a.likes).slice(0, 3);

function PostVisual({
  id,
  category,
  className = "",
}: {
  id: string;
  category?: string;
  className?: string;
}) {
  const palette = getPostPalette(id);
  const Glyph = category ? getCategoryIcon(category) : null;
  return (
    <div
      aria-hidden="true"
      className={`group/visual relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      {/* dot-grid texture */}
      <span
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* glow */}
      <span
        className="absolute -right-14 -bottom-14 h-48 w-48 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.35, filter: "blur(50px)" }}
      />
      {/* oversized category glyph */}
      {Glyph && (
        <Glyph
          className="absolute -right-4 -bottom-5 h-28 w-28 text-white/10 transition-transform duration-500 group-hover:-rotate-6 group-hover/visual:scale-110"
          strokeWidth={1}
        />
      )}
      <span
        className="absolute right-6 bottom-6 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.9 }}
      />
      <span
        className="absolute top-5 right-10 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.5 }}
      />
    </div>
  );
}

export default function BlogSection() {
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [likedList, setLikedList] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const handleLike = (e: MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedList.includes(postId)) return;
    setLikedList((prev) => [...prev, postId]);
    setLikesState((prev) => {
      const base = blogPosts.find((p) => p.id === postId)?.likes ?? 0;
      return { ...prev, [postId]: (prev[postId] ?? base) + 1 };
    });
  };

  const handleShare = (e: MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${post.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url);
    }
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPosts = useMemo(
    () =>
      activeCategory === "All" ? blogPosts : blogPosts.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  /* Assign bento roles */
  const [kubernetesPost, iaPost, nextjsPost, apiSecurityPost] = blogPosts;

  return (
    <div id="blog-section-wrapper" className="space-y-16 pb-24">
      {/* HERO — dark navy */}
      <section
        id="blog-hero"
        className="bg-ink-900 relative overflow-hidden rounded-b-3xl px-4 pt-40 pb-20 text-center sm:px-6 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.968 0.007 30) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden="true"
          className="bg-brand-500/10 pointer-events-none absolute top-0 left-1/2 h-[350px] w-[700px] -translate-x-1/2 blur-[100px]"
        />

        <div className="relative">
          <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase">
            <Sparkles className="text-brand-400 h-3.5 w-3.5" strokeWidth={1.75} />
            <span>OhmRoyal Journal</span>
          </div>
          <h1 className="font-display text-ink-0 mx-auto mt-4 max-w-4xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Notas sobre arquitectura, IA y lo que pasa en producción.
          </h1>
          <p className="text-ink-400 mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            Ensayos técnicos de nuestros ingenieros. Sin tendencias prestadas, solo lo que pasamos
            por código real.
          </p>
        </div>
      </section>

      {/* BENTO HERO GRID */}
      {kubernetesPost && iaPost && nextjsPost && apiSecurityPost && (
        <section id="blog-bento-hero" className="mx-auto max-w-7xl gap-4 px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Left tall — IA post (blue) */}
            <Link
              href={`/blog/${iaPost.slug}`}
              className="group border-ink-200 relative block overflow-hidden rounded-3xl border shadow-md transition-all hover:shadow-xl md:col-span-4 md:h-[480px]"
            >
              <PostVisual
                id={iaPost.id}
                category={iaPost.category}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase ${BADGE_ON_IMAGE}`}
                >
                  {iaPost.category}
                </span>
              </div>
              <div className="absolute right-5 bottom-5 left-5 space-y-2">
                <span className="text-ink-300 block font-mono text-xs">
                  {iaPost.readTime} · {iaPost.author.name}
                </span>
                <h2 className="font-display group-hover:text-brand-300 text-xl leading-snug font-semibold tracking-tight text-white transition-colors">
                  {iaPost.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
                  {iaPost.excerpt}
                </p>
              </div>
            </Link>

            {/* Center — 2 stacked */}
            <div className="grid grid-rows-2 gap-4 md:col-span-5">
              <Link
                href={`/blog/${kubernetesPost.slug}`}
                className="group border-ink-200 relative block overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-md"
              >
                <PostVisual
                  id={kubernetesPost.id}
                  category={kubernetesPost.category}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold uppercase ${BADGE_ON_IMAGE}`}
                  >
                    {kubernetesPost.category}
                  </span>
                </div>
                <div className="absolute right-4 bottom-4 left-4 space-y-1.5">
                  <span className="text-ink-300 block font-mono text-xs font-semibold">
                    {kubernetesPost.readTime} · {kubernetesPost.author.name}
                  </span>
                  <h3 className="font-display group-hover:text-brand-300 text-base leading-snug font-semibold text-white transition-colors sm:text-lg">
                    {kubernetesPost.title}
                  </h3>
                </div>
              </Link>

              <Link
                href={`/blog/${nextjsPost.slug}`}
                className="group border-ink-200 relative block overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-md"
              >
                <PostVisual
                  id={nextjsPost.id}
                  category={nextjsPost.category}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold uppercase ${BADGE_ON_IMAGE}`}
                  >
                    {nextjsPost.category}
                  </span>
                </div>
                <div className="absolute right-4 bottom-4 left-4 space-y-1.5">
                  <span className="text-ink-300 block font-mono text-xs font-semibold">
                    {nextjsPost.readTime} · {nextjsPost.author.name}
                  </span>
                  <h3 className="font-display group-hover:text-brand-300 text-base leading-snug font-semibold text-white transition-colors sm:text-lg">
                    {nextjsPost.title}
                  </h3>
                </div>
              </Link>
            </div>

            {/* Right tall — Security post (red) */}
            <Link
              href={`/blog/${apiSecurityPost.slug}`}
              className="group border-ink-200 relative block overflow-hidden rounded-3xl border shadow-md transition-all hover:shadow-xl md:col-span-3 md:h-[480px]"
            >
              <PostVisual
                id={apiSecurityPost.id}
                category={apiSecurityPost.category}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase ${BADGE_ON_IMAGE}`}
                >
                  {apiSecurityPost.category}
                </span>
              </div>
              <div className="absolute right-5 bottom-5 left-5 space-y-2">
                <span className="text-ink-300 block font-mono text-xs">
                  {apiSecurityPost.readTime} · {apiSecurityPost.author.name}
                </span>
                <h2 className="font-display group-hover:text-brand-300 text-base leading-snug font-semibold tracking-tight text-white transition-colors">
                  {apiSecurityPost.title}
                </h2>
                <p className="line-clamp-3 text-xs leading-relaxed text-white/60">
                  {apiSecurityPost.excerpt}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        </section>
      )}

      {/* TRENDING — horizontal ranked list */}
      <section
        id="blog-trending-reviews"
        className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8"
      >
        <div className="border-ink-200 flex items-end justify-between border-b pb-4">
          <div className="space-y-2">
            <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
              Lo más leído
            </span>
            <h2 className="font-display text-ink-900 text-2xl font-semibold tracking-tight sm:text-3xl">
              Artículos destacados
            </h2>
          </div>
          <Link
            href="/blog"
            className="group text-ink-900 hover:text-brand-600 inline-flex items-center gap-2 self-end text-sm font-medium transition-colors"
          >
            Ver todos
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
        </div>

        <ScrollReveal className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TRENDING_POSTS.map((post, idx) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border-ink-200 hover:border-ink-300 relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative flex-shrink-0">
                <div className="bg-brand-500 absolute -top-2 -left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold text-white shadow">
                  {idx + 1}
                </div>
                <div className="border-ink-200 h-16 w-16 overflow-hidden rounded-xl border">
                  <PostVisual id={post.id} category={post.category} className="h-full w-full" />
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${BADGE_ON_SURFACE}`}
                >
                  {post.category}
                </span>
                <h3 className="text-ink-900 group-hover:text-brand-600 line-clamp-2 text-sm leading-snug font-semibold transition-colors">
                  {post.title}
                </h3>
                <span className="text-ink-500 flex items-center gap-1 font-mono text-xs">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </ScrollReveal>
      </section>

      {/* FILTERED FEED */}
      <section id="blog-filtered-feed" className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="border-ink-200 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-brand-500 block font-mono text-xs font-bold tracking-widest uppercase">
              Todos los artículos
            </span>
            <h2 className="font-display text-ink-900 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ingeniería &amp; código
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const isActive: boolean = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide uppercase transition-all ${
                    isActive
                      ? "border-ink-900 bg-ink-900 text-white shadow-sm"
                      : "border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900 bg-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPosts.map((post) => {
            const postLikes = likesState[post.id] ?? post.likes;
            const hasLiked: boolean = likedList.includes(post.id);

            return (
              <div
                key={post.id}
                className="group border-ink-200 hover:border-ink-300 relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Stretched-link overlay: whole card navigates, but the like/share
                    buttons stay interactive (no invalid <button> inside <a>). */}
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={post.title}
                  className="absolute inset-0 z-10"
                />
                <div className="border-ink-100 relative h-36 w-full overflow-hidden border-b">
                  <PostVisual id={post.id} category={post.category} className="h-full w-full" />
                  <span
                    className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${BADGE_ON_IMAGE}`}
                  >
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="space-y-1">
                    <div className="text-ink-500 flex items-center justify-between font-mono text-[10px] font-semibold">
                      <span>{post.readTime} lectura</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-ink-900 group-hover:text-brand-600 line-clamp-2 text-sm leading-snug font-semibold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-ink-500 line-clamp-2 font-sans text-xs leading-normal">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="border-ink-100 mt-auto flex items-center justify-between border-t pt-2.5">
                    <span className="text-ink-700 block max-w-[80px] truncate text-xs font-semibold">
                      {post.author.name.split(" ")[0]}
                    </span>
                    <div className="relative z-20 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => handleLike(e, post.id)}
                        aria-label="Me gusta"
                        className={`flex items-center gap-0.5 text-sm transition-colors ${
                          hasLiked ? "text-brand-600" : "text-ink-400 hover:text-brand-600"
                        }`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`}
                          strokeWidth={1.5}
                        />
                        <span className="font-mono text-xs">{postLikes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, post)}
                        aria-label="Copiar enlace"
                        className="text-ink-400 hover:text-brand-600 transition-colors"
                      >
                        {copiedId === post.id ? (
                          <Check className="text-brand-600 h-3.5 w-3.5" strokeWidth={2} />
                        ) : (
                          <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <p className="text-ink-500 pt-6 text-sm">No hay artículos en esta categoría todavía.</p>
        )}

        {/* Bottom CTAs */}
        <ScrollReveal className="grid grid-cols-1 gap-4 pt-10 md:grid-cols-2">
          <div className="group bg-ink-900 relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 shadow-md">
            <div className="bg-brand-500/15 pointer-events-none absolute top-0 right-0 h-28 w-28 rounded-full blur-2xl" />
            <div className="space-y-2">
              <span className="text-brand-400 font-mono text-xs font-bold tracking-widest uppercase">
                Herramienta
              </span>
              <h3 className="text-ink-0 group-hover:text-brand-300 text-base leading-tight font-semibold transition-colors">
                Presupuestador de software
              </h3>
              <p className="text-ink-400 text-sm leading-normal">
                Estima arquitectura y costo de tu proyecto en 3 pasos.
              </p>
            </div>
            <Link
              href="/calcular-proyecto"
              className="text-brand-400 hover:text-brand-300 mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-semibold"
            >
              Abrir calculadora
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="group border-ink-200 bg-ink-50 flex flex-col justify-between overflow-hidden rounded-3xl border p-5 shadow-sm">
            <div className="space-y-2">
              <span className="text-brand-500 font-mono text-xs font-bold tracking-widest uppercase">
                Diagnóstico
              </span>
              <h3 className="text-ink-900 group-hover:text-brand-600 text-base leading-tight font-semibold transition-colors">
                Auditoría técnica express
              </h3>
              <p className="text-ink-600 text-sm leading-normal">
                Revisamos tus pipelines frente a riesgos OWASP sin costo.
              </p>
            </div>
            <Link
              href="/calcular-proyecto"
              className="text-brand-600 hover:text-brand-700 mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-semibold"
            >
              Agendar llamada
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </ScrollReveal>

        <p className="text-ink-400 block pt-4 text-center font-mono text-[10px] uppercase">
          <Clock className="mr-1 inline h-3 w-3" strokeWidth={1.5} />
          Publicaciones nuevas cada 2 semanas
        </p>
      </section>
    </div>
  );
}
