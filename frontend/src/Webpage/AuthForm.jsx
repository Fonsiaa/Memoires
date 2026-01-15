import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Eye, Mail, Key } from "lucide-react";
import "../styles/main.scss";

// API Configuration
const API_BASE_URL = 'http://localhost:2824/api';

export function AuthForm({ setUser, showToast }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Login failed (HTTP ${res.status})`);
            }
            
            const data = await res.json();
            if (!data.user) {
                throw new Error("Invalid response from server");
            }
            
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            setUser(data.user);
            try {
                window.dispatchEvent(new Event("userUpdated"));
            } catch (e) {}
            showToast(`Welcome back, ${data.user.name}!`);
            navigate('/');
        } catch (err) {
            showToast(err.message, "error");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (name, email, password) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Signup failed (HTTP ${res.status})`);
            }
            
            const data = await res.json();
            localStorage.setItem("currentUser", JSON.stringify(data));
            setUser(data);
            try {
                window.dispatchEvent(new Event("userUpdated"));
            } catch (e) {}
            showToast("Account created successfully!");
            setIsLogin(true);
            navigate('/');
        } catch (err) {
            showToast(err.message, "error");
            console.error("Signup error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin(email, password);
        } else {
            if (!name.trim()) {
                showToast("Please enter your name", "error");
                return;
            }
            if (password.length < 6) {
                showToast("Password must be at least 6 characters", "error");
                return;
            }
            handleSignUp(name, email, password);
        }
    };

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const userParam = params.get('user');
            if (userParam) {
                const user = JSON.parse(decodeURIComponent(userParam));
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (typeof setUser === 'function') setUser(user);
                try { window.dispatchEvent(new Event('userUpdated')); } catch (e) {}
                if (typeof showToast === 'function') showToast(`Welcome, ${user.name}!`);
                const clean = window.location.pathname;
                window.history.replaceState({}, document.title, clean);
                navigate('/');
            }
        } catch (e) {
            console.error("Error parsing user from URL:", e);
        }
    }, []);

    return (
        <div className="app-wrap">
            <div className="auth-card">
                {/* Left side - form */}
                <div className="auth-left">
                    <div className="heading">
                        <h2 className="title">{isLogin ? "Member Login" : "Sign Up"}</h2>
                        <p className="subtitle">
                            {isLogin ? "Please fill in your basic info" : "Create your account"}
                        </p>
                    </div>

                    <form className="form" onSubmit={handleSubmit} noValidate>
                        {!isLogin && (
                            <label className="field">
                                <span className="icon">
                                    <UserPlus size={18} />
                                </span>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full name"
                                    required
                                    disabled={isLoading}
                                />
                            </label>
                        )}

                        <label className="field">
                            <span className="icon">
                                <Mail size={18} />
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                disabled={isLoading}
                            />
                        </label>

                        <label className="field password-row">
                            <span className="icon">
                                <Key size={18} />
                            </span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label="Toggle password visibility"
                                disabled={isLoading}
                            >
                                <Eye size={16} />
                            </button>
                        </label>

                        <button 
                            type="submit" 
                            className="btn-login"
                            disabled={isLoading}
                        >
                            <span className="btn-icon">
                                {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                            </span>
                            {isLoading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
                        </button>

                        {isLogin && (
                            <button
                                type="button"
                                className="forgot"
                                onClick={() => showToast("Forgot password flow not implemented")}
                                disabled={isLoading}
                            >
                                Forgot Password?
                            </button>
                        )}
                    </form>
                </div>

                {/* Right side - social signup */}
                <div className="auth-right">
                    <img src="" alt="" />
                </div>
            </div>

            <p className="switch-note">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                    type="button"
                    onClick={() => !isLoading && setIsLogin(!isLogin)}
                    className="link-button"
                    disabled={isLoading}
                >
                    {isLogin ? "Sign Up" : "Login"}
                </button>
            </p>
        </div>
    );
}