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
    title: "Peccavi: Visual Paraphrase Attack Safe and Distortion Free Image Watermarking",
    venue: "arXiv Preprint",
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
      "A watermarking technique for AI-generated images that stays detectable under subtle, semantics-preserving edits while keeping the source visually unchanged.",
    contributions: [
      "Framed the threat model around real attacker behavior: small edits that preserve semantics but break detectors.",
      "Contributed to method design and writing around robustness vs. imperceptibility trade-offs.",
      "Helped communicate the evaluation story and practical adoption constraints.",
    ],
    abstract:
      'Proposes a watermarking approach that is robust against "visual paraphrase" attacks—subtle distortions designed to evade traditional detection—while maintaining zero visual distortion in the source media.',
  },
  {
    title: "The Visual Counter Turing Test (VCT²): A Benchmark for Evaluating AI-Generated Image Detection",
    venue: "Proceedings of the 14th IJCNLP",
    year: 2025,
    dateLabel: "2025",
    authors: "N Imanpour, A Borah, S Bajpai, S Dixit, et al.",
    tags: ["Benchmarking", "Deep Learning"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Deepfake.jpg",
      alt: "Presentation slide asking whether content is real or fake",
      fit: "cover",
    },
    overview:
      "A benchmark framework for AI-generated image detection that surfaces failure modes and quantifies how detectors degrade as generative models improve.",
    contributions: [
      "Co-authored benchmark framing and evaluation goals aligned with real deployment constraints.",
      "Clarified metrics, comparisons, and what constitutes a meaningful detection signal.",
      "Helped articulate key breakdown points in current detection pipelines.",
    ],
    abstract:
      "Introduces the Visual AI Index (V_AI) and a benchmark for evaluating AI-generated image detection, highlighting gaps in current detection pipelines against increasingly capable generative models.",
  },
  {
    title: "Cross-Compatible Encryption Adapter for Securing Legacy Modbus Devices",
    venue: "COMSNETS",
    year: 2025,
    dateLabel: "2025",
    authors: "Shreyas Dixit; T. S. Sreeram",
    tags: ["SCADA", "Systems", "Security"],
    links: [
      { label: "DOI", href: "https://doi.org/10.1109/COMSNETS63942.2025.10885597" },
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b3/PLC_AB_InstaladoV1.JPG",
      alt: "Programmable logic controller (PLC) hardware",
      fit: "cover",
    },
    overview:
      "A retrofit-friendly hardware adapter that brings modern encryption to legacy Modbus loops without requiring costly system overhauls.",
    contributions: [
      "Worked on retrofit-first design: preserve compatibility while improving confidentiality.",
      "Helped shape the threat model and practical constraints (cost, deployment, interoperability).",
      "Contributed to system-level evaluation and writing emphasizing deployability.",
    ],
    abstract:
      "SCADA systems often rely on legacy protocols like Modbus that lack built-in security. This work proposes a cost-efficient, cross-platform hardware adapter to bring modern encryption to legacy Modbus devices with minimal operational disruption.",
  },
  {
    title: "Wave-Former: Lag Removing Univariate Long Time Series Forecasting Transformer",
    venue: "Ocean Engineering (Elsevier), Vol 312",
    year: 2024,
    dateLabel: "2024",
    authors: "Shreyas Dixit, Pradnya Dixit",
    tags: ["Transformers", "Time-Series"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/55/Ocean_Waves.jpg",
      alt: "Ocean waves",
      fit: "cover",
    },
    overview:
      "A Transformer architecture tailored for long-horizon wave forecasting, designed to reduce phase-shift (lag) errors that hurt downstream planning and control.",
    contributions: [
      "Focused on modeling choices that prioritize temporal alignment over only point-wise accuracy.",
      "Helped frame experiments for chaotic natural signals where timing errors matter materially.",
      "Co-authored the end-to-end narrative from problem definition to evaluation and takeaways.",
    ],
    abstract:
      "Designs a Transformer architecture to reduce lag (phase shift) in long time series forecasting, improving usability for ocean wave prediction where timing alignment is critical.",
  },
  {
    title: "DeFactify 4: Counter Turing Test (Text & Image)",
    venue: "Workshop Proceedings",
    year: 2024,
    dateLabel: "2024",
    authors: "R Roy, G Singh, A Aziz, S Dixit, et al.",
    tags: ["Workshop", "Dataset", "Benchmarking"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Fact_Check_Explorer.jpg",
      alt: "Fact Check Explorer screenshot",
      fit: "cover",
    },
    overview:
      "Workshop overview and dataset releases for benchmarking human vs. AI-generated text and images with reproducible evaluation protocols.",
    contributions: [
      "Co-authored overview + dataset papers and positioned the benchmark within the AI-forensics landscape.",
      "Worked on task definitions and documentation to improve reproducibility and fair comparisons.",
      "Supported reporting standards and practical evaluation guidance.",
    ],
    abstract:
      "Co-authored papers for the DeFactify 4 workshop, establishing benchmarks for human vs. AI-generated text and image detection via overview and dataset releases.",
  },
  {
    title: "Assistance Platform for Visually Impaired Person using Image Captioning",
    venue: "Indian Patent Office",
    year: 2023,
    dateLabel: "2023",
    authors: "Inventor: Shreyas Dixit",
    tags: ["Patent Granted", "Computer Vision", "Accessibility"],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/54/DSC_4050-MR-Braille.jpg",
      alt: "Hand reading Braille",
      fit: "cover",
    },
    overview:
      "A real-time multimodal narration system that turns visual context into natural language and audio to improve independence and safety for visually impaired users.",
    contributions: [
      "Designed an end-to-end pipeline for capture → captioning → speech in real time.",
      "Optimized for latency, clarity, and robustness across varied everyday environments.",
      "Filed and secured patent protection (Patent No. 202321004399).",
    ],
    abstract:
      "The platform converts visual information into descriptive audio via image captioning, enabling users to understand surrounding scenes and objects through hands-free narration.",
  },
  {
    title: "Rethinking Data Integrity in Federated Learning: Are we ready?",
    venue: "IEEE International WIE Conference",
    year: 2022,
    dateLabel: "2022",
    authors: "S Dixit, PN Mahalle, GR Shinde",
    tags: ["Federated Learning", "Security"],
    links: [
      { label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/document/10150535" },
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Federated_learning.png",
      alt: "Federated learning schematic",
      fit: "contain",
    },
    overview:
      "A security-focused analysis of federated learning attack surfaces, with emphasis on poisoning and tampering risks and practical integrity safeguards.",
    contributions: [
      "Surveyed attack surfaces and real threat scenarios for distributed learning.",
      "Analyzed integrity and poisoning risks across aggregation and client updates.",
      "Proposed protocol-level mitigations and documented deployability trade-offs.",
    ],
    abstract:
      "Investigates vulnerabilities in distributed learning—especially poisoning and data tampering—and proposes protocols to improve integrity in federated aggregation.",
  },
];

export function getLatestResearchItems(count: number) {
  return [...RESEARCH_ITEMS].sort((a, b) => b.year - a.year).slice(0, count);
}
