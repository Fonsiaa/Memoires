// the main application component that manages the whole app
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./parts/Header";

import Favourite from "./Webpage/Favourite";

import { AuthForm } from "./Webpage/AuthForm";
import Profile from "./Webpage/Profile";
import Admin from "./Webpage/Admin";
import Home from "./Webpage/Home";

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

    return (
        <>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favourites" element={<Favourite />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<AuthForm setUser={(u) => { setCurrentUser(u); localStorage.setItem('currentUser', JSON.stringify(u)); }} showToast={showToast} />} />
                <Route path="/admin" element={<Admin />} />
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