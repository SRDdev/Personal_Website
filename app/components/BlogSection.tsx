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

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

  // --- Auto-Fetch Logic ---
  useEffect(() => {
    const fetchMediumPosts = async () => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@srddev"
        );
        const data = await res.json();

        if (data.status === "ok" && data.items.length > 0) {
          const formattedPosts = data.items.map((item: any) => {
            // Regex to find the first image in the content content
            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
            // Use thumbnail, or extracted image, or a fallback
            const image = item.thumbnail || (imgMatch ? imgMatch[1] : FALLBACK_POSTS[0].image);
            
            // Strip HTML from description for a clean excerpt
            const textContent = item.description.replace(/<[^>]*>?/gm, "").substring(0, 120) + "...";

            return {
              title: item.title,
              excerpt: textContent,
              date: new Date(item.pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              image: image,
              link: item.link,
            };
          });
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch Medium posts, using fallback.", error);
      }
    };

    fetchMediumPosts();
  }, []);

  return (
    <div className="mb-16 w-full text-justify">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
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
            key={index}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full space-y-3 cursor-pointer"
          >
            {/* 16:9 Image Container - Grayscale to Color Interaction */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950 shadow-sm transition-all duration-500 hover:shadow-md">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              
              {/* Optional: "Read" Badge overlay (mimicking the play button feel subtly) */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <BookOpen className="h-3 w-3" />
                <span>Read on Medium</span>
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