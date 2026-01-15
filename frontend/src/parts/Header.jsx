import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, User } from 'lucide-react';
import '../styles/main.scss';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const containerRef = useRef(null);
  const avatarRef = useRef(null);
  const fileInputRef = useRef(null);

  const isSmallScreen = () => {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    } catch (e) {
      return false;
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Get random color based on user name
  const getAvatarColor = () => {
    if (!user?.name) return '#4f46e5';
    const colors = [
      '#af6746ff', '#c8c195ff', '#ffbb33ff', '#462603ff',
      '#67537fff', '#30240eff', '#e1be66ff', '#835812ff',
    ];
    const nameSum = user.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[nameSum % colors.length];
  };

  // Handle avatar image upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      
      // Update user in state and localStorage
      const updatedUser = {
        ...user,
        avatar: imageUrl
      };
      
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Dispatch event for other components
      try {
        window.dispatchEvent(new Event('userUpdated'));
      } catch (e) {}
      
      setShowAvatarOptions(false);
    };
    reader.readAsDataURL(file);
  };

  // Remove avatar image
  const handleRemoveAvatar = () => {
    const updatedUser = { ...user };
    delete updatedUser.avatar;
    
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    try {
      window.dispatchEvent(new Event('userUpdated'));
    } catch (e) {}
    
    setShowAvatarOptions(false);
  };

  // Handle avatar click
  const handleAvatarClick = (e) => {
    e.preventDefault();
    if (user) {
      setShowAvatarOptions(!showAvatarOptions);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Call backend logout
    fetch('http://localhost:2824/auth/logout', {
      credentials: 'include' // Include cookies for session
    })
    .then(() => {
      setUser(null);
      localStorage.removeItem('currentUser');
      try {
        window.dispatchEvent(new Event('userUpdated'));
      } catch (e) {}
      setOpen(false);
    })
    .catch(err => {
      console.error('Logout error:', err);
      // Still clear local state even if backend call fails
      setUser(null);
      localStorage.removeItem('currentUser');
      setOpen(false);
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      
      // Close admin dropdown
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
      
      // Close avatar options if clicking outside
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowAvatarOptions(false);
      }
    }

    function onEscape(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        setShowAvatarOptions(false);
      }
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEscape);
    
    // Listen for user updates
    function onUserUpdated() {
      try {
        const raw = localStorage.getItem('currentUser');
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    }
    
    window.addEventListener('userUpdated', onUserUpdated);
    
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

  // Initial load of user
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
      
      {/* Avatar Section */}
      <div className="avatar-container" ref={avatarRef}>
        {user ? (
          <>
            <NavLink 
              to="/profile" 
              className="nav-banner-link" 
              aria-label="Go to profile"
              onClick={handleAvatarClick}
            >
              <div className="avatar-wrapper">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={`${user.name} profile`} 
                    className="nav-banner"
                  />
                ) : (
                  <div 
                    className="avatar-initials" 
                    style={{ backgroundColor: getAvatarColor() }}
                  >
                    {getUserInitials()}
                  </div>
                )}
                
                {/* Camera icon overlay */}
                <div className="avatar-overlay">
                  <Camera size={16} />
                </div>
              </div>
            </NavLink>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            
            {/* Avatar upload options dropdown */}
            {showAvatarOptions && (
              <div className="avatar-options-dropdown">
                <div className="dropdown-header">
                  <h4>Profile Picture</h4>
                  <p>Update your profile image</p>
                </div>
                
                <div className="dropdown-actions">
                  <button 
                    type="button" 
                    className="dropdown-btn upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={24} />
                    <span>Upload New Photo</span>
                  </button>
                  
                  {user.avatar && (
                    <button 
                      type="button" 
                      className="dropdown-btn remove"
                      onClick={handleRemoveAvatar}
                    >
                      <span>Remove Photo</span>
                    </button>
                  )}
                  
                  <NavLink 
                    to="/profile" 
                    className="dropdown-btn profile"
                    onClick={() => setShowAvatarOptions(false)}
                  >
                    <User size={16} />
                    <span>View Profile</span>
                  </NavLink>
                  
                  <button 
                    type="button" 
                    className="dropdown-btn cancel"
                    onClick={() => setShowAvatarOptions(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <NavLink to="/auth" className="nav-banner-link" aria-label="Go to login">
            <div className="avatar-wrapper">
              <div className="avatar-initials" style={{ backgroundColor: '#9ca3af' }}>
                <User size={20} />
              </div>
            </div>
          </NavLink>
        )}
      </div>
      
      <nav className="nav-links">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/favourites" className="nav-link">Favourites</NavLink>
        <NavLink to="/map" className="nav-link">Map</NavLink>

        {/* Admin dropdown */}
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
              if (isSmallScreen()) {
                e.preventDefault();
                setOpen((s) => !s);
              }
            }}
          >
            Setting
          </NavLink>

          <ul className={`dropdown ${open ? 'open' : ''}`} role="menu" aria-label="Admin menu">
            <li role="none"><NavLink role="menuitem" to="/userlist" className="nav-link" onClick={() => setOpen(false)}>Admin</NavLink></li>
            <li role="none">
              {user ? (
                <button
                  role="menuitem"
                  className="nav-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  role="menuitem"
                  to="/auth"
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;