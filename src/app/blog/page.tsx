import type { Metadata } from "next";
import BlogSection from "@/features/blog/blog-section";

export const metadata: Metadata = {
  title: "Blog Técnico",
  description:
    "Investigación de vanguardia, código y arquitectura — Journal de ingenieros de OhmRoyal.",
};

export default function BlogPage() {
  return <BlogSection />;
}
