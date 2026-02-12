"use client";

import { Github, Star, GitFork, Code2, ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  link: string;
  image: string;
}

export function ProjectCard({ name, description, stars, forks, language, link, image }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[300px] shrink-0 snap-start cursor-pointer sm:w-[400px]"
    >
      <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950 shadow-sm transition-all duration-500 hover:shadow-md">
        <div
          className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
          style={{ aspectRatio: "16 / 9" }}
        >
          <img
            src={imgSrc}
            alt={name}
            loading="lazy"
            decoding="async"
            // We removed referrerPolicy since we are loading local assets now
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              // Fallback to local default SVG if the specific SVG is missing/broken
              setImgSrc("/projects/default.svg");
            }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Github className="h-3 w-3" />
            <span>Source</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <Code2 className="h-3 w-3" /> {language}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" /> {stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" /> {forks}
          </span>
        </div>
        
        <h3 className="flex items-start justify-between gap-2 text-lg font-bold text-black dark:text-white group-hover:underline decoration-gray-400 underline-offset-4">
          <span className="line-clamp-2 leading-tight">{name}</span>
          <ArrowUpRight className="shrink-0 h-4 w-4 mt-1 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </h3>
        
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </a>
  );
}