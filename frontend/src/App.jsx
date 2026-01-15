// the main application component that manages the whole app
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./parts/Header";
import Favourite from "./Webpage/Favourite";
import { AuthForm } from "./Webpage/AuthForm";
import Profile from "./Webpage/Profile";
import Home from "./Webpage/Home";
import Userlist from "./Webpage/Userlist";

import "./styles/main.scss";

function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try { const raw = localStorage.getItem('currentUser'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    });

    // simple toast state
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(id);
    }, [toast]);

    function showToast(message, type = 'info') {
        setToast({ message, type });
    }

    // Check for OAuth redirect and fetch user data
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authStatus = urlParams.get('auth');
        
        if (authStatus === 'success') {
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Fetch current user from backend
            fetch('http://localhost:2824/auth/success', {
                credentials: 'include' // Include cookies for session
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setCurrentUser(data.user);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    showToast('Successfully logged in with Google!', 'success');
                }
            })
            .catch(err => {
                console.error('Error fetching user after OAuth:', err);
                showToast('Login failed', 'error');
            });
        } else if (authStatus === 'failed') {
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
            showToast('Google login failed', 'error');
        }
    }, []);

    return (
        <>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home currentUser={currentUser} />} />
                <Route path="/favourites" element={<Favourite />} />
                <Route path="/userlist" element={<Userlist />} />
                <Route path="/profile" element={<Profile currentUser={currentUser} />} />
                <Route path="/auth" element={<AuthForm setUser={(u) => { setCurrentUser(u); localStorage.setItem('currentUser', JSON.stringify(u)); }} showToast={showToast} />} />
            </Routes>
        </Router>

        {toast && (
            <div style={{ position: 'fixed', right: 20, top: 20, background: toast.type === 'error' ? '#fee2e2' : '#eef2ff', color: '#111827', padding: '10px 14px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                {toast.message}
            </div>
        )}
        </>
    );
}

export default App;