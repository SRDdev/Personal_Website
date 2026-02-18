"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestResearchItems } from "../data/research";

export function ResearchPreviewSection({ count = 3 }: { count?: number }) {
  const items = getLatestResearchItems(count);

  return (
    <section className="mb-16 w-full text-justify">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Research Publications
      </h2>

      <div className="space-y-6">
        <div className="space-y-5">
          {items.map((item) => (
            <div
              key={`${item.title}-${item.year}`}
              className="group border-l-2 border-gray-200 pl-4 transition-colors hover:border-black dark:border-gray-800 dark:hover:border-white"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-sm font-semibold text-black dark:text-white leading-snug">
                  {item.title}
                </h3>
                <span className="shrink-0 text-xs font-mono text-gray-400 dark:text-gray-500">
                  {item.dateLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {item.venue}
                </span>{" "}
                <span className="text-gray-300 dark:text-gray-700">•</span>{" "}
                {item.overview}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3">
          <Link
            href="/research"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black dark:bg-gray-100 dark:text-black dark:hover:bg-white"
          >
            Read detailed research contributions <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Showing the latest {items.length} items.
          </p>
        </div>
      </div>
    </section>
  );
}
