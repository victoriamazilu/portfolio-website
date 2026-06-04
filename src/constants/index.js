import {
  ada,
  blockchain,
  realitylabs,
  oncall,
  risetothrive,
  hci,
  block,
  virtu,
} from "../assets/images";
import {
  contact,
  css,
  git,
  github,
  html,
  javascript,
  linkedin,
  x,
  react,
  tailwindcss,
  python,
  flask,
  django,
  c,
  java,
  figma,
  threejs,
  showerscribe,
  nextjs,
  mongodb,
  typescript,
  swarm,
  pathfindr,
} from "../assets/icons";
import icon from "../assets/icon.png";

export const skills = [
  {
    imageUrl: typescript,
    name: "TypeScript",
  },
  {
    imageUrl: javascript,
    name: "JavaScript",
  },
  {
    imageUrl: nextjs,
    name: "Next.js",
  },
  {
    imageUrl: react,
    name: "React",
  },
  {
    imageUrl: java,
    name: "Java",
  },
  {
    imageUrl: c,
    name: "C/C++",
  },
  {
    imageUrl: python,
    name: "Python",
  },
  {
    imageUrl: django,
    name: "Django",
  },
  {
    imageUrl: mongodb,
    name: "MongoDB",
  },
  {
    imageUrl: css,
    name: "CSS",
  },
  {
    imageUrl: html,
    name: "HTML",
  },
  {
    imageUrl: git,
    name: "Git",
  },
  {
    imageUrl: threejs,
    name: "Three.js",
  },
  {
    imageUrl: flask,
    name: "Flask",
  },
  {
    imageUrl: tailwindcss,
    name: "Tailwind CSS",
  },
  {
    imageUrl: figma,
    name: "Figma",
  },
];

export const experiences = [
  {
    title: "Software Engineering Intern",
    team: "Data Engineering Team",
    company_name: "Block",
    link: "https://block.xyz/",
    icon: block,
    iconBg: "#000000",
    date: "May 2026 - Present",
    points: [
      "Data Engineer on Block's Financial Platforms team, supporting Square and Cash App.",
    ],
  },
  {
    title: "Quantitative Research Intern",
    company_name: "Virtu Financial",
    link: "https://www.virtu.com/",
    icon: virtu,
    iconBg: "#000000",
    date: "January 2026",
    points: [
      "Selected for Virtu's Accelerated Winter Intern Program.",
      "Winner of the Capstone Project: implemented an end-to-end quantitative research thesis and developed a predictive model for CME Gold Futures trading.",
    ],
  },
  {
    title: "Software Engineering Intern",
    team: "AI Voice Team",
    company_name: "Ada",
    link: "https://www.ada.cx/",
    icon: ada,
    iconBg: "#89b0a6",
    date: "September 2025 - December 2025",
    points: [
      "Improved the Voice AI Agent product and Ada Reasoning Engine (the LLM brain of the product).",
      "Created a low-latency path for voice by isolating all voice inference into a high-priority queue, resulting in a 27% decrease in time-to-first-token.",
    ],
  },
  {
    title: "Software Engineering Intern",
    team: "AI Voice Team",
    company_name: "Ada",
    link: "https://www.ada.cx/",
    icon: ada,
    iconBg: "#89b0a6",
    date: "January 2025 - April 2025",
    points: [
      "Increased user visits to a high-traffic page, as measured by a 32% increase in clicks, by addressing outdated UI, creating tickets, and independently executing a full-stack redesign project.",
      "Enhanced product reliability and user clarity as a key member of the Ada Voice team by implementing compatibility warnings, optimizing endpoint functionality, and resolving database issues using Python, React, and TypeScript.",
    ],
  },
  {
    title: "VR Software Lead",
    team: "Humanoid Team",
    company_name: "Waterloo Reality Labs",
    link: "https://uwrealitylabs.com/",
    icon: realitylabs,
    iconBg: "#45443f",
    date: "September 2024 - April 2026",
    points: [
      "Accomplished a ∼0.3ms latency data exchange between a humanoid robot and VR client for teleoperation by integrating Meta SDK hand tracking with a WebSocket server.",
      "Trained a PyTorch feedforward neural network, achieving 99.98% accuracy in classifying RGB colors as warm or cool, by generating synthetic data and using backpropagation.",
    
    ],
  },
  {
    title: "Full-Stack Developer",
    team: "OnCall Health Platform",
    company_name: "Qualifacts",
    link: "https://www.qualifacts.com/",
    icon: oncall,
    iconBg: "#accbe1",
    date: "May 2024 - August 2024",
    points: [
      "Engineered full-stack features with Django REST, Python, React, and JavaScript, using Datadog for logging, and enabled platform sync through GMP integration.",
      "Built the foundation of new platform integration which contributed to a 16% quarterly revenue increase, by implementing core models, serializers, and views to enable a seamless migration.",
      "Improved platform performance and achieved a 7x reduction in query time by optimizing queries, reducing joins, leveraging subqueries, and implementing a custom utility function.",
    ],
  },
];

export const socialLinks = [
  {
    name: "GitHub",
    iconUrl: github,
    link: "https://github.com/victoriamazilu",
  },
  {
    name: "LinkedIn",
    iconUrl: linkedin,
    link: "https://www.linkedin.com/in/victoriamazilu/",
  },
  {
    name: "X",
    iconUrl: x,
    link: "https://x.com/victoriamazilu",
  },
];

export const projects = [
  {
    iconUrl: pathfindr,
    theme: "btn-back-black",
    name: "Pathfindr",
    description:
      "Pathfindr is a rock climbing route management and session tracking application built for rock climbing enthusiasts (currently only supports Waterloo PAC Climbing Gym). The platform enables climbers to discover routes, track their climbing sessions, analyze their progress, and get personalized recommendations. Features include route filtering and exploration, session management with route completion tracking, progress analytics, and a recommendation system based on climbing history and preferences.",
    link: "https://github.com/victoriamazilu/pathfindr",
    liveLink: "https://pathfindr.vmazilu.ca",
  },
  {
    iconUrl: swarm,
    theme: "btn-back-yellow",
    name: "Swarm",
    description:
      "Swarm is a full-stack social web application designed to connect and build communities. It's a platform for sharing, engaging in discussions, and interacting with like minds. Live version at https://swarm.vmazilu.ca/",
    link: "https://github.com/victoriamazilu/Swarm",
  },
  {
    iconUrl: showerscribe,
    theme: "btn-back-gray",
    name: "Shower Scribe",
    role: "Frontend Developer",
    description:
      "Shower Scribe is a waterproof device that captures your shower thoughts for those eureka moments you just can't afford to forget. It instantly transcribes, auto-titles, groups, and provides LLM recaps for each recording, which is all displayed on a user-friendly web app.",
    link: "https://github.com/victoriamazilu/Shower-Scribe",
  },
  {
    iconUrl: icon,
    theme: "btn-back-blue",
    name: "This website!",
    description:
      "Everything you see right now! Built with Javascript, React, and much more...",
    link: "https://github.com/victoriamazilu/portfolio-website",
  },
];
