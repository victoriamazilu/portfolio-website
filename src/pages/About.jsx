import React from 'react'
import {skills, experiences, socialLinks} from '../constants'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CTA from '../components/CTA';
import { Link } from "react-router-dom";


const About = () => {
  return (
    <section className="max-container">
      <h1 className="head-text">Hi, I'm <span className="blue-gradient_text font-semibold drop-shadow">Victoria!</span> 👋</h1>
      <div className="mt-5 flex flex-col cap-3 text-slate-500">
        <p>Software Engineer from Toronto currently in my first year at the University of Waterloo!  My enthusiasm for learning and innovating fuels my love for tackling challenging problems with determination and enthusiasm.</p>
      </div>

      {/* Social links */}
      <div className="flex justify-center items-center mt-8">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            <img
              src={social.iconUrl}
              alt={social.name}
              className="w-8 h-8 object-contain" // Adjust size as needed
            />
          </a>
        ))}
      </div>

      {/* Skill boxes */}
      <div className="py-10 flex flex-col">
        <h3 className="subhead-text">My Skills</h3>
        <div className="mt-16 flex flex-wrap gap-12">
          {skills.map((skill) => (
            <div className="block-container w-20 h-20" key={skill.name}>
              <div className="btn-back rounded-xl shadow-lg"/>
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img 
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
              <p className="text-sm text-center mt-20 text-slate-500">{skill.name}</p>
            </div>
          ))}
        </div>

        <div className="py-20">
          <h3 className="subhead-text">Work Experience</h3>
          <div className="mt-5 flex flex-col gap-3 text-slate-500">
            <p>I've worked with many types of companies, developing both soft and technical skills. Here's a summary:</p>
          </div>
        </div>

        {/* Imported React timeline component with styling */}
        <div className="flex">
          <VerticalTimeline>
            {experiences.map((experience) => (
              <VerticalTimelineElement 
                key={experience.company_name} 
                date={experience.date} 
                icon={<div className="flex justify-center items-center w-full h-full">
                  <img 
                    src={experience.icon} 
                    alt={experience.company_name}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>}
                iconStyle={{background:experience.iconBg}}
                contentStyle={{
                  borderBottom: '8px',
                  borderStyle: 'solid',
                  borderBottomColor: experience.iconBg,
                  boxShadow: 'none',
                }}
                
                >
                <div>
                  <h3 className="text-black text-xl font-poppins font-semibold">{experience.title}</h3>
                  <p className="text-black-500 font-medium font-base" style={{margin:0}}>{experience.company_name}</p>
                </div>
                <div className="my-5 list-disc ml-5 space-y-2">
                  {experience.company_name === "FYI101" && <h4 className="text-black-500/50 font-normal pl-1 text-medium">Objectives:</h4>}
                  <ul className="my-5 list-disc ml-5 space-y-2">
                    {experience.points.map((point, index) => (
                      <li className="text-black-500/50 font-normal pl-1 text-sm" key={`experience-point-${index}`}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <hr className="border-slate-300" />

      <CTA />
    </section>
  )
}

export default About