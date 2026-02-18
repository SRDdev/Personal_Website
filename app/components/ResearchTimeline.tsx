import { ExternalLink } from "lucide-react";
import type { ResearchItem } from "../data/research";

export function ResearchTimeline({ items }: { items: ResearchItem[] }) {
  const sorted = [...items].sort((a, b) => a.year - b.year);

  return (
    <div className="relative pl-5">
      <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200 dark:bg-gray-800" />

      <div className="space-y-6">
        {sorted.map((item) => (
          <article key={`${item.title}-${item.year}`} className="relative">
            <div className="absolute left-0 top-6 h-3 w-3 rounded-full border border-gray-300 bg-white dark:border-gray-700 dark:bg-black" />

            <div className="ml-6 rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm transition-colors hover:bg-gray-200 hover:border-gray-300 dark:border-gray-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                {item.image && (
                  <div className="shrink-0">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        loading="lazy"
                        className={
                          item.image.fit === "contain"
                            ? "h-full w-full object-contain p-2"
                            : "h-full w-full object-cover"
                        }
                        style={{ filter: "none" }}
                      />
                    </div>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <header className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h2 className="text-sm font-semibold text-black dark:text-white leading-snug">
                        {item.title}
                      </h2>
                      <span className="shrink-0 text-xs font-mono text-gray-400 dark:text-gray-500">
                        {item.dateLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-gray-600 dark:text-gray-400">
                        {item.venue}
                      </span>

                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800"
                        >
                          {tag}
                        </span>
                      ))}

                      {item.links && item.links.length > 0 && (
                        <>
                          <span className="text-gray-300 dark:text-gray-700">•</span>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {item.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors underline underline-offset-2"
                              >
                                {link.label} <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {item.authors}
                    </p>
                  </header>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.overview}
                  </p>

                  {(item.contributions && item.contributions.length > 0) && (
                    <section className="mt-4">
                      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Contributions
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {item.contributions.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {item.abstract && (
                    <section className="mt-4">
                      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Abstract
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {item.abstract}
                      </p>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
