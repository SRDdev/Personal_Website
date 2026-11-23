"use client";

import { useEffect, useState } from "react";

const GOATCOUNTER_SITE = "https://shreyas.goatcounter.com";

export default function BlogViewCount({ path }: { path: string }) {
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${GOATCOUNTER_SITE}/counter/${encodeURIComponent(path)}.json`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count?: string } | null) => {
        if (data?.count) setCount(data.count);
      })
      .catch(() => {
        // The view badge is non-essential; keep the article usable if blocked.
      });

    return () => controller.abort();
  }, [path]);

  return (
    <span
      className="rounded-full border border-gray-200 px-3 py-1 normal-case tracking-normal dark:border-zinc-800"
      aria-label={count ? `${count} views` : "View count loading"}
    >
      {count ? `${count} views` : "Views …"}
    </span>
  );
}
