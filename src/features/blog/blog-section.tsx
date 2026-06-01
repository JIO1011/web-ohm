"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock, Heart, Share2, Sparkles } from "lucide-react";
import { blogPosts } from "@/data/mock-data";
import type { BlogPost } from "@/types";
import { getPostPalette } from "./blog-images";

const CATEGORIES = [
  "All",
  "IA y Machine Learning",
  "Cloud & DevOps",
  "Desarrollo Web",
  "Ciberseguridad",
] as const;

type Category = (typeof CATEGORIES)[number];

/* Category → badge color using the 4-color palette */
const CATEGORY_BADGE: Record<string, string> = {
  "IA y Machine Learning": "bg-blue-500 text-white",
  "Cloud & DevOps":        "bg-amber-500 text-ink-900",
  "Desarrollo Web":        "bg-blue-600 text-white",
  "Ciberseguridad":        "bg-brand-600 text-white",
};

function getCategoryBadge(category: string): string {
  return CATEGORY_BADGE[category] ?? "bg-ink-700 text-ink-0";
}

function PostVisual({ id, className = "" }: { id: string; className?: string }) {
  const palette = getPostPalette(id);
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <span
        className="absolute -bottom-14 -right-14 h-48 w-48 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.35, filter: "blur(50px)" }}
      />
      <span
        className="absolute bottom-6 right-6 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.9 }}
      />
      <span
        className="absolute right-10 top-5 h-1.5 w-1.5 rounded-full"
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
      activeCategory === "All"
        ? blogPosts
        : blogPosts.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  /* Assign bento roles */
  const [kubernetesPost, iaPost, nextjsPost, apiSecurityPost] = blogPosts;

  return (
    <div id="blog-section-wrapper" className="space-y-16 pb-24">
      {/* HERO — dark navy */}
      <section
        id="blog-hero"
        className="relative overflow-hidden rounded-b-3xl bg-ink-900 px-4 pb-20 pt-40 text-center sm:px-6 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.968 0.007 30) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[700px] -translate-x-1/2 bg-amber-500/10 blur-[100px]" />

        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-semibold tracking-wide text-amber-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
            <span>OhmRoyal Journal</span>
          </div>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink-0 sm:text-5xl">
            Notas sobre arquitectura, IA y lo que pasa en producción.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-400 sm:text-base">
            Ensayos técnicos de nuestros ingenieros. Sin tendencias prestadas, solo lo que
            pasamos por código real.
          </p>
        </div>
      </section>

      {/* BENTO HERO GRID */}
      {kubernetesPost && iaPost && nextjsPost && apiSecurityPost && (
        <section
          id="blog-bento-hero"
          className="mx-auto max-w-7xl gap-4 px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Left tall — IA post (blue) */}
            <Link
              href={`/blog/${iaPost.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-ink-200 shadow-md transition-all hover:shadow-xl md:col-span-4 md:h-[480px]"
            >
              <PostVisual id={iaPost.id} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute left-4 top-4">
                <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${getCategoryBadge(iaPost.category)}`}>
                  {iaPost.category}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-2">
                <span className="block font-mono text-xs text-amber-400">
                  {iaPost.readTime} · {iaPost.author.name}
                </span>
                <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-amber-300">
                  {iaPost.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-white/70">{iaPost.excerpt}</p>
              </div>
            </Link>

            {/* Center — 2 stacked */}
            <div className="grid grid-rows-2 gap-4 md:col-span-5">
              <Link
                href={`/blog/${kubernetesPost.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-ink-200 shadow-sm transition-all hover:shadow-md"
              >
                <PostVisual id={kubernetesPost.id} className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute left-3 top-3">
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold uppercase ${getCategoryBadge(kubernetesPost.category)}`}>
                    {kubernetesPost.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <span className="block font-mono text-xs font-semibold text-amber-400">
                    {kubernetesPost.readTime} · {kubernetesPost.author.name}
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-amber-300 sm:text-lg">
                    {kubernetesPost.title}
                  </h3>
                </div>
              </Link>

              <Link
                href={`/blog/${nextjsPost.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-ink-200 shadow-sm transition-all hover:shadow-md"
              >
                <PostVisual id={nextjsPost.id} className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute left-3 top-3">
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold uppercase ${getCategoryBadge(nextjsPost.category)}`}>
                    {nextjsPost.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <span className="block font-mono text-xs font-semibold text-amber-400">
                    {nextjsPost.readTime} · {nextjsPost.author.name}
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-amber-300 sm:text-lg">
                    {nextjsPost.title}
                  </h3>
                </div>
              </Link>
            </div>

            {/* Right tall — Security post (red) */}
            <Link
              href={`/blog/${apiSecurityPost.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-ink-200 shadow-md transition-all hover:shadow-xl md:col-span-3 md:h-[480px]"
            >
              <PostVisual id={apiSecurityPost.id} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute left-4 top-4">
                <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${getCategoryBadge(apiSecurityPost.category)}`}>
                  {apiSecurityPost.category}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-2">
                <span className="block font-mono text-xs text-amber-400">
                  {apiSecurityPost.readTime} · {apiSecurityPost.author.name}
                </span>
                <h2 className="font-display text-base font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-amber-300">
                  {apiSecurityPost.title}
                </h2>
                <p className="line-clamp-3 text-xs leading-relaxed text-white/60">{apiSecurityPost.excerpt}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* TRENDING — horizontal ranked list */}
      <section
        id="blog-trending-reviews"
        className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between border-b border-ink-200 pb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-light leading-none text-amber-500">(</span>
            <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-ink-900">
              Artículos Destacados
            </h2>
          </div>
          <Link href="/blog" className="font-mono text-sm font-semibold text-blue-500 hover:text-blue-600">
            ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post, idx) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-ink-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="relative flex-shrink-0">
                <div className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 font-mono text-xs font-bold text-ink-900 shadow">
                  {idx + 1}
                </div>
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-ink-200">
                  <PostVisual id={post.id} className="h-full w-full" />
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${getCategoryBadge(post.category)}`}>
                  {post.category}
                </span>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 transition-colors group-hover:text-blue-600">
                  {post.title}
                </h3>
                <span className="flex items-center gap-1 font-mono text-xs text-ink-500">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FILTERED FEED */}
      <section
        id="blog-filtered-feed"
        className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 border-b border-ink-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-light leading-none text-amber-500">(</span>
            <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-ink-900">
              Ingeniería & Código
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
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-mono text-sm font-semibold uppercase tracking-wide transition-all ${
                    isActive
                      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "border-ink-200 bg-white text-ink-600 hover:border-blue-300 hover:text-blue-600"
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
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="relative h-36 w-full overflow-hidden border-b border-ink-100">
                  <PostVisual id={post.id} className="h-full w-full" />
                  <span className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${getCategoryBadge(post.category)}`}>
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-ink-500">
                      <span className="text-amber-500">{post.readTime} lectura</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 transition-colors group-hover:text-blue-600">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 font-sans text-xs leading-normal text-ink-500">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-2.5">
                    <span className="block max-w-[80px] truncate text-xs font-semibold text-ink-700">
                      {post.author.name.split(" ")[0]}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => handleLike(e, post.id)}
                        aria-label="Me gusta"
                        className={`flex items-center gap-0.5 text-sm transition-colors ${
                          hasLiked ? "text-brand-600" : "text-ink-400 hover:text-brand-600"
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`} strokeWidth={1.5} />
                        <span className="font-mono text-xs">{postLikes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, post)}
                        aria-label="Copiar enlace"
                        className="text-ink-400 transition-colors hover:text-blue-500"
                      >
                        {copiedId === post.id ? (
                          <Check className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
                        ) : (
                          <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <p className="pt-6 text-sm text-ink-500">No hay artículos en esta categoría todavía.</p>
        )}

        {/* Bottom CTAs */}
        <div className="grid grid-cols-1 gap-4 pt-10 md:grid-cols-2">
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-ink-900 p-5 shadow-md">
            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-500/15 blur-2xl" />
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
                Herramienta
              </span>
              <h3 className="text-base font-semibold leading-tight text-ink-0 transition-colors group-hover:text-amber-300">
                Presupuestador de software
              </h3>
              <p className="text-sm leading-normal text-ink-400">
                Estima arquitectura y costo de tu proyecto en 3 pasos.
              </p>
            </div>
            <Link
              href="/calcular-proyecto"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              Abrir calculadora
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600">
                Diagnóstico
              </span>
              <h3 className="text-base font-semibold leading-tight text-ink-900 transition-colors group-hover:text-blue-600">
                Auditoría técnica express
              </h3>
              <p className="text-sm leading-normal text-ink-600">
                Revisamos tus pipelines frente a riesgos OWASP sin costo.
              </p>
            </div>
            <Link
              href="/calcular-proyecto"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Agendar llamada
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        <p className="block pt-4 text-center font-mono text-[10px] uppercase text-ink-400">
          <Clock className="mr-1 inline h-3 w-3" strokeWidth={1.5} />
          Publicaciones nuevas cada 2 semanas
        </p>
      </section>
    </div>
  );
}
