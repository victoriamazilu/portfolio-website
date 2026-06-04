import { projects } from "../constants";
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

      <div className="mt-14">
        {projects.map((project, i) => {
          const href = project.liveLink || project.link;
          return (
            <a
              key={project.name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-row group block"
            >
              <div className="flex items-start gap-5 sm:gap-8">
                <span className="work-meta pt-2.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="proj-name work-serif text-3xl sm:text-5xl text-[#16150f]">
                      {project.name}
                    </h3>
                    <Arrow />
                  </div>

                  {project.role && (
                    <p className="proj-desc work-meta mt-2">{project.role}</p>
                  )}

                  <p className="proj-desc text-sm leading-relaxed text-[#56544c] mt-3 max-w-xl line-clamp-2">
                    {project.description}
                  </p>

                  <div className="proj-desc flex items-center gap-6 mt-4">
                    {project.liveLink && (
                      <span className="work-link">Live ↗</span>
                    )}
                    {project.link && (
                      <span className="work-link">GitHub ↗</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
