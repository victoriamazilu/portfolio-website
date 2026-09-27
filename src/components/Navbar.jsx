import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header masthead">
      <NavLink to="/" className="mast-brand">
        V.M.
      </NavLink>
      <nav className="mast-nav">
        <NavLink
          to="/experience"
          className={({ isActive }) =>
            isActive ? "mast-link is-active" : "mast-link"
          }
        >
          Experience
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "mast-link is-active" : "mast-link"
          }
        >
          Projects
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
