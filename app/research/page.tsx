import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { ResearchTimeline } from "../components/ResearchTimeline";
import { RESEARCH_ITEMS } from "../data/research";

export const metadata: Metadata = {
  title: "Research Contributions | Shreyas Dixit",
  description:
    "A deeper dive into my research work, publications, and patents across AI, security, and accessibility.",
};

export default function ResearchPage() {
  const items = [...RESEARCH_ITEMS];

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white dark:bg-black px-3 pt-16 text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black pb-32 sm:px-4 sm:pt-24 sm:pb-40 overflow-x-hidden transition-colors duration-300">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="flex w-full max-w-5xl flex-col items-start px-4 sm:px-0">
        <div className="mb-8 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Research Contributions
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            A deeper dive into the problems I care about (accessibility, security, and AI forensics) and the work I’ve done across papers, benchmarks, and a granted patent.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>H-Index: 3</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span>Total Citations: 21+</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <a
              href="https://scholar.google.com/citations?user=pl_o-VUAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors"
            >
              Google Scholar <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="w-full">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Timeline
          </h2>
          <ResearchTimeline items={items} />
        </div>
      </main>
    </div>
  );
}
