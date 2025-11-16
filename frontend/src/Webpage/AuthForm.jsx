import React, { useState, useEffect } from "react";
import { LogIn, UserPlus, Eye, Mail, Key } from "lucide-react";

import "../styles/main.scss";

export function AuthForm({ setUser, showToast }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (email, password) => {
    try {
        const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    
    const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setUser(data.user);
        try {
        window.dispatchEvent(new Event("userUpdated"));
        } catch (e) {}
        showToast(`Welcome back, ${data.user.name}!`);
    } catch (err) {
        showToast(err.message, "error");
    }
};

    const handleSignUp = async (name, email, password) => {
    try {
    const res = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    
    const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
        localStorage.setItem("currentUser", JSON.stringify(data));setUser(data);
            try {
            window.dispatchEvent(new Event("userUpdated"));
        } catch (e) {}
        showToast("Account created successfully!");
        setIsLogin(true);
    } catch (err) {
        showToast(err.message, "error");
    }
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) handleLogin(email, password);
    else handleSignUp(name, email, password);
};

  // Handle OAuth redirect back from backend (e.g. /auth/facebook/callback -> frontend /auth/success?user=...)
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
        // remove query params from URL
        const clean = window.location.pathname;
        window.history.replaceState({}, document.title, clean);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

return (
    <div className="app-wrap">
        <div className="auth-card">
        <div className="auth-left">
            <div className="heading">
                <h2 className="title">{isLogin ? "Member Login" : "Sign Up"}</h2>
                <p className="subtitle">
                    {isLogin ? "Please fill in your basic info" : "Using your social media account"}
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
            />
            <button
                type="button"
                className="toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
            >
                <Eye size={16} />
            </button>
            </label>

            <button type="submit" className="btn-login">
              <span className="btn-icon">
                {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
              </span>
            </button>

            {isLogin && (
              <button
                type="button"
                className="forgot"
                onClick={() => showToast("Forgot password flow not implemented")}
              >
                Forgot Password?
              </button>
            )}
          </form>
        </div>

        <div className="auth-right">
          <div className="scenic" aria-hidden="true" />
          <div className="signup-panel">
            <h3 className="title">Sign Up</h3>
            <p className="subtitle">Using your social media account</p>

            <div className="social-row">
              <button type="button" className="social gmail" onClick={() => { window.location.href = 'http://localhost:2824/auth/google'; }}>
                <span className="s-icon">G</span>
                <span>Gmail</span>
              </button>
              <button type="button" className="social facebook" onClick={() => { window.location.href = 'http://localhost:2824/auth/facebook'; }}>
                <span className="s-icon">f</span>
                <span>Facebook</span>
              </button>
            </div>

            <label className="terms">
              <input type="checkbox" />
              <span className="terms-text">By signing up, I agree with terms and conditions</span>
            </label>

          </div>
        </div>
      </div>

      <p className="switch-note">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="link-button"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
