import { fyi, blueblood, risetothrive, hci } from "../assets/images";
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
    bootstrap,
    vite,
    c,
    java,
    blender,
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
        imageUrl: vite,
        name: "Vite",
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
        imageUrl: bootstrap,
        name: "Bootstrap",
    },
    {
        imageUrl: blender,
        name: "Blender",
    },
    {
        imageUrl: figma,
        name: "Figma",
    },
];

export const experiences = [
    {
        title: "Upcoming! Full-Stack Developer",
        company_name: "FYI101",
        icon: fyi,
        iconBg: "#accbe1",
        date: "January 2024 - Current",
        points: [
            "Build and implement full-stack solutions that are highly scalable, driving positive user experiences and measurable growth, while ensuring optimal performance.",
            "Lead the development of new features and infrastructure, adapting to evolving business needs, to foster innovation and integration into existing systems.",
            "Engage in all phases of software development, providing architectural guidance and focusing on optimization, maintaining high standards in code quality and design.",
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
    {
        title: "Server Assistant",
        company_name: "BlueBlood Steakhouse",
        icon: blueblood,
        iconBg: "#ffffff",
        date: "April 2021 - September 2023",
        points: [
            "Fostered a fine-dining environment by maintaining a polite and professional demeanour, resulting in enhanced guest satisfaction.",
            "Achieved a score of 100% on the server knowledge exam by mastering over 150 menu items, demonstrating commitment and ambition.",
            "Trained 5+ new hires which led them to achieve 90%+ scores on the server knowledge exam, leveraging my attention to detail, communication, and leadership skills.",
        ],
    },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/victoriamazilu',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/victoriamazilu/',
    }
];

export const projects = [
    {
        iconUrl: swarm,
        theme: 'btn-back-yellow',
        name: 'Swarm',
        description: 'Swarm is a full-stack social web application designed to connect and build communities. It\'s a platform for sharing, engaging in discussions, and interacting with like minds.        ',
        link: 'https://github.com/victoriamazilu/Swarm',
    },
    {
        iconUrl: showerscribe,
        theme: 'btn-back-gray',
        name: 'Shower Scribe',
        role: 'Frontend Developer',
        description: 'Shower Scribe is a waterproof device that captures your shower thoughts for those eureka moments you just can\'t afford to forget. It instantly transcribes, auto-titles, groups, and provides LLM recaps for each recording, which is all displayed on a user-friendly web app.',
        link: 'https://github.com/victoriamazilu/Shower-Scribe',
    },
    {
        iconUrl: icon,
        theme: 'btn-back-blue',
        name: 'This website!',
        description: 'Everything you see right now! Built with Javascript, React, and much more...',
        link: 'https://github.com/victoriamazilu/Personal-Website',
    },
];