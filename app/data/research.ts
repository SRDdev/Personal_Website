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
  {
    title: "PECCAVI: Visual Paraphrase Attack Safe and Distortion Free Image Watermarking",
    venue: "CVPR 2026",
    year: 2025,
    dateLabel: "2025",
    authors: "S Dixit, A Aziz, S Bajpai, V Sharma, A Chadha, V Jain, A Das",
    tags: ["GenAI", "Forensics", "Security"],
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2506.22960" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/60/Visible_digital_watermarking.jpg",
      alt: "Example photo with a visible watermark",
      fit: "cover",
    },
    overview:
      "A watermarking technique for AI-generated images that stays detectable under 'visual paraphrase' attacks—subtle, semantics-preserving edits that typically break standard watermarks.",
    contributions: [
      "Designed a distortion-free embedding mechanism that maintains 100% visual fidelity while embedding robust metadata.",
      "Modeled the 'Visual Paraphrase' threat vector, simulating real-world attacker behavior like slight cropping and color shifting.",
      "Engineered the extraction algorithm to achieve high precision even after lossy compression.",
    ],
    abstract:
      "Proposes a watermarking approach that is robust against 'visual paraphrase' attacks while maintaining zero visual distortion in the source media, critical for verifying AI-generated content origins.",
  },
  {
    title: "A Comprehensive Dataset for Human vs. AI Generated Image Detection",
    venue: "arXiv Preprint",
    year: 2026,
    dateLabel: "2026",
    authors: "R Roy, N Imanpour, A Aziz, S Bajpai, G Singh, S Biswas, K Wanaskar, S Dixit",
    tags: ["GenAI", "Computer Vision", "Dataset"],
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2601.00553" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Artificial_Intelligence_&_AI_&_Machine_Learning_-_Explaining_the_Difference.png",
      alt: "Conceptual diagram of AI generation",
      fit: "contain",
    },
    overview:
      "A massive-scale longitudinal study and dataset release addressing the difficulty of distinguishing hyper-realistic Diffusion and GAN-based imagery from authentic photography.",
    contributions: [
      "Curated and validated thousands of high-fidelity image pairs across diverse domains.",
      "Developed metadata schemas to track generator provenance and prompt engineering styles.",
      "Established a standard evaluation pipeline for baseline detection models on the 2026 dataset release.",
    ],
    abstract:
      "Presents a state-of-the-art benchmark dataset for the 2026 landscape of generative AI, focusing on edge cases where human perception and automated detectors frequently fail.",
  },
  {
    title: "The Visual Counter Turing Test (VCT²): A Benchmark for AI-Generated Image Detection",
    venue: "Proceedings of the 14th IJCNLP",
    year: 2025,
    dateLabel: "2025",
    authors: "N Imanpour, A Borah, S Bajpai, S Ghosh, SR Sankepally, HM Abdullah, S Dixit",
    tags: ["Benchmarking", "NLP", "Multi-modal"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Deepfake.jpg",
      alt: "Presentation slide asking whether content is real or fake",
      fit: "cover",
    },
    overview:
      "Introducing the Visual AI Index (V_AI), this work establishes a rigorous testing framework to evaluate if current detection systems can outpace rapidly evolving generative models.",
    contributions: [
      "Co-developed the Visual AI Index (V_AI) metric to quantify the 'believability' gap in AI imagery.",
      "Identified critical failure points in multi-modal models when faced with semantic inconsistencies.",
      "Standardized the evaluation protocol for the IJCNLP community to ensure cross-model comparability.",
    ],
    abstract:
      "Introduces the Visual AI Index (V_AI) and a benchmark for evaluating AI-generated image detection, highlighting gaps in current detection pipelines against increasingly capable generative models.",
  },
  {
    title: "Wave-Former: Lag Removing Univariate Long Time Series Forecasting Transformer",
    venue: "Ocean Engineering (Elsevier), Vol 312",
    year: 2024,
    dateLabel: "2024",
    authors: "D Shreyas, D Pradnya",
    tags: ["Transformers", "Time-Series", "Oceanography"],
    links: [{ label: "Journal", href: "https://doi.org/10.1016/j.oceaneng.2024.119109" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/55/Ocean_Waves.jpg",
      alt: "Ocean waves",
      fit: "cover",
    },
    overview:
      "A specialized Transformer architecture designed specifically for the maritime industry to solve the 'phase-lag' problem in wave height and frequency prediction.",
    contributions: [
      "Developed a custom attention mechanism that prioritizes temporal alignment over standard point-wise accuracy.",
      "Validated the model on global ocean buoy data, demonstrating a significant reduction in forecasting delay.",
      "Optimized the Transformer for long-horizon univariate forecasting where seasonal trends are chaotic.",
    ],
    abstract:
      "Designs a Transformer architecture to reduce lag (phase shift) in long time series forecasting, improving usability for ocean wave prediction where timing alignment is critical.",
  },
  {
    title: "DeFactify 4: Counter Turing Test (Text & Image) Overview and Datasets",
    venue: "Workshop Proceedings (DeFactify 4)",
    year: 2024,
    dateLabel: "2024",
    authors: "R Roy, G Singh, A Aziz, S Bajpai, N Imanpour, S Biswas, K Wanaskar, S Dixit",
    tags: ["Workshop", "Dataset", "AI Detection"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Fact_Check_Explorer.jpg",
      alt: "Fact Check Explorer screenshot",
      fit: "cover",
    },
    overview:
      "A dual-track workshop project (Text and Image) focused on identifying the fingerprints of LLMs and Diffusion models in synthesized media.",
    contributions: [
      "Led the data integrity verification for the 'Human vs. AI' text corpus.",
      "Synthesized the 'Counter Turing Test' metrics to provide a unified score for detection difficulty.",
      "Collaborated on the cross-modal analysis, comparing how detection difficulty varies between textual and visual AI artifacts.",
    ],
    abstract:
      "A comprehensive overview and dataset release establishing benchmarks for human vs. AI-generated content detection via the DeFactify 4 workshop series.",
  },
  {
    title: "Assistance Platform for Visually Impaired Person using Image Captioning",
    venue: "Indian Patent Office",
    year: 2023,
    dateLabel: "2023",
    authors: "Inventor: Shreyas Dixit",
    tags: ["Patent", "Computer Vision", "Accessibility"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/54/DSC_4050-MR-Braille.jpg",
      alt: "Hand reading Braille",
      fit: "cover",
    },
    overview:
      "A patented wearable system that leverages real-time image captioning to provide a descriptive audio narrative of the user's environment.",
    contributions: [
      "Conceptualized the hardware-software integration for low-latency scene description.",
      "Implemented a lightweight CNN-LSTM architecture suitable for edge deployment on assistive devices.",
      "Successfully navigated the patent filing process (No. 202321004399) focusing on the unique 'real-time narrative' feedback loop.",
    ],
    abstract:
      "The platform converts visual information into descriptive audio via image captioning, enabling users to understand surrounding scenes through hands-free narration.",
  },
  {
    title: "Rethinking Data Integrity in Federated Learning: Are we ready?",
    venue: "IEEE International WIE Conference",
    year: 2022,
    dateLabel: "2022",
    authors: "S Dixit, PN Mahalle, GR Shinde",
    tags: ["Federated Learning", "Security", "Privacy"],
    links: [{ label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/document/10150535" }],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Federated_learning.png",
      alt: "Federated learning schematic",
      fit: "contain",
    },
    overview:
      "An investigation into the vulnerabilities of decentralized learning systems, specifically focusing on how malicious clients can poison global models.",
    contributions: [
      "Conducted a comprehensive threat audit of current Federated Learning protocols.",
      "Analyzed the trade-off between client privacy and the ability of the central server to verify data integrity.",
      "Proposed a robust aggregation strategy to mitigate the impact of adversarial gradient updates.",
    ],
    abstract:
      "Investigates vulnerabilities in distributed learning—especially poisoning and data tampering—and proposes protocols to improve integrity in federated aggregation.",
  },
];

export function getLatestResearchItems(count: number) {
  return [...RESEARCH_ITEMS].sort((a, b) => b.year - a.year).slice(0, count);
}