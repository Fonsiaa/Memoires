    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import '../styles/main.scss';

function Navbar() {
  return (
    <div className="Nav">
        <img src="" alt="" className='nav-banner'/>
        <nav className="links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/favourites" className="nav-link">Favourites</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            <NavLink to="/auth" className="nav-link">Login</NavLink>
            <NavLink to="/admin" className="nav-link">Admin</NavLink>
        </nav>

    </div>
  );
}

export default Navbar;