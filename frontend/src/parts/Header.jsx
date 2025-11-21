import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/main.scss';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);

  const isSmallScreen = () => {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }

    function onEscape(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEscape);
    // listen for local user updates (login/signup/avatar change)
    function onUserUpdated() {
      try {
        const raw = localStorage.getItem('currentUser');
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    }
    window.addEventListener('userUpdated', onUserUpdated);
    // also catch cross-tab storage events
    function onStorage(e) {
      if (e.key === 'currentUser') onUserUpdated();
    }
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEscape);
      window.removeEventListener('userUpdated', onUserUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // initial load of user
  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      setUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setUser(null);
    }
  }, []);

  return (
  <div className="nav" ref={containerRef}>
    <h1>{user && user.name ? `${user.name}'s Memoires` : "Memoires"}</h1>
    <NavLink to="/profile" className="nav-banner-link" aria-label="Go to profile">
      <img src="https://jp.4d.com/sites/default/files/u3332/4d_client2x.png" alt="User profile" className="nav-banner" />
    </NavLink>
    <nav className="nav-links">
      <NavLink to="/" end className="nav-link">Home</NavLink>
      <NavLink to="/favourites" className="nav-link">Favourites</NavLink>

      {/* Admin dropdown — hover on desktop, tap to open on small screens */}
      <div
        className={`nav-item nav-item--dropdown ${open ? 'open' : ''}`}
        onMouseEnter={() => !isSmallScreen() && setOpen(true)}
        onMouseLeave={() => !isSmallScreen() && setOpen(false)}
        onFocus={() => !isSmallScreen() && setOpen(true)}
        onBlur={() => !isSmallScreen() && setOpen(false)}
      >
        <NavLink
          className="nav-link"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={(e) => {
            // On small screens, tapping Admin should open the menu instead of navigating
            if (isSmallScreen()) {
              e.preventDefault();
              setOpen((s) => !s);
            }
          }}
        >
          Admin
        </NavLink>

        <ul className={`dropdown ${open ? 'open' : ''}`} role="menu" aria-label="Admin menu">
          <li role="none"><NavLink role="menuitem" to="/dashbd" className="nav-link" onClick={() => setOpen(false)}>Dashboard</NavLink></li>
          <li role="none"><NavLink role="menuitem" to="/profile" className="nav-link" onClick={() => setOpen(false)}>Uploads</NavLink></li>
          <li role="none"><NavLink role="menuitem" to="/auth" className="nav-link" onClick={() => setOpen(false)}>Login</NavLink></li>
        </ul>
      </div>
    </nav>

  </div>
  );
}

export default Navbar;