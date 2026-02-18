"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ProjectCard"; 

import openclTransformers from "../assets/projects/OpenCL_Transformers.png";
import paligemma from "../assets/projects/paligemma.jpg";
import bitnet from "../assets/projects/BitNet.png";
import gitmentor from "../assets/projects/gitmentor.png";
import swin from "../assets/projects/SwinTransformer.png";
import palm from "../assets/projects/PALM.png";
import sam6d from "../assets/projects/SAM6D.gif";
import clip from "../assets/projects/clip.png";
import accent from "../assets/projects/accent-conversion.png";
import youtubeLlama from "../assets/projects/llama.png";
import flanMedical from "../assets/projects/flan-5.jpg";
import yolov9 from "../assets/projects/MultiheadedYolov9.png";
import vit from "../assets/projects/Script.jpg";

// 1. UPDATED INTERFACE: This must match what you send to ProjectCard
interface Repo {
  id: number;
  name: string;
  description: string;
  stars: number;    // Changed from stargazers_count
  forks: number;    // Changed from forks_count
  language: string;
  link: string;     // Changed from html_url
  image: string;
  links?: { label: string; href: string }[];
}

type CuratedProject = {
  repo: string;
  name?: string;
  image: string;
  links?: { label: string; href: string }[];
};

const curated: CuratedProject[] = [
  {
    repo: "OpenCL-Zero-to-Transformer",
    image: openclTransformers.src,
  },
  {
    repo: "PaliGemma",
    image: paligemma.src,
  },
  {
    repo: "BitVision",
    name: "BitNet (BitVision / BitText)",
    image: bitnet.src,
    links: [
      { label: "BitVision", href: "https://github.com/SRDdev/BitVision" },
      { label: "BitText", href: "https://github.com/SRDdev/BitText" },
    ],
  },
  {
    repo: "GitMentor",
    image: gitmentor.src,
  },
  {
    repo: "SwinTransformer",
    image: swin.src,
  },
  {
    repo: "PaLM-RLHF",
    image: palm.src,
  },
  {
    repo: "SAM6D",
    image: sam6d.src,
  },
  {
    repo: "OpenAI-CLIP",
    image: clip.src,
  },
  {
    repo: "Accent-Conversion",
    image: accent.src,
  },
  {
    repo: "YouTube-Llama",
    image: youtubeLlama.src,
  },
  {
    repo: "Finetune-flan-t5-medical",
    image: flanMedical.src,
  },
  {
    repo: "Multi-Head-Yolov9",
    image: yolov9.src,
  },
  {
    repo: "Vision-Transformer",
    image: vit.src,
  },
];

export function ProjectSection() {
  const [projects, setProjects] = useState<Repo[]>([]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch("https://api.github.com/users/SRDdev/repos?per_page=100");
        const data = await response.json();
        const byName = new Map<string, any>(
          Array.isArray(data) ? data.map((r: any) => [r.name, r]) : []
        );

        const formatted: Repo[] = curated.map((c, idx) => {
          const repo = byName.get(c.repo);
          if (!repo) {
            return {
              id: -1 - idx,
              name: c.name || c.repo,
              description: "GitHub repository.",
              stars: 0,
              forks: 0,
              language: "—",
              link: `https://github.com/SRDdev/${c.repo}`,
              image: c.image,
              links: c.links,
            };
          }

          return {
            id: repo.id,
            name: c.name || repo.name,
            description: repo.description || "Experimental AI/ML project.",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            link: repo.html_url,
            language: repo.language || "Python",
            image: c.image,
            links: c.links,
          };
        });

        setProjects(formatted);
      } catch (e) {
        console.error("Failed to fetch GitHub projects", e);
      }
    }
    fetchRepos();
  }, []);

  return (
    <div className="mb-16 w-full">
      <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-widest text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200">
        Selected Projects
      </h2>
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div 
          className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]"
          style={{ animationDuration: "90s" }} 
        >
          <div className="flex gap-8 py-4 pr-8">
            {projects.map((project) => (
              // 3. SUCCESS: {...project} now works because the types match exactly
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
          <div className="flex gap-8 py-4 pr-8">
            {projects.map((project) => (
              <ProjectCard key={`${project.id}-clone`} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
