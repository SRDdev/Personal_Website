"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";

// --- Types ---
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
}

// --- Fallback Data (Matches your provided Medium links) ---
const FALLBACK_POSTS: BlogPost[] = [
  {
    title: "Why Unused Data Makes GPU Kernels Fly",
    excerpt: "A CUDA row-stride experiment that cut naive GEMM latency by 31.1% without changing the mathematical operation.",
    date: "Nov 1, 2026",
    image: "/blog/cuda-padding-experiment/title.png",
    link: "/blog/cuda-padding-experiment"
  },
  {
    title: "Prefill vs. Decode: What an LLM Is Really Doing on the GPU",
    excerpt: "A first-principles look at prefill, decode, KV caching, attention IO, and the CUDA kernels underneath LLM inference.",
    date: "In progress",
    image: "/blog/prefill-vs-decode/prefill-vs-decode-overview.png",
    link: "/blog/prefill-vs-decode"
  },
  {
    title: "Gradients and Parameters: Monitoring Models at Scale",
    excerpt: "Breaking down the two key components of neural networks: parameters (the model's memory) and gradients (the learning signal).",
    date: "Aug 4, 2025",
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*PdwlC2nFVq7teWn1FjtzQA.png", // Valid placeholder or actual Medium image
    link: "https://medium.com/@srddev/gradients-and-parameters-7f9f20d56b83"
  },
  {
    title: "PaliGemma: The Future of Vision-Language AI",
    excerpt: "An intuitive dive into PaliGemma's architecture and capabilities, exploring how modern VLMs bridge the gap between vision and language.",
    date: "Dec 22, 2024",
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*7y2h5TqL5g5y2h5TqL5g5w.png", // Replace with actual hero image if available
    link: "https://medium.com/@srddev/paligemma-the-future-of-vision-language-ai-d44cfbdb10f5"
  },
  {
    title: "Understanding Multi-Headed YOLOv9",
    excerpt: "A comprehensive guide to Object Detection and Segmentation using YOLOv9, analyzing its backbone, neck, and head architecture.",
    date: "May 20, 2024",
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*PostImagePlaceholder.png",
    link: "https://medium.com/@srddev/understanding-multi-headed-yolo-v9-for-object-detection-and-segmentation-8923ee21b652"
  },
  {
    title: "Swin Transformers for Semantic Segmentation",
    excerpt: "Understanding and coding Swin Transformers from scratch. A deep dive into shifted windows and hierarchical feature maps.",
    date: "Apr 9, 2024",
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*SwinTransformer.png",
    link: "https://medium.com/@srddev/swin-transformers-for-semantic-segmentation-part-1-bd85bad7e051"
  }
];

function extractImageUrl(html: unknown): string | undefined {
  if (typeof html !== "string") {
    return undefined;
  }

  const srcMatch = html.match(
    /<(?:img|source)[^>]+(?:src|data-src)\s*=\s*["']([^"']+)["']/i
  );
  if (srcMatch?.[1]) {
    return srcMatch[1].replace(/&amp;/g, "&");
  }

  const srcSetMatch = html.match(/srcset\s*=\s*["']([^"']+)["']/i);
  return srcSetMatch?.[1]?.split(",")[0]?.trim().split(" ")[0];
}

function getMediumImage(item: any): string {
  const candidates = [
    typeof item.thumbnail === "string" ? item.thumbnail : undefined,
    extractImageUrl(item.content),
    extractImageUrl(item.description),
  ];

  return candidates.find((candidate) => candidate?.trim()) || "/projects/default.svg";
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

  // --- Auto-Fetch Logic ---
  useEffect(() => {
    const fetchMediumPosts = async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);

      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@srddev",
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error(`Medium feed request failed with ${res.status}`);
        }
        const data = await res.json();

        if (data.status === "ok" && data.items.length > 0) {
          const formattedPosts = data.items.map((item: any) => {
            // Strip HTML from description for a clean excerpt
            const textContent = (item.description || "")
              .replace(/<[^>]*>?/gm, "")
              .substring(0, 120) + "...";

            return {
              title: item.title,
              excerpt: textContent,
              date: new Date(item.pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              image: getMediumImage(item),
              link: item.link,
            };
          });
          const fetchedLinks = new Set(formattedPosts.map((post: BlogPost) => post.link));
          setPosts([
            ...FALLBACK_POSTS.filter((post) => post.link.startsWith("/")),
            ...formattedPosts,
            ...FALLBACK_POSTS.filter(
              (post) => post.link.startsWith("http") && !fetchedLinks.has(post.link)
            ),
          ]);
        }
      } catch {
        // The local fallback is intentional: the homepage must still work when
        // the third-party RSS proxy is unavailable, blocked, or rate-limited.
      } finally {
        window.clearTimeout(timeout);
      }
    };

    fetchMediumPosts();
  }, []);

  return (
    <div className="mb-16 w-full text-justify">
      <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-widest text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200">
        Writings & Blogs
      </h2>

      <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
        I host my thoughts on{" "}
        <a
          href="https://medium.com/@srddev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black dark:text-white underline underline-offset-4 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
        >
          Medium
        </a>{" "}
        to share insights on AI systems, product strategy, and technical architecture.
      </p>

      {/* Grid Layout mimicking the Video Section Style */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {posts.map((post, index) => (
          <a
            key={`${post.link}-${index}`}
            href={post.link}
            target={post.link.startsWith("http") ? "_blank" : undefined}
            rel={post.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group block w-full space-y-3 cursor-pointer"
          >
            {/* 16:9 Image Container - Grayscale to Color Interaction */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950 shadow-sm transition-all duration-500 hover:shadow-md">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/projects/default.svg";
                }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Optional: "Read" Badge overlay (mimicking the play button feel subtly) */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <BookOpen className="h-3 w-3" />
                <span>{post.link.startsWith("http") ? "Read on Medium" : "Read article"}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-black dark:text-white group-hover:underline group-hover:underline-offset-4 decoration-gray-300 dark:decoration-gray-700 transition-colors">
                  {post.title}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                </h3>
              </div>
              
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                {post.date}
              </p>
              
              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {post.excerpt}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
