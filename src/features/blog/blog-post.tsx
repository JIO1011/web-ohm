"use client";

import { useState } from "react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Heart, Share2 } from "lucide-react";
import type { BlogPost } from "@/types";
import { getPostPalette } from "./blog-images";

const CATEGORY_BADGE: Record<string, string> = {
  "IA y Machine Learning": "bg-blue-500 text-white",
  "Cloud & DevOps":        "bg-amber-500 text-ink-900",
  "Desarrollo Web":        "bg-blue-600 text-white",
  "Ciberseguridad":        "bg-brand-600 text-white",
};

function getCategoryBadge(category: string): string {
  return CATEGORY_BADGE[category] ?? "bg-ink-700 text-ink-0";
}

function PostHero({ id }: { id: string }) {
  const palette = getPostPalette(id);
  return (
    <div
      aria-hidden="true"
      className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72"
      style={{
        backgroundImage: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <span
        className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.4, filter: "blur(55px)" }}
      />
      <span
        className="absolute right-8 top-8 h-3 w-3 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.85 }}
      />
      <span
        className="absolute right-14 top-14 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.5 }}
      />
    </div>
  );
}

export default function BlogPostView({ post }: { post: BlogPost }) {
  const [likes, setLikes] = useState<number>(post.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLike = (e: MouseEvent) => {
    e.preventDefault();
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((n) => n + 1);
  };

  const handleShare = (e: MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/blog/${post.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-ink-0 pb-24 pt-28 text-ink-900 md:pt-36">
      <article className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Volver al blog
        </Link>

        <PostHero id={post.id} />

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${getCategoryBadge(post.category)}`}>
              {post.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-ink-500">
              <Clock className="h-3 w-3" strokeWidth={1.75} />
              {post.readTime} de lectura
            </span>
            <span className="font-mono text-xs text-ink-500">{post.date}</span>
          </div>

          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-ink-200 py-4">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-ink-900">{post.author.name}</p>
              <p className="text-xs text-ink-500">{post.author.role}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleLike}
                aria-label="Me gusta"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  hasLiked
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-ink-200 text-ink-600 hover:border-brand-300"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`} strokeWidth={1.5} />
                <span className="font-mono text-xs">{likes}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copiar enlace"
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-sm text-ink-600 transition-colors hover:border-blue-300 hover:text-blue-600"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />
                    <span className="font-mono text-xs text-blue-600">Copiado</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span className="text-xs">Compartir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <p className="font-display text-xl leading-relaxed text-ink-800">{post.excerpt}</p>
          <div className="whitespace-pre-wrap text-base leading-relaxed text-ink-700">
            {post.content}
          </div>
        </div>

        <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600">
            ¿Trabajas en algo parecido?
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink-900">
            Conversemos sobre tu caso.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            30 minutos para entender el alcance y darte un punto de partida realista.
          </p>
          <Link
            href="/calcular-proyecto"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Agendar una primera llamada
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </aside>

        <footer className="flex flex-wrap items-center gap-1.5 border-t border-ink-100 pt-6">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md border border-ink-200 bg-white px-2.5 py-1 font-mono text-xs text-ink-700"
            >
              #{tag}
            </span>
          ))}
        </footer>
      </article>
    </div>
  );
}
