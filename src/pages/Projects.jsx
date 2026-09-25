import { projects, preAiProjects } from "../constants";
import BackButton from "../components/BackButton";

const Arrow = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    className="proj-arrow text-[#16150f]"
  >
    <path
      d="M7 17L17 7M17 7H9M17 7V15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProjectList = ({ items, className = "mt-14" }) => (
  <div className={className}>
    {items.map((project, i) => {
      const href =
        project.liveLink || project.link || project.links?.[0]?.href;
      const links =
        project.links ||
        [
          project.liveLink && { label: "Live", href: project.liveLink },
          project.link && { label: "GitHub", href: project.link },
          project.announcementLink && {
            label: "Announcement",
            href: project.announcementLink,
          },
        ].filter(Boolean);

      return (
        <article key={project.name} className="proj-row group">
          <div className="flex items-start gap-5 sm:gap-8">
            <span className="work-meta pt-2.5 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex-1 min-w-0">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4"
              >
                <h3 className="proj-name work-serif text-3xl sm:text-5xl text-[#16150f]">
                  {project.name}
                </h3>
                <Arrow />
              </a>

              {project.role && (
                <p className="proj-desc work-meta mt-2">{project.role}</p>
              )}

              <p className="proj-desc text-sm leading-relaxed text-[#56544c] mt-3 max-w-xl line-clamp-2">
                {project.description}
              </p>

              <div className="proj-desc flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
                {links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-link"
                  >
                    {item.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      );
    })}
  </div>
);

const Projects = ({ embedded = false }) => {
  return (
    <section
      className={`work-page ${
        embedded ? "px-7 sm:px-12 py-12 max-w-3xl mx-auto" : "max-container"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <header>
          <p className="work-eyebrow">Selected work</p>
          <h1 className="work-serif text-6xl sm:text-8xl mt-5">Projects</h1>
        </header>
        {!embedded && <BackButton />}
      </div>

      <p className="text-[15px] leading-relaxed text-[#56544c] mt-6 max-w-md">
        Things I've designed and built — from full-stack web apps to playful
        hardware experiments. Plenty more on the way.
      </p>

      <ProjectList items={projects} />

      <details className="preai mt-20">
        <summary className="preai-toggle">
          pre-ai projects :p
          <svg
            className="preai-caret"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.2 1.8L6.8 5 3.2 8.2"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <ProjectList items={preAiProjects} className="mt-6" />
      </details>
    </section>
  );
};

export default Projects;
