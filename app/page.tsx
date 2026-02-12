"use client";

import Image from "next/image";
import { Github, Linkedin, Youtube, Calendar, Bot, User, QrCode, X, ArrowRight, Music, Pause, FileText, BookOpen, Mail, ArrowUpRight } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { ExperienceItem } from "./components/ExperienceItem";
import { GithubGraph } from "./components/GithubGraph";
import { TechStack } from "./components/TechStack";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { QRCodeSVG } from "qrcode.react";
import { ThemeToggle } from "./components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

import { PomodoroTimer } from "./components/PomodoroTimer";
import { NeuralNetworkSim } from "./components/NeuralNetworkSim";

import { getMarkdownContent } from "./data/content";
import { ResearchItem } from "./components/ResearchItem";
import { BlogSection } from "./components/BlogSection";
import { ProjectSection } from "./components/ProjectSection";
import me_image from "./assets/me.png";

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<"human" | "agent">("human");

  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const markdownContent = getMarkdownContent(time);

  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [lofiVolume, setLofiVolume] = useState(1);
  const lofiRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (lofiRef.current) {
      lofiRef.current.volume = lofiVolume;
    }
  }, [lofiVolume]);

  useEffect(() => {
    return () => {
      if (lofiRef.current) {
        lofiRef.current.pause();
        lofiRef.current = null;
      }
    };
  }, []);

  const toggleLofi = () => {
    if (!lofiRef.current) {
      lofiRef.current = new Audio("/lofi.mp3");
      lofiRef.current.loop = true;
      lofiRef.current.volume = lofiVolume;
    }

    if (isLofiPlaying) {
      lofiRef.current.pause();
    } else {
      lofiRef.current.play().catch(e => console.error("Lofi play failed:", e));
    }
    setIsLofiPlaying(!isLofiPlaying);
  };

  const starPositions = useMemo(() => {
    return [...Array(50)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className={`relative flex min-h-screen flex-col items-center bg-white dark:bg-black px-3 pt-16 text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black pb-32 sm:px-4 sm:pt-24 sm:pb-40 overflow-x-hidden transition-colors duration-300`}>
      {/* Easter Egg Effects */}
      <AnimatePresence> 
        {showEasterEgg && (
          <>
            {/* Bluish Aura Edge Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] pointer-events-none shadow-[inset_0_0_150px_rgba(29,78,216,0.5)] dark:shadow-[inset_0_0_150px_rgba(59,130,246,0.4)] transition-opacity duration-1000"
            />
            {/* Twinkling Stars Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
            >
              {starPositions.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[2px] w-[2px] bg-blue-500 dark:bg-white rounded-full shadow-[0_0_4px_rgba(59,130,246,0.8)] dark:shadow-[0_0_3px_white]"
                  style={{
                    top: pos.top,
                    left: pos.left,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: pos.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: pos.delay,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Theme Toggle in Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
        {mode === "agent" ? (
          /* Agent Mode - Markdown View */
          <motion.main
            key="agent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-start text-justify px-4 sm:px-0"
          >
            <pre
              className="w-full whitespace-pre-wrap font-mono text-sm leading-relaxed text-black dark:text-gray-300 selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black antialiased"
              style={{ fontFamily: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Console", monospace' }}
            >
              {markdownContent}
            </pre>
          </motion.main>
        ) : (
          /* Human Mode - Original View */
          <motion.main
            key="human"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-center text-center"
          >
            {/* Profile Image - Easter Egg Trigger */}
            <button
              onClick={() => setShowEasterEgg(!showEasterEgg)}
              className="group relative mb-2 h-40 w-40 grayscale filter sm:h-56 sm:w-56 overflow-hidden cursor-pointer transition-all duration-500 hover:grayscale-0 active:scale-95"
              aria-label="Toggle Aura Mode"
            >
              <Image
                src={me_image} // User's photo
                alt="Profile"
                fill
                className={`object-contain transition-all duration-700 ${showEasterEgg ? 'grayscale-0 scale-105' : 'grayscale'}`}
                priority
              />
              
              {/* Bottom Fade (Gradient to Top) */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 backdrop-blur-[1px] pointer-events-none" />
              
              {/* Top Fade (Gradient to Bottom) */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white via-white/60 to-transparent dark:from-black dark:via-black/60 backdrop-blur-[1px] pointer-events-none" />
              
              {/* Left Fade (Gradient to Right) */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/60 to-transparent dark:from-black dark:via-black/60 backdrop-blur-[1px] pointer-events-none" />
              
              {/* Right Fade (Gradient to Left) */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/60 to-transparent dark:from-black dark:via-black/60 backdrop-blur-[1px] pointer-events-none" />

              {/* Subtle Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)] rounded-full pointer-events-none" />
            </button>

            {/* Hero Text */}
            <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl">
              Shreyas Dixit
            </h1>

            {/* Phonetic Pronunciation & Metadata */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
              <span>/ˈʃreɪ.jəs rɑːˈdʒen.drə dɪk.ʃɪt/</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span>noun</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums text-xs sm:text-sm">{time || "00:00:00"}</span>
                  <span className="text-[10px] uppercase tracking-wider sm:text-xs">IST</span>
                </div>

                <span className="text-gray-300 dark:text-gray-700">•</span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">lofi</span>
                  <button
                    onClick={toggleLofi}
                    className="flex h-5 w-5 items-center justify-center rounded-full transition-all hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-black dark:hover:text-white"
                    aria-label={isLofiPlaying ? "Pause Lofi" : "Play Lofi"}
                  >
                    {isLofiPlaying ? <Pause size={10} fill="currentColor" /> : <Music size={10} />}
                  </button>
                  <AnimatePresence>
                    {isLofiPlaying && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 40, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex h-5 items-center overflow-hidden"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={lofiVolume}
                          onChange={(e) => setLofiVolume(parseFloat(e.target.value))}
                          className="h-[2px] w-8 cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-zinc-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400 dark:[&::-webkit-slider-thumb]:bg-zinc-500 hover:[&::-webkit-slider-thumb]:bg-black dark:hover:[&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-400 dark:[&::-moz-range-thumb]:bg-zinc-500 hover:[&::-moz-range-thumb]:bg-black dark:hover:[&::-moz-range-thumb]:bg-white transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 text-justify text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
              <p>
                A Machine Learning Engineer and <a href="https://en.wikipedia.org/wiki/Deep_learning" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors">Deep Learning Researcher</a> specializing in Multimodal AI, Generative AI, and building accessible technology.
              </p>
              <p>
                An <a href="https://en.wikipedia.org/wiki/Artificial_intelligence_for_social_good" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors">AI advocate</a> who bridges the gap between advanced research and real-world impact, dedicated to empowering lives through intelligent solutions.
              </p>
            </div>

            <NeuralNetworkSim />


            {/* Experience Section */}
            <div className="mb-16 w-full text-justify leading-relaxed">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Experience
              </h2>

              <div className="space-y-12">

                <ExperienceItem
                  title="AI Engineer"
                  role="Techolution, Hyderabad"
                  date="June 2024 - Present"
                  collapsible={true}
                  link="https://www.techolution.com/"
                >
                  <div className="space-y-2">
                    <p>
                      Lead the development of end-to-end AI systems for Embodied AI,
                      integrating computer vision, kinematics, and real-time inference backends.
                    </p>
                    <p>
                      Designed and implemented an AI pipeline for a dexterous robotic arm
                      achieving <span className="font-medium">97% task accuracy</span> and{" "}
                      <span className="font-medium">2mm precision</span> for object manipulation
                      tasks under challenging conditions like fog and occlusions.
                    </p>
                    <p>
                      Developed the{" "}
                      <span className="font-medium">AI-Hand Bartender system</span>,
                      enabling autonomous serving through sequence learning and object
                      detection, and created a novel video-based learning mechanism to
                      extract 6D pose data from human demonstrations.
                    </p>
                    <p>
                      Explored reinforcement learning (RL) in NVIDIA Isaac Sim using
                      algorithms like ALOHA and Diffusion Policy, and implemented real-time
                      camera calibration requiring only six examples.
                    </p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="AI Researcher"
                  role="Artificial Intelligence Institute of South Carolina (AIISC)"
                  date="May 2024 - Present"
                  collapsible={true}
                  link=""
                >
                  <div className="space-y-2">
                    <p>
                      Engaged in research on computer vision, AI detectability, and LLM
                      hallucination, focusing on watermarking techniques and provenance layers.
                    </p>
                    <p>
                      Developing <span className="font-medium">"Peccavi"</span>, a visual
                      paraphrase attack-safe watermarking technique to ensure traceability
                      and authenticity of synthetic media.
                    </p>
                    <p>
                      Served as Associate Organizer of the{" "}
                      <span className="font-medium">
                        Defactify 4.0 workshop at AAAI 2025
                      </span>, under the guidance of Dr. Amitava Das to enhance AI robustness.
                    </p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="Deep Learning Researcher"
                  role="Dassault Systèmes , Pune"
                  date="Nov 2023 - May 2024"
                  collapsible={true}
                  link=""
                >
                  <div className="space-y-2">
                    <p>
                      Developed a <span className="font-medium">Stutter Detection</span>
                      system utilizing Wav2Vec2 and Agnostic BERT to detect stuttering
                      timestamps and compute percentages.
                    </p>
                    <p>
                      Trained models on Indian datasets achieving a{" "}
                      <span className="font-medium">WER of 0.31</span>, and built an
                      accessible front-end application for on-device deployment.
                    </p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="President & Head of ML"
                  role="Microsoft Learn Student Club (MLSC), VIIT"
                  date="Nov 2022 - Aug 2024"
                  collapsible={true}
                  link=""
                >
                  <div className="space-y-2">
                    <p>
                      Led the Microsoft Learn Student Club at VIIT Pune, fostering a strong
                      technical learning community.
                    </p>
                    <p>
                      Mentored students and organized machine learning initiatives
                      (Nov 2022 – Aug 2024).
                    </p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="Machine Learning Engineer Intern"
                  role="BVIRAL"
                  date="June 2023 - Sept 2023"
                  collapsible={true}
                  link=""
                >
                  <div className="space-y-2">
                    <p>
                      Built an end-to-end system using open-source deep learning models to
                      generate contextually relevant titles for millions of Instagram
                      short-form videos.
                    </p>
                    <p>
                      Researched, optimized, and deployed the system to production with
                      strong cost and time efficiency.
                    </p>
                  </div>
                </ExperienceItem>

              </div>
            </div>

            {/* ---------------------------------------------------------------------- */}

            {/* Education Section */}
            <div className="mb-16 w-full text-justify">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Education
              </h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="Vishwakarma Institute of Information Technology"
                  role="B.Tech"
                  date="Jan 2022 - May 2025"
                  link="https://www.viit.ac.in/"
                  collapsible={false}
                >
                  <div className="space-y-2">
                     <p>CGPA: 9.2 / 10.0</p>
                     <p>B.Tech in Electronics and Telecommunication</p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="KSJC"
                  role="HSC, Computer Science"
                  date="2019 - 2021"
                  collapsible={false}
                >
                   <p>Focused on Computer Science fundamentals.</p>
                </ExperienceItem>
              </div>
            </div>
            
            {/* ---------------------------------------------------------------------- */}
            {/* Contributions Section */}
            {/* <div className="mb-16 w-full text-justify">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                GitHub Contributions
              </h2>
              <GithubGraph />
            </div> */}
            <ProjectSection />
            {/* ---------------------------------------------------------------------- */}
            {/* Research Publications Section */}
            <div className="mb-16 w-full text-justify">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Research Publications
                </h2>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="mr-3">H-Index: 3</span>
                  <span>Total Citations: 21+</span>
                </div>
              </div>

              <div className="space-y-10">
                
                <ResearchItem
                  title="Assistance Platform for Visually Impaired Person using Image Captioning"
                  venue="Indian Patent Office"
                  date="2023"
                  authors="Inventor: Shreyas Dixit"
                  tags={["Patent Granted", "Computer Vision"]}
                  link=""
                >
                   <p>
                      Invented a real-time multimodal video narration platform designed to assist visually impaired individuals by converting visual data into descriptive audio, enhancing accessibility through computer vision technology. (Patent No. 202321004399)
                   </p>
                </ResearchItem>

                <ResearchItem
                  title="Peccavi: Visual Paraphrase Attack Safe and Distortion Free Image Watermarking"
                  venue="arXiv Preprint"
                  date="2025"
                  authors="S Dixit, A Aziz, S Bajpai, V Sharma, A Chadha, V Jain, A Das"
                  tags={["GenAI", "Security"]}
                  link="https://arxiv.org/abs/2506.22960"
                >
                   <p>
                      Proposed a novel watermarking technique for AI-generated images that remains robust against "visual paraphrase" attacks—subtle distortions that evade traditional detection—while maintaining zero visual distortion in the source media.
                   </p>
                </ResearchItem>

                <ResearchItem
                  title="The Visual Counter Turing Test (VCT²): A Benchmark for Evaluating AI-Generated Image Detection"
                  venue="Proceedings of the 14th IJCNLP"
                  date="2025"
                  authors="N Imanpour, A Borah, S Bajpai, S Dixit, et al."
                  tags={["Benchmarking", "Deep Learning"]}
                  link=""
                >
                   <p>
                      Introduced the Visual AI Index (V_AI) and a comprehensive benchmark for evaluating the state of AI-generated image detection, identifying critical gaps in current detection pipelines against sophisticated generative models.
                   </p>
                </ResearchItem>

                <ResearchItem
                  title="Wave-Former: Lag Removing Univariate Long Time Series Forecasting Transformer"
                  venue="Ocean Engineering (Elsevier), Vol 312"
                  date="2024"
                  authors="Shreyas Dixit, Pradnya Dixit"
                  tags={["Transformers", "Time-Series"]}
                  link=""
                >
                   <p>
                      Designed a specialized Transformer architecture to eliminate phase shift errors (lag) in long-horizon ocean wave forecasting. The model significantly outperforms traditional forecasting methods in chaotic natural systems.
                   </p>
                </ResearchItem>

                <ResearchItem
                  title="DeFactify 4: Counter Turing Test (Text & Image)"
                  venue="Workshop Proceedings"
                  date="2024"
                  authors="R Roy, G Singh, A Aziz, S Dixit, et al."
                  tags={["Workshop", "Dataset"]}
                  link=""
                >
                   <p>
                      Co-authored multiple foundational papers (Overview and Dataset releases) for the DeFactify 4 workshop, establishing comprehensive benchmarks for human vs. AI-generated text and image detection. Cited by 14+ across the series.
                   </p>
                </ResearchItem>

                <ResearchItem
                  title="Rethinking Data Integrity in Federated Learning: Are we ready?"
                  venue="IEEE International WIE Conference"
                  date="2022"
                  authors="S Dixit, PN Mahalle, GR Shinde"
                  tags={["Federated Learning", "Security"]}
                  link="https://ieeexplore.ieee.org/document/10150535"
                >
                   <p>
                      Investigated security vulnerabilities in distributed learning frameworks, specifically focusing on poisoning attacks and data tampering, and proposed protocols to ensure integrity in Federated Learning aggregation.
                   </p>
                </ResearchItem>

              </div>
            </div>
            {/* ---------------------------------------------------------------------- */}
            {/* Tech Stack Section */}
            <div className="mb-16 w-full text-justify">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Tech Stack
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                I specialize in bridging the gap between advanced research and production-grade infrastructure. While I am adaptable across the stack, I focus on architecting deterministic agentic systems and high-precision perception pipelines.
              </p>
              <TechStack />
            </div>
            {/* ---------------------------------------------------------------------- */}
            {/* Recommendations by Clients Section */}
            <div className="mb-16 w-full text-justify">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Recommendations
              </h2>
              <div className="space-y-8">
                {/* Harsh Mehta Recommendation */}
                <div className="group border-l-2 border-gray-200 dark:border-gray-800 pl-6 transition-all hover:border-black dark:hover:border-white">
                  <div className="mb-1">
                    <span className="text-base font-semibold text-black dark:text-white">
                      Harsh Mehta
                    </span>
                  </div>
                  <div className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                    Lead @ ReliaQuest | Threat Detection and Automation
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Shreyas possesses exceptional research and development skills. I have personally witnessed his passionate dedication and work ethic, seeing him dive deep into complex projects to deliver high-quality results. He approaches development with a level of commitment that truly stands out.
                  </p>
                </div>
              </div>
            </div>
            {/* ---------------------------------------------------------------------- */}
           
            <BlogSection />
            {/* ---------------------------------------------------------------------- */}

            {/* Library Section */}

            {/* Thing about me Section */}
            <div className="mb-16 w-full text-justify">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Life Outside Work
              </h2>
              <div className="space-y-6">
                <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  When I step away from the screen, I trade neural networks for race strategies. I’m a massive F1 enthusiast and a die-hard Manchester United supporter, always drawn to the high stakes, precision, and passion of competitive sports.
                </p>

                <div className="flex justify-center w-full">
                  {/* 1. Increased max-width to 'max-w-2xl' for a wider container */}
                  <div 
                    className="relative h-[350px] w-full max-w-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 grayscale hover:grayscale-0 transition-all duration-700 sm:h-[450px]" 
                  >
                    <Image
                      src="/casual.jpg"
                      alt="Casual photo"
                      fill
                      className="object-cover object-center"
                      priority
                    />
                  </div>
                </div>

                <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  I also love unwinding with the sharp wit of <em>Suits</em> (Harvey Specter is a personal favorite). But above all, I value real connections spending quality time with friends, whether we&apos;re debating the latest match or just hanging out, is where I find my true balance and recharge.
                </p>
              </div>
            </div>

            {/* Get in Touch Section */}
            <div className="mb-16 w-full text-justify">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Connect with me on{" "}
                  <a
                    href="https://www.linkedin.com/in/srddev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    LinkedIn
                  </a>{" "}
                  or shoot an {" "}
                  <a
                    href="mailto:shreyasrd31@gmail.com"
                    className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    email
                  </a>
                </p>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="mb-16 w-full">
              <a 
                href="https://www.linkedin.com/newsletters/productivitypro-7015550296219119616/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-black dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-black dark:text-white">ProductivityPro Newsletter</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Join 1,000+ readers for weekly insights on AI, focus, and organization.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                  Subscribe <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </a>
            </div>

          </motion.main>
        )}
      </AnimatePresence>

      {/* Glass Island Navbar */}
      <nav className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/80 px-4 py-3 shadow-sm backdrop-blur-md transition-all hover:bg-white/90 dark:hover:bg-zinc-900 sm:gap-6 sm:px-6">
        {/* Mode Toggle Switch */}
        <div className="flex items-center">
          <button
            onClick={() => setMode(mode === "human" ? "agent" : "human")}
            className="group relative flex h-7 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-zinc-700 p-1 transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:hover:bg-zinc-600 focus:outline-none"
            role="switch"
            aria-checked={mode === "agent"}
            title={`Switch to ${mode === "human" ? "agent" : "human"} mode`}
          >
            <div
              className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-white dark:bg-white shadow-sm transition duration-200 ease-in-out ${mode === "agent" ? "translate-x-5" : "translate-x-0"
                }`}
            >
              {mode === "human" ? (
                <User className="h-3 w-3 text-black" />
              ) : (
                <Bot className="h-3 w-3 text-black" />
              )}
            </div>
          </button>
        </div>
        <button
          onClick={() => setShowQR(true)}
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          aria-label="Show QR Code"
        >
          <QrCode className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700" />
        <a
          href="https://github.com/SRDdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          title="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/srddev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          title="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <a
          href="https://scholar.google.com/citations?user=pl_o-VUAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          title="Google Scholar"
        >
          <FileText className="h-5 w-5" />
        </a>
        <a
          href="https://medium.com/@srddev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          title="Medium"
        >
          <BookOpen className="h-5 w-5" />
        </a>
        <a
          href="mailto:shreyasrd31@gmail.com"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          title="Email"
        >
          <Mail className="h-5 w-5" />
        </a>
      </nav>

      {/* QR Code Modal */}
      {
        showQR && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 dark:bg-white/5 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <div
              className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute -right-3 -top-3 rounded-full bg-black dark:bg-white p-2 text-white dark:text-black transition-transform hover:scale-110"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG
                  value="https://www.linkedin.com/in/srddev/"
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}