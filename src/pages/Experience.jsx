import { skills, experiences, socialLinks } from "../constants";
import BackButton from "../components/BackButton";

const Experience = ({ embedded = false }) => {
  return (
    <section
      className={`work-page ${
        embedded ? "px-7 sm:px-12 py-12 max-w-3xl mx-auto" : "max-container"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <header>
          <p className="work-eyebrow">Career</p>
          <h1 className="work-serif text-6xl sm:text-8xl mt-5">Experience</h1>
        </header>
        {!embedded && <BackButton />}
      </div>

      <p className="text-[15px] leading-relaxed text-[#56544c] mt-6 max-w-md">
        Software engineer from Toronto, in my third year at the University of
        Waterloo — working across data engineering, full-stack, and applied ML.
      </p>

      <div className="flex items-center gap-2 mt-7">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="w-9 h-9 rounded-full border border-[#e7e4db] flex items-center justify-center hover:bg-[#faf9f6] transition-colors"
          >
            <img
              src={social.iconUrl}
              alt={social.name}
              className="w-4 h-4 object-contain"
            />
          </a>
        ))}
      </div>

      <div className="mt-14">
        {experiences.map((exp, i) => {
          const isCurrent = /present/i.test(exp.date);
          return (
            <div key={`${exp.company_name}-${i}`} className="exp-row group">
              <div className="flex items-center gap-2">
                <span className="work-meta">{exp.date}</span>
                {isCurrent && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: exp.iconBg }}
                  >
                    <img
                      src={exp.icon}
                      alt={exp.company_name}
                      className="w-[80%] h-[80%] object-contain"
                    />
                  </span>
                  <h3 className="text-[1.05rem] font-medium text-[#16150f] tracking-tight">
                    {exp.title}
                  </h3>
                </div>

                <p className="text-sm text-[#8c897e] mt-1.5">
                  {exp.link ? (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-company text-[#16150f]"
                    >
                      {exp.company_name}
                    </a>
                  ) : (
                    <span className="text-[#16150f]">{exp.company_name}</span>
                  )}
                  {exp.team ? `  ·  ${exp.team}` : ""}
                </p>

                <ul className="mt-4 space-y-2 max-w-xl">
                  {exp.points.map((point, j) => (
                    <li
                      key={j}
                      className="text-sm leading-relaxed text-[#56544c]"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16">
        <p className="work-eyebrow">Toolkit</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="flex items-center gap-2 text-sm text-[#56544c]"
            >
              <img
                src={skill.imageUrl}
                alt={skill.name}
                className="w-4 h-4 object-contain opacity-80"
              />
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
