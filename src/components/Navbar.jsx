import React from "react";
import { NavLink } from "react-router-dom";

const navbar = () => {
  return (
    <header className="header">
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"
      >
        <p className="blue-gradient_text">V.M.</p>
      </NavLink>
      <nav className="flex text-lg gap-7 font-medium">
        <NavLink
          to="/experience"
          className={({ isActive }) =>
            isActive
              ? "text-blue-800 w-32 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"
              : "text-blue-500 w-32 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"
          }
        >
          Experience
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive
              ? "text-blue-800 w-24 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"
              : "text-blue-500 w-24 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"
          }
        >
          Projects
        </NavLink>
      </nav>
    </header>
  );
};

export default navbar;
