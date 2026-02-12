"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, FileText } from "lucide-react";

interface ResearchItemProps {
  title: string;
  venue: string; // e.g., "CVPR 2025" or "arXiv"
  date: string;
  authors: string;
  children: React.ReactNode; // The Abstract
  link?: string;
  tags?: string[]; // e.g. ["Patent", "Best Paper"]
}

export function ResearchItem({
  title,
  venue,
  date,
  authors,
  children,
  link,
  tags,
}: ResearchItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative border-l-2 border-transparent pl-4 transition-all hover:border-gray-200 dark:hover:border-gray-800">
      
      {/* Header Section */}
      <div className="mb-2 flex flex-col gap-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <h3 className="font-medium text-black dark:text-white leading-tight">
            {title}
          </h3>
          <span className="shrink-0 text-xs font-mono text-gray-400 dark:text-gray-500">
            {date}
          </span>
        </div>

        {/* Venue & Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-gray-600 dark:text-gray-400">
            {venue}
          </span>
          {tags && tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
              {tag}
            </span>
          ))}
          {link && (
            <>
              <span className="text-gray-300">•</span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-2"
              >
                View Paper <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
        </div>

        {/* Authors */}
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {authors}
        </p>
      </div>

      {/* Abstract / Body */}
      <div className="relative mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <div
          className={`transition-all duration-300 ${
            !isExpanded ? "max-h-20 overflow-hidden" : ""
          }`}
        >
          {children}
        </div>
        
        {/* Gradient Overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-black to-transparent" />
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      >
        {isExpanded ? (
          <>
            Hide Abstract <ChevronUp className="h-3 w-3" />
          </>
        ) : (
          <>
            Read Abstract <ChevronDown className="h-3 w-3" />
          </>
        )}
      </button>
    </div>
  );
}