"use client";

import { useState } from "react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Heart, Share2 } from "lucide-react";
import type { BlogPost } from "@/types";
import { getPostPalette } from "./blog-images";

/* Neutral badge — category color lives in the cover gradient (PostHero), not the badge. */
const BADGE_ON_SURFACE = "bg-ink-900 text-white";

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
        className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.4, filter: "blur(55px)" }}
      />
      <span
        className="absolute top-8 right-8 h-3 w-3 rounded-full"
        style={{ backgroundColor: palette.accent, opacity: 0.85 }}
      />
      <span
        className="absolute top-14 right-14 h-1.5 w-1.5 rounded-full"
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
    <div className="bg-ink-0 text-ink-900 pt-28 pb-24 md:pt-36">
      <article className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="text-ink-600 hover:text-brand-600 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Volver al blog
        </Link>

        <PostHero id={post.id} />

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase ${BADGE_ON_SURFACE}`}
            >
              {post.category}
            </span>
            <span className="text-ink-500 flex items-center gap-1 font-mono text-xs">
              <Clock className="h-3 w-3" strokeWidth={1.75} />
              {post.readTime} de lectura
            </span>
            <span className="text-ink-500 font-mono text-xs">{post.date}</span>
          </div>

          <h1 className="font-display text-ink-900 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          <div className="border-ink-200 flex items-center justify-between border-y py-4">
            <div className="space-y-0.5">
              <p className="text-ink-900 text-sm font-semibold">{post.author.name}</p>
              <p className="text-ink-500 text-xs">{post.author.role}</p>
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
                <Heart
                  className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`}
                  strokeWidth={1.5}
                />
                <span className="font-mono text-xs">{likes}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copiar enlace"
                className="border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-600 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="text-brand-600 h-3.5 w-3.5" strokeWidth={2} />
                    <span className="text-brand-600 font-mono text-xs">Copiado</span>
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
          <p className="font-display text-ink-800 text-xl leading-relaxed">{post.excerpt}</p>
          <div className="text-ink-700 text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        <aside className="border-ink-200 bg-ink-50 rounded-2xl border p-6 sm:p-8">
          <p className="text-brand-500 font-mono text-xs font-bold tracking-widest uppercase">
            ¿Trabajas en algo parecido?
          </p>
          <h2 className="font-display text-ink-900 mt-2 text-xl font-semibold">
            Conversemos sobre tu caso.
          </h2>
          <p className="text-ink-600 mt-2 text-sm leading-relaxed">
            30 minutos para entender el alcance y darte un punto de partida realista.
          </p>
          <Link
            href="/calcular-proyecto"
            className="text-brand-600 hover:text-brand-700 mt-4 inline-flex items-center gap-2 text-sm font-semibold"
          >
            Agendar una primera llamada
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </aside>

        <footer className="border-ink-100 flex flex-wrap items-center gap-1.5 border-t pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="border-ink-200 text-ink-700 rounded-md border bg-white px-2.5 py-1 font-mono text-xs"
            >
              #{tag}
            </span>
          ))}
        </footer>
      </article>
    </div>
  );
}
