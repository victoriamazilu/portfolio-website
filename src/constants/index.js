import { realitylabs, oncall, risetothrive, hci } from "../assets/images";
import {
    contact,
    css,
    git,
    github,
    html,
    javascript,
    linkedin,
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
        title: "Software Developer",
        company_name: "Waterloo Reality Labs",
        icon: realitylabs,
        iconBg: "#45443f",
        date: "September 2024 - Present",
        points: [
            "Trained a PyTorch feedforward neural network, achieving 99.98% accuracy in classifying RGB colors as warm or cool, by generating synthetic data and using backpropagation.",
            "Implemented hand gesture controls for a Meta Quest VR app using the Meta SDK and XR Simulator.",
            "Developed 3D Roll-a-Ball game in Unity to learn GameObjects, rigidbody physics, and scripting in C#.",
        ],
    },
    {
        title: "Full-Stack Developer",
        company_name: "OnCall Health",
        icon: oncall,
        iconBg: "#accbe1",
        date: "May 2024 - August 2024",
        points: [
            "Engineered full-stack features with Django REST, Python, React, and JavaScript, using Datadog for logging, and enabled platform sync through GMP integration.",
            "Built the foundation of new platform integration which contributed to a 16% quarterly revenue increase, by implementing core models, serializers, and views to enable a seamless migration.",
            "Improved platform performance and achieved a 7x reduction in query time by optimizing queries, reducing joins, leveraging subqueries, and implementing a custom utility function.",
        ],
    },
    {
        title: "STEM Tutor",
        company_name: "Harbord Collegiate Institute",
        icon: hci,
        iconBg: "#ffd0a1",
        date: "Sept 2022 - June 2023",
        points: [
            "Increased the academic performance of over 20 students up to 18% through twice-weekly tutoring sessions, demonstrating effective teaching and subject mastery.",
            "Enhanced tracking of student progress by submitting weekly reports for each tutee, which facilitated individual assistance and supported diverse student needs",
        ],
    },
    {
        title: "UX/UI Intern",
        company_name: "Rise to Thrive Foundation",
        icon: risetothrive,
        iconBg: "#fcf5cf",
        date: "Oct 2021 - Jan 2022",
        points: [
            "Gathered user insights by conducting research, identifying the needs of our target audience, which informed 80% of design decisions and enhanced user experience.",
            "Facilitated team communication by presenting design concepts to the founder, leading to a 95% approval rate of ideas.",
            "Developed a workshop structure about company purpose using Figma, which fostered productive discussions on future endeavours.",
            "Enhanced the company website's effectiveness by conducting thorough analysis on key areas for strength and potential growth.",
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
];

export const projects = [
    {
        iconUrl: swarm,
        theme: "btn-back-yellow",
        name: "Swarm",
        description:
            "Swarm is a full-stack social web application designed to connect and build communities. It's a platform for sharing, engaging in discussions, and interacting with like minds. Live version at https://swarm.vmazilu.com/",
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
        link: "https://github.com/victoriamazilu/Personal-Website",
    },
];
