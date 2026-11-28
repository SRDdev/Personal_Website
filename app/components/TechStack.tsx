"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
    name: string;
    slug?: string;
    iconUrl?: string;
    badge?: string;
}

const categories: { name: string; skills: Skill[] }[] = [
    {
        name: "GPU Compute & Languages",
        skills: [
            { name: "CUDA C++", slug: "nvidia" },
            {
                name: "OpenCL",
                iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqCIB1wZAShavowvsPTca-ruCjqxi38r5D0NJ6yCpOYItVTaUDZJ0UZCs&s=10",
            },
            { name: "Vulkan", slug: "vulkan" },
            { name: "Triton", badge: "TR" },
            { name: "C++", slug: "cplusplus" },
            { name: "Python", slug: "python" },
            { name: "SQL", slug: "postgresql" },
        ]
    },
    {
        name: "Inference Runtimes & Engines",
        skills: [
            { name: "TensorRT", slug: "nvidia" },
            { name: "vLLM", badge: "vL" },
            { name: "ONNX Runtime", slug: "onnx" },
            {
                name: "LiteRT",
                iconUrl: "https://imgs.search.brave.com/HMzt_1YdW7siNH9R9rB5skA08S6mfqLulyb1ICC77eo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9yYXcu/Z2l0aHVidXNlcmNv/bnRlbnQuY29tL2dv/b2dsZS1haS1lZGdl/L0xpdGVSVC9tYWlu/L2RvY3Mvc291cmNl/cy9saXRlcnRfbG9n/by5wbmc",
            },
            {
                name: "ExecuTorch",
                iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTifKJ3ziEij3E-xK2kNJMrEmgb7jJIblklxBjhJNGGDQ&s=10",
            },
            { name: "MLDrift", badge: "MD" },
        ]
    },
    {
        name: "AI, Vision & Data",
        skills: [
            { name: "PyTorch", slug: "pytorch" },
            { name: "TensorFlow", slug: "tensorflow" },
            { name: "Hugging Face", slug: "huggingface" },
            { name: "LangChain", slug: "langchain" },
            { name: "OpenCV", slug: "opencv" },
            { name: "Scikit-learn", slug: "scikitlearn" },
            { name: "Pandas", slug: "pandas" },
            { name: "NumPy", slug: "numpy" },
        ]
    },
    {
        name: "Profiling & Backend",
        skills: [
            {
                name: "Nsight Compute",
                iconUrl: "https://developer.download.nvidia.com/images/nvidia-nsight-systems-icon-gbp-shaded-256.png",
            },
            { name: "FastAPI", slug: "fastapi" },
            { name: "MongoDB", slug: "mongodb" },
        ]
    },
    {
        name: "Cloud & Infra",
        skills: [
            { name: "Docker", slug: "docker" },
            { name: "Kubernetes", slug: "kubernetes" },
            { name: "Google Cloud", slug: "googlecloud" },
            { name: "Linux", slug: "linux" },
            { name: "Git", slug: "git" },
        ]
    }
];

const marqueeSkills = categories.flatMap(c => c.skills).filter((s): s is Skill => Boolean(s.slug || s.iconUrl));

export function TechStack() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300"
                >
                    {isExpanded ? "Show Less" : "View Full Stack"}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="marquee"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                    >
                        <div className="flex w-max animate-infinite-scroll">
                            <div className="flex gap-12 py-4 pr-12">
                                {marqueeSkills.map((tech, index) => (
                                    <div key={index} className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 transition-all duration-300">
                                            <img
                                                src={tech.iconUrl ?? `https://cdn.simpleicons.org/${tech.slug}`}
                                                alt={tech.name}
                                                className={`h-full w-full object-contain opacity-80 hover:opacity-100 transition-all duration-300 ${
                                                    tech.iconUrl
                                                        ? "grayscale hover:grayscale-0 rounded-sm"
                                                        : "brightness-0 hover:brightness-100 dark:brightness-0 dark:invert dark:hover:invert-0 dark:hover:brightness-100"
                                                }`}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-12 py-4 pr-12">
                                {marqueeSkills.map((tech, index) => (
                                    <div key={index + marqueeSkills.length} className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 transition-all duration-300">
                                            <img
                                                src={tech.iconUrl ?? `https://cdn.simpleicons.org/${tech.slug}`}
                                                alt={tech.name}
                                                className={`h-full w-full object-contain opacity-80 hover:opacity-100 transition-all duration-300 ${
                                                    tech.iconUrl
                                                        ? "grayscale hover:grayscale-0 rounded-sm"
                                                        : "brightness-0 hover:brightness-100 dark:brightness-0 dark:invert dark:hover:invert-0 dark:hover:brightness-100"
                                                }`}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-4">
                            {categories.map((category) => (
                                <div key={category.name} className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-zinc-800 pb-2">
                                        {category.name}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {category.skills.map((skill) => (
                                            <div
                                                key={skill.name}
                                                className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-gray-100 dark:hover:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/50"
                                            >
                                                <div className="h-5 w-5 shrink-0 transition-all duration-300 flex items-center justify-center">
                                                    {skill.iconUrl || skill.slug ? (
                                                        <img
                                                            src={skill.iconUrl ?? `https://cdn.simpleicons.org/${skill.slug}`}
                                                            alt={skill.name}
                                                            className={`h-full w-full object-contain opacity-50 group-hover:opacity-100 transition-all duration-300 ${
                                                                skill.iconUrl
                                                                    ? "grayscale group-hover:grayscale-0 rounded-sm"
                                                                    : "brightness-0 group-hover:brightness-100 dark:brightness-0 dark:invert dark:group-hover:invert-0 dark:group-hover:brightness-100"
                                                            }`}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 font-mono text-[9px] font-bold text-gray-700 group-hover:bg-black group-hover:text-white dark:bg-zinc-800 dark:text-gray-300 dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                                            {skill.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}