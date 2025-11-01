    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import '../styles/main.scss';

function Navbar() {
  return (
  <div className="nav">
    <NavLink to="/profile" className="nav-banner-link" aria-label="Go to profile">
      <img src="https://th.bing.com/th/id/R.84fa39e3cd11493389b813aa24110618?rik=Zkoe%2fkpxfDTyRQ&riu=http%3a%2f%2f3.bp.blogspot.com%2f-rFAFCR2c9Wo%2fUFWCMlw3zuI%2fAAAAAAAAAUw%2fX47SLbF_6Lk%2fs1600%2f25.jpg&ehk=ZUgfiQHpM96JLBkQTjG9QIozFDWjjkISIA3w9btIPVc%3d&risl=&pid=ImgRaw&r=0" alt="User profile" className="nav-banner" />
    </NavLink>
    <nav className="nav-links">
      <NavLink to="/" end className="nav-link">Home</NavLink>
      <NavLink to="/favourites" className="nav-link">Favourites</NavLink>
      <NavLink to="/profile" className="nav-link">Profile</NavLink>
      <NavLink to="/auth" className="nav-link">Login</NavLink>
      <NavLink to="/admin" className="nav-link">Admin</NavLink>
    </nav>

  </div>
  );
}

export default Navbar;