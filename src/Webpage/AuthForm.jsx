import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Input, Button, Card } from '../parts/UI';
import '../styles/main.css'

export function AuthForm({ handleLogin, handleSignUp, showToast }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
        handleLogin(email, password);
    } else {
        handleSignUp(name, email, password);
    }
};

return (
    <div>
        <Card title={isLogin ? "Welcome back!" : "Create an Account"}>
        <form onSubmit={handleSubmit}>
            {!isLogin && (
            <Input
                label="Full Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        )}
        <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        <Button type="submit">
            {isLogin ? <><LogIn /> Login</> : <><UserPlus /> Sign Up</>}
        </Button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        
        <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="link-button"
        >
            {isLogin ? "Sign Up" : "Login"}
        </button>
        </p>
        </Card>
    </div>
    );
};
