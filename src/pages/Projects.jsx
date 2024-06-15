import React from 'react'
import {projects} from '../constants'
import { Link } from "react-router-dom";
import { arrow } from '../assets/icons';
import CTA from '../components/CTA';
import BackButton from '../components/BackButton';


const Projects = () => {
  return (
    <section className="max-container">
      <div className="flex justify-between">
        <h1 className="head-text">My <span className="blue-gradient_text font-semibold drop-shadow">Projects</span></h1>
        <div className="flex justify-end items-center">
          <BackButton />
        </div>
      </div>

      <div className="mt-5 flex flex-col cap-3 text-slate-500">
        <p>Recently, I've been sharpening my skills through personal projects. Here are a few of the projects I've been working on, each presenting unique challenges and learning opportunities.  Lots more to come in the future!</p>
      </div>

      <div className="flex flex-wrap my-20 gap-16">
        {projects.map((project) => (
          <div className="lg:w-400 w-full" key={project.name}>
            <div className="block-container w-12 h-12">
              <div className={`btn-back rounded-xl ${project.theme}`}/>
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img 
                  src={project.iconUrl}
                  alt="Project Icon"
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col">
              <h4 className="text-2xl font-poppins font-semibold">{project.name}</h4>
              {project.role && 
                <h4 className="text-medium font-poppins">Role: {project.role}</h4>
              }
              <p className="mt-2 text-slate-500">{project.description}</p>
              {project.link && 
                <div className="mt-5 flex items-center gap-2 font-poppins">
                <Link to={project.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600">
                  Github Link
                </Link>
                <img src={arrow} alt="arrow" className="w-4 h-4 object-contain"/>
                </div>
              }
              {project.name === "Swarm" && 
                <div className="mt-2 flex items-center gap-2 font-poppins">
                  <Link to="https://swarm.vmazilu.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600">
                    Live Link
                  </Link>
                  <img src={arrow} alt="arrow" className="w-4 h-4 object-contain"/>
                </div>
              }
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-200" />

      <CTA />
    </section>
  )
}

export default Projects
