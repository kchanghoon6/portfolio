/**
 * Single source of truth for all portfolio content.
 * Edit text, tags, and links here without touching layout/components.
 */

export interface NavLink {
  label: string
  href: string // anchor id, e.g. "#about"
}

export interface SocialLink {
  label: string
  href: string
  icon: "github" | "linkedin" | "mail" | "scholar"
}

export interface ProjectLink {
  label: string
  href: string
  type: "github" | "demo" | "paper" | "writeup"
}

export interface Project {
  title: string
  impact: string // one-line impact summary
  description: string // 2-3 sentences
  tags: string[]
  links: ProjectLink[]
  featured?: boolean
}

export interface ResearchInterest {
  title: string
  description: string
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface ExperienceItem {
  role: string
  org: string
  dates: string
  location: string
  bullets: string[]
}

export interface Publication {
  title: string
  authors: string
  venue: string
  summary: string
  links: ProjectLink[]
}

export interface Award {
  title: string
  issuer: string
  year: string
}

export const profile = {
  name: "Kim Changhoon",
  role: "AI / Robotics / Machine Learning Builder",
  headline:
    "Building intelligent systems across robotics, machine learning, and human-centered technology.",
  subtext:
    "I explore computer vision, embedded sensing, AI systems, and interactive software through research-driven projects and practical engineering.",
  email: "changhoon.kim@example.com",
  resumeHref: "#",
  githubHref: "https://github.com",
}

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
]

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "Google Scholar", href: "#", icon: "scholar" },
  { label: "Email", href: "mailto:changhoon.kim@example.com", icon: "mail" },
]

export const aboutParagraphs: string[] = [
  "I’m an engineer working at the intersection of robotics and machine learning, where I care most about systems that hold up outside the lab. I like reducing messy, real-world problems — noisy sensors, latency budgets, edge cases — into models and pipelines that are reliable enough to trust.",
  "Most of my work pairs perception with control: training vision models on data I’ve carefully collected, then deploying them onto robots and embedded devices where every millisecond and watt matters. I’m equally comfortable writing a data loader in Python and debugging a timing issue in C++.",
  "Beyond the code, I’m drawn to human-centered AI — interfaces and autonomy that feel calm and predictable to the people using them. I write things down to think clearly, and I treat documentation and reproducibility as part of the engineering, not an afterthought.",
]

export const researchInterests: ResearchInterest[] = [
  {
    title: "Computer Vision",
    description:
      "Real-time perception, landmark estimation, and robust models that degrade gracefully under noise.",
  },
  {
    title: "Robot Learning",
    description:
      "Bridging learned policies with classical control and planning for dependable autonomy.",
  },
  {
    title: "Embedded Sensing",
    description:
      "Low-latency, power-aware pipelines that fuse heterogeneous sensors on constrained hardware.",
  },
  {
    title: "Human-Centered AI",
    description:
      "Interfaces and autonomy designed to feel predictable, legible, and trustworthy to people.",
  },
]

export const projects: Project[] = [
  {
    featured: true,
    title: "Autonomous Indoor Navigation Stack",
    impact: "Reliable point-to-point navigation in cluttered indoor spaces.",
    description:
      "A ROS2 + Nav2 stack with LiDAR-based SLAM and a tuned local planner that handles dynamic obstacles. Validated in Gazebo across procedurally generated rooms before hardware trials on a differential-drive base.",
    tags: ["ROS2", "SLAM", "Python", "Robotics"],
    links: [
      { label: "GitHub", href: "#", type: "github" },
      { label: "Writeup", href: "#", type: "writeup" },
    ],
  },
  {
    featured: true,
    title: "Real-Time Hand Gesture Recognition",
    impact: "Low-latency gesture control for touchless interfaces.",
    description:
      "A compact PyTorch classifier over MediaPipe hand landmarks with an OpenCV preprocessing front end. Runs at interactive frame rates on a laptop GPU and exposes a simple event API for downstream apps.",
    tags: ["PyTorch", "OpenCV", "Computer Vision", "ML"],
    links: [
      { label: "GitHub", href: "#", type: "github" },
      { label: "Demo", href: "#", type: "demo" },
    ],
  },
  {
    featured: true,
    title: "Sensor-Fusion Logger for Embedded Robots",
    impact: "Clean, synchronized multi-sensor datasets for training.",
    description:
      "A C++/Python pipeline that timestamps and aligns IMU and camera streams, with a lightweight web dashboard for live inspection. Designed to make downstream model training reproducible and painless.",
    tags: ["C++", "Embedded", "Firebase", "React"],
    links: [{ label: "GitHub", href: "#", type: "github" }],
  },
  {
    title: "Monocular Depth for Small Drones",
    impact: "Lightweight depth estimation under tight compute budgets.",
    description:
      "A distilled depth network optimized for onboard inference, trained with self-supervised photometric losses on flight footage.",
    tags: ["PyTorch", "Computer Vision", "Embedded"],
    links: [{ label: "GitHub", href: "#", type: "github" }],
  },
  {
    title: "Grasp Planning Simulator",
    impact: "Faster iteration on manipulation policies in simulation.",
    description:
      "A Gazebo-based environment for benchmarking grasp strategies with scripted scene randomization and metrics logging.",
    tags: ["Gazebo", "ROS2", "Python", "Robotics"],
    links: [
      { label: "GitHub", href: "#", type: "github" },
      { label: "Demo", href: "#", type: "demo" },
    ],
  },
  {
    title: "Anomaly Detection for IMU Streams",
    impact: "Early warning for sensor faults on mobile robots.",
    description:
      "An unsupervised model flagging drift and dropout in inertial data, with thresholds calibrated from field recordings.",
    tags: ["scikit-learn", "NumPy", "ML"],
    links: [{ label: "Writeup", href: "#", type: "writeup" }],
  },
  {
    title: "Pose Estimation Annotation Tool",
    impact: "Cut keypoint labeling time roughly in half.",
    description:
      "A React + TypeScript tool with model-assisted suggestions and keyboard-first editing for fast, consistent keypoint labels.",
    tags: ["React", "Next.js", "TypeScript"],
    links: [
      { label: "GitHub", href: "#", type: "github" },
      { label: "Demo", href: "#", type: "demo" },
    ],
  },
  {
    title: "TinyML Keyword Spotter",
    impact: "On-device wake-word detection under 100KB.",
    description:
      "A quantized TensorFlow model deployed to a microcontroller, with a streaming feature extractor tuned for low power.",
    tags: ["TensorFlow", "Embedded", "ML"],
    links: [{ label: "GitHub", href: "#", type: "github" }],
  },
  {
    title: "Multi-Robot Coordination Demo",
    impact: "Conflict-free routing for a small robot fleet.",
    description:
      "A planner that assigns and deconflicts paths across multiple agents, visualized through a real-time dashboard.",
    tags: ["ROS2", "Nav2", "Python", "Robotics"],
    links: [
      { label: "GitHub", href: "#", type: "github" },
      { label: "Writeup", href: "#", type: "writeup" },
    ],
  },
]

export const skillGroups: SkillGroup[] = [
  { category: "Languages", skills: ["Python", "C++", "TypeScript", "JavaScript"] },
  { category: "ML / AI", skills: ["PyTorch", "TensorFlow", "scikit-learn", "NumPy", "Pandas"] },
  { category: "Robotics", skills: ["ROS2", "Gazebo", "Nav2", "Control Basics"] },
  { category: "Computer Vision", skills: ["OpenCV", "MediaPipe", "Image Processing"] },
  { category: "Tools / Infra", skills: ["Git", "Docker", "Linux", "Firebase", "REST APIs"] },
]

export const experience: ExperienceItem[] = [
  {
    role: "Undergraduate Research Assistant",
    org: "Robotics & Perception Lab",
    dates: "2024 — Present",
    location: "On-campus",
    bullets: [
      "Built a perception pipeline fusing LiDAR and camera data for indoor navigation experiments.",
      "Reduced model inference latency ~40% through quantization and input pre-scaling.",
      "Maintained reproducible training configs and documentation used across the team.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Embedded AI Startup",
    dates: "Summer 2024",
    location: "Remote",
    bullets: [
      "Prototyped a TinyML keyword spotter that ran within a 100KB memory budget.",
      "Wrote a streaming feature extractor and on-device evaluation harness in C++.",
    ],
  },
  {
    role: "Software Engineering Intern",
    org: "Interactive Systems Group",
    dates: "Winter 2023",
    location: "Hybrid",
    bullets: [
      "Developed a model-assisted annotation tool that cut keypoint labeling time in half.",
      "Shipped a React + TypeScript front end with keyboard-first editing flows.",
    ],
  },
  {
    role: "Teaching Assistant — Intro to Programming",
    org: "Department of Computer Science",
    dates: "2023 — 2024",
    location: "On-campus",
    bullets: [
      "Led weekly lab sections and mentored students on debugging and problem decomposition.",
      "Authored autograded assignments and supplementary notes on data structures.",
    ],
  },
]

export const publications: Publication[] = [
  {
    title: "Latency-Aware Perception for Resource-Constrained Robots",
    authors: "C. Kim, A. Rivera, M. Tan",
    venue: "Workshop Preprint, 2025",
    summary:
      "A study of how quantization and input scaling trade off accuracy against latency for onboard perception, with practical deployment guidelines.",
    links: [
      { label: "Paper", href: "#", type: "paper" },
      { label: "Code", href: "#", type: "github" },
    ],
  },
  {
    title: "Notes on Reproducible Robotics Experiments",
    authors: "Kim Changhoon",
    venue: "Technical Blog, 2024",
    summary:
      "A practical writeup on structuring configs, seeds, and logging so robotics results can be re-run and trusted.",
    links: [{ label: "Writeup", href: "#", type: "writeup" }],
  },
]

export const awards: Award[] = [
  { title: "Undergraduate Research Excellence Award", issuer: "College of Engineering", year: "2025" },
  { title: "1st Place, Intercollegiate Robotics Challenge", issuer: "Regional Robotics League", year: "2024" },
  { title: "Deep Learning Specialization", issuer: "Certification", year: "2023" },
]
