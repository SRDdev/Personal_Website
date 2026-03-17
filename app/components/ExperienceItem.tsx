"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";

export function ExperienceItem({
  title,
  role,
  date,
  children,
  collapsible = false,
  link,
  collapsedHeight = "max-h-24",
}: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full border-b border-gray-200 dark:border-zinc-800 pb-10 mb-10">

      {/* Header */}
      <div className="flex flex-col gap-1">

        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
            {title}
          </h3>

          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight className="h-4 w-4 text-gray-400 hover:text-black dark:hover:text-white"/>
            </a>
          )}
        </div>

        <div className="text-lg text-gray-600 dark:text-gray-300">
          {role}
        </div>

        <div className="text-xs uppercase tracking-widest text-gray-400">
          {date}
        </div>

      </div>

      {/* Content */}
      <div
        className={`mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
          !expanded && collapsible ? `${collapsedHeight} overflow-hidden` : ""
        }`}
      >
        {children}
      </div>

      {collapsible && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1"
        >
          {expanded ? (
            <>View Less <ChevronUp size={12} /></>
          ) : (
            <>View More <ChevronDown size={12} /></>
          )}
        </button>
      )}
    </div>
  );
}