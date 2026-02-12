"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ProjectCard"; 

const LOCAL_IMAGES: Record<string, string> = {
  "EchoSense": "/projects/echosense.svg",
  "HingFlow": "/projects/hingflow.svg",
  "Neural-Translation": "/projects/neural-translation.svg",
  "PaliGemma": "/projects/paligemma.svg", 
  "YouTube-Llama": "/projects/youtube-llama.svg",
};

const DEFAULT_SVG = "/projects/default.svg";

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
}

export function ProjectSection() {
  const [projects, setProjects] = useState<Repo[]>([]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch("https://api.github.com/users/SRDdev/repos?sort=updated&per_page=12");
        const data = await response.json();
        
        const featured = ["EchoSense", "HingFlow", "YouTube-Llama", "Neural-Translation", "PaliGemma"];
        
        const formatted: Repo[] = data
        .sort((a: any, b: any) => {
          if (featured.includes(a.name)) return -1;
          if (featured.includes(b.name)) return 1;
          return b.stargazers_count - a.stargazers_count;
        })
        .map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "Experimental AI/ML project.",
          // 2. MAPPING: Renaming keys to match the new Repo interface
          stars: repo.stargazers_count,  
          forks: repo.forks_count,       
          link: repo.html_url,           
          language: repo.language || "Python",
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