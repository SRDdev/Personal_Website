import { ExternalLink } from "lucide-react";
import type { ResearchItem } from "../data/research";

export function ResearchContribution({ items }: { items: ResearchItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {items.map((item) => (
        <article
          key={`${item.title}-${item.year}`}
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-zinc-950/30 dark:hover:border-gray-700"
        >
          <header className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-base font-semibold text-black dark:text-white leading-snug">
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

          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {item.overview}
          </p>

          {(item.abstract ||
            (item.contributions && item.contributions.length > 0)) && (
            <details className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-zinc-900/30">
              <summary className="cursor-pointer select-none text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                Detailed breakdown
              </summary>

              <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.contributions && item.contributions.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Contributions
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {item.contributions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {item.abstract && (
                  <section>
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Abstract
                    </h3>
                    <p>{item.abstract}</p>
                  </section>
                )}
              </div>
            </details>
          )}
        </article>
      ))}
    </div>
  );
}
