"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ProjectCard"; // Adjust path if needed

// Map your GitHub repo names to your local file names
const LOCAL_IMAGES: Record<string, string> = {
  "EchoSense": "/projects/echosense.svg",
  "HingFlow": "/projects/hingflow.svg",
  "Neural-Translation": "/projects/neural-translation.svg",
  "PaliGemma": "/projects/paligemma.svg", 
  "YouTube-Llama": "/projects/youtube-llama.svg",
};

const DEFAULT_SVG = "/projects/default.svg";

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  image: string;
}

export function ProjectSection() {
  const [projects, setProjects] = useState<Repo[]>([]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch("https://api.github.com/users/SRDdev/repos?sort=updated&per_page=12");
        const data = await response.json();
        
        const featured = ["EchoSense", "HingFlow", "YouTube-Llama", "Neural-Translation", "PaliGemma"];
        
        const formatted = data
          .sort((a: any, b: any) => {
             if (featured.includes(a.name)) return -1;
             if (featured.includes(b.name)) return 1;
             return b.stargazers_count - a.stargazers_count;
          })
          .map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || "Experimental AI/ML project.",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || "Python",
            html_url: repo.html_url,
            link: repo.html_url,
            // LOGIC: Use local SVG if exists, otherwise use default.svg
            image: LOCAL_IMAGES[repo.name] || DEFAULT_SVG
          }));

        setProjects(formatted);
      } catch (e) {
        console.error("Failed to fetch GitHub projects", e);
      }
    }
    fetchRepos();
  }, []);

  return (
    <div className="mb-16 w-full">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Selected Projects
      </h2>
      
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div 
          className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]"
          style={{ animationDuration: "90s" }} 
        >
          {/* Main Loop */}
          <div className="flex gap-8 py-4 pr-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
          {/* Seamless Loop Clone */}
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