import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <h1 className="logo">Fitness Tracker</h1>
        <div className="nav-links">
          <NavLink
            to="/activities"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Activities
          </NavLink>
          <NavLink
            to="/filters"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Filters
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Stats
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
