import React from 'react'
import {Link} from "react-router-dom"
import {arrow} from '../assets/icons'

const InfoBox = ({text, link, btnText}) => (
    <div className="text-xl lg:text-2xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 lg:py-6 text-white mx-10">
        <p className="text-sm lg:text-xl text-center">{text}</p>
        <Link to={link} className="text-sm lg:text-lg neo-brutalism-white neo-btn">
            {btnText}
            <img src={arrow} className="w-4 h-4 object-contain"/>
        </Link>
    </div>
)

const renderContent = {
    1: (
        <div>
            <h1 className="text-xl lg:text-2xl sm:leading-snug text-center neo-brutalism-blue py-1 px-8 lg:py-4 text-white mx-10">Hi, I'm <span className="font-semibold">Victoria!</span> 👋
            <br/><span className="text-sm lg:text-xl">A Software Engineering student at the University of Waterloo.</span>
            <br/><span className="text-xs text-white">Hold and drag the island!</span>
            </h1>
        </div>
    ),
    2: (
        <InfoBox 
            text="Learned many new skills throughout the past few years..."
            link="/about"
            btnText="Work Experience"
        />
    ),
    3: (
        <InfoBox 
            text="Brought a variety of innovative projects to life..."
            link="/projects"
            btnText="Visit My Portfolio"
        />
    ),
    4: (
        <InfoBox 
            text="Looking for Software Engineer? I'm just a few keystrokes away..."
            link="/contact"
            btnText="Let's talk!"
        />
    ),
}

const HomeInfo = ( {currentStage} ) => {
  return renderContent[currentStage] || null;
}

export default HomeInfo