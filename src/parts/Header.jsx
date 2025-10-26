    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import '../styles/main.scss';

    export default function Navbar() {
        return (
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-logo">
              <img src={logoImg} alt="Logo" />
              <span>MyPinBoard</span>
            </div>
            <div className="navbar-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                Home
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                Profile
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                Settings
              </NavLink>
            </div>
          </div>
        </nav>
      );
    }
