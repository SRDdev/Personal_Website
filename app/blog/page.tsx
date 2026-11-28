import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { BlogSection } from "../components/BlogSection";

export const metadata: Metadata = {
  title: "Writings & Blogs | Shreyas Dixit",
  description:
    "All technical articles and engineering notes on CUDA kernels, quantization, inference engineering, and AI systems.",
};

export default function BlogIndexPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white dark:bg-black px-3 pt-16 text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black pb-32 sm:px-4 sm:pt-24 sm:pb-40 overflow-x-hidden transition-colors duration-300">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="flex w-full max-w-5xl flex-col items-start px-4 sm:px-0">
        <div className="mb-10 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Writings &amp; Blogs
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Engineering deep dives on GPU kernels, quantization, inference optimization, and AI systems.
          </p>
        </div>

        <BlogSection limit={0} showHeader={false} />
      </main>
    </div>
  );
}
