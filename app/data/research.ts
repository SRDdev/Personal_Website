export type ResearchLink = {
  label: string;
  href: string;
};

export type ResearchItem = {
  title: string;
  venue: string;
  year: number;
  dateLabel: string;
  authors: string;
  citations?: number;
  tags?: string[];
  overview: string;
  image?: {
    src: string;
    alt: string;
    fit?: "cover" | "contain";
  };
  contributions?: string[];
  abstract?: string;
  links?: ResearchLink[];
};

export const RESEARCH_ITEMS: ResearchItem[] = [
  // --- 2026 / 2025 (Upcoming & Preprints) ---
  {
    title: "A Comprehensive Dataset for Human vs. AI Generated Image Detection",
    venue: "arXiv preprint arXiv:2601.00553",
    year: 2026,
    dateLabel: "2026",
    citations: 0,
    authors: "R Roy, N Imanpour, A Aziz, S Bajpai, G Singh, S Biswas, K Wanaskar, S Dixit",
    tags: ["GenAI", "Computer Vision", "Dataset"],
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2601.00553" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Artificial_Intelligence_&_AI_&_Machine_Learning_-_Explaining_the_Difference.png",
      alt: "Conceptual diagram of AI generation",
      fit: "contain",
    },
    overview: "A massive-scale longitudinal dataset addressing the difficulty of distinguishing hyper-realistic generated imagery from authentic photography.",
  },
  {
    title: "Peccavi: Visual Paraphrase Attack Safe and Distortion Free Image Watermarking Technique for AI-Generated Images",
    venue: "arXiv preprint arXiv:2506.22960",
    year: 2025,
    dateLabel: "2025",
    citations: 0,
    authors: "S Dixit, A Aziz, S Bajpai, V Sharma, A Chadha, V Jain, A Das",
    tags: ["GenAI", "Forensics", "Security"],
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2506.22960" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/60/Visible_digital_watermarking.jpg",
      alt: "Example photo with a visible watermark",
      fit: "cover",
    },
    overview: "Proposes a watermarking approach that is robust against 'visual paraphrase' attacks while maintaining zero visual distortion in the source media.",
  },
  {
    title: "A Comprehensive Dataset for Human vs. AI Generated Text Detection",
    venue: "arXiv preprint arXiv:2510.22874",
    year: 2025,
    dateLabel: "2025",
    citations: 0,
    authors: "R Roy, N Imanpour, A Aziz, S Bajpai, G Singh, S Biswas, K Wanaskar, S Dixit",
    tags: ["GenAI", "NLP", "Dataset"],
    overview: "A comprehensive dataset curated specifically for evaluating and training models on human vs. AI-generated text detection.",
  },
  {
    title: "The Visual Counter Turing Test (VCT²): A Benchmark for Evaluating AI-Generated Image Detection and the Visual AI Index (V_AI)",
    venue: "Proceedings of the 14th International Joint Conference on Natural Language...",
    year: 2025,
    dateLabel: "2025",
    citations: 1,
    authors: "N Imanpour, A Borah, S Bajpai, S Ghosh, SR Sankepally, HM Abdullah, S Dixit",
    tags: ["Benchmarking", "Multi-modal", "V_AI"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Deepfake.jpg",
      alt: "Presentation slide asking whether content is real or fake",
      fit: "cover",
    },
    overview: "Introduces the Visual AI Index (V_AI) and a benchmark for evaluating AI-generated image detection, highlighting gaps in current detection pipelines.",
  },

  // --- 2024 ---
  {
    title: "Visual counter turing test (vct2): Discovering the challenges for ai-generated image detection and introducing visual ai index (vAI)",
    venue: "arXiv preprint arXiv:2411.16754",
    year: 2024,
    dateLabel: "2024",
    citations: 1,
    authors: "N Imanpour, S Bajpai, S Ghosh, SR Sankepally, A Borah, HM Abdullah, S Dixit",
    tags: ["Preprint", "Benchmarking", "GenAI"],
    overview: "Early preprint discovering the fundamental challenges in detecting highly sophisticated AI-generated visual content.",
  },
  {
    title: "Overview of text counter turing test: Ai generated text detection",
    venue: "Proceedings of DeFactify 4",
    year: 2024,
    dateLabel: "2024",
    citations: 5,
    authors: "R Roy, G Singh, A Aziz, S Bajpai, N Imanpour, S Biswas, K Wanaskar, S Dixit",
    tags: ["Workshop", "Text Detection"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Fact_Check_Explorer.jpg",
      alt: "Fact Check Explorer screenshot",
      fit: "cover",
    },
    overview: "Overview paper for the text track of the DeFactify 4 workshop, detailing the counter Turing test methodologies for LLMs.",
  },
  {
    title: "Defactify-text: A comprehensive dataset for human vs. ai generated text detection",
    venue: "Proceedings of DeFactify 4",
    year: 2024,
    dateLabel: "2024",
    citations: 5,
    authors: "R Roy, G Singh, A Aziz, S Bajpai, N Imanpour, S Biswas, K Wanaskar, S Dixit",
    tags: ["Workshop", "Dataset", "NLP"],
    overview: "Official dataset release paper associated with the DeFactify 4 text counter Turing test challenge.",
  },
  {
    title: "Defactifyimage: A comprehensive dataset for human vs. ai generated image detection",
    venue: "Proceedings of DeFactify 4",
    year: 2024,
    dateLabel: "2024",
    citations: 2,
    authors: "R Roy, A Aziz, S Bajpai, N Imanpour, G Singh, S Biswas, K Wanaskar, S Dixit",
    tags: ["Workshop", "Dataset", "Computer Vision"],
    overview: "Dataset paper for the visual track of DeFactify 4, establishing baseline corpora for diffusion and GAN detection.",
  },
  {
    title: "Overview of image counter turing test: Ai generated image detection",
    venue: "Proceedings of DeFactify 4",
    year: 2024,
    dateLabel: "2024",
    citations: 2,
    authors: "R Roy, N Imanpour, A Aziz, S Bajpai, G Singh, S Biswas, K Wanaskar, S Dixit",
    tags: ["Workshop", "Image Detection"],
    overview: "Overview paper for the image track of the DeFactify 4 workshop, detailing the counter Turing test for visual synthetic media.",
  },
  {
    title: "Wave-Former: Lag Removing Univariate Long Time Series Forecasting Transformer for Ocean Waves",
    venue: "Ocean Engineering 312 (119109), 15",
    year: 2024,
    dateLabel: "2024",
    citations: 3,
    authors: "D Shreyas, D Pradnya",
    tags: ["Transformers", "Time-Series", "Oceanography"],
    links: [{ label: "Journal", href: "https://doi.org/10.1016/j.oceaneng.2024.119109" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/55/Ocean_Waves.jpg",
      alt: "Ocean waves",
      fit: "cover",
    },
    overview: "A specialized Transformer architecture designed to reduce lag in long time series forecasting for ocean wave prediction.",
  },

  // --- 2023 & 2022 ---
  {
    title: "Assistance Platform for Visually Impaired Person using Image Captioning",
    venue: "IN Patent App. 202,321,004,399",
    year: 2023,
    dateLabel: "2023",
    citations: 0,
    authors: "S Dixit",
    tags: ["Patent", "Accessibility"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/54/DSC_4050-MR-Braille.jpg",
      alt: "Hand reading Braille",
      fit: "cover",
    },
    overview: "A patented wearable system leveraging real-time image captioning to provide a descriptive audio narrative of the user's environment.",
  },
  {
    title: "Rethinking Data Integrity in Federated Learning: Are we ready?",
    venue: "2022 IEEE International Women in Engineering (WIE) Conference on Electrical...",
    year: 2022,
    dateLabel: "2022",
    citations: 4,
    authors: "S Dixit, PN Mahalle, GR Shinde",
    tags: ["Federated Learning", "Security"],
    links: [{ label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/document/10150535" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Federated_learning.png",
      alt: "Federated learning schematic",
      fit: "contain",
    },
    overview: "Investigates vulnerabilities in distributed learning—especially poisoning and data tampering—and proposes protocols to improve integrity.",
  }
];

export function getLatestResearchItems(count: number) {
  return [...RESEARCH_ITEMS].sort((a, b) => b.year - a.year).slice(0, count);
}