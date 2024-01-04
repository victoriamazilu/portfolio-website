import React from 'react'
import { NavLink } from 'react-router-dom'

const navbar = () => {
  return (
    <header className="header">
        <NavLink to="/" className="w-10 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"> 
            <p className="blue-gradient_text">V.M.</p>
        </NavLink>
        <nav className="flex text-lg gap-7 font-medium">
            <NavLink to="/about" className={({isActive}) => isActive ? 'text-blue-800 w-20 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md' : 'text-blue-500 w-20 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md'}>
                About
            </NavLink>
            <NavLink to="/projects" className={({isActive}) => isActive ? 'text-blue-800 w-28 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md' : 'text-blue-500 w-28 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md'}>
                Projects
            </NavLink>
        </nav>
    </header>
  )
}

export default navbar