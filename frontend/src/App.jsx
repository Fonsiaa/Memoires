// the main application component that manages the whole app
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./parts/Header";

import Favourite from "./Webpage/Favourite";

import { AuthForm } from "./Webpage/AuthForm";
import Profile from "./Webpage/Profile";
import Admin from "./Webpage/Admin";
import Home from "./Webpage/Home";

import "./styles/main.scss";

function App() {
    return (
        <>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favourites" element={<Favourite />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
        </>
    );
}

export default App;