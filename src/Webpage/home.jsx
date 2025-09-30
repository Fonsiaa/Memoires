import { useState, useEffect, useCallback } from 'react';
import { LogIn, UserPlus, Home as HomeIcon, Upload, Image, X, Trash2 } from 'lucide-react';

{/*UI Components*/}
const Input = ({ label, id, type="text", value, onChange, placeholder, classname="" }) => (
    <div className="input">
        <label htmlFor="{id}" className="input-label">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${classname}`}
        />
    </div>
);

const Button = ({ onClick, children, classname="", type="button" }) => {
    return (
        <button onClick={onClick} className={`button ${classname}`} 
        disabled={disabled}>
            {children}
        </button>
    );
};

const Card =({title, children, classname=""}) => (
    <div className={`card ${classname}`}>
        {title && <h2 className="card-title">{title}</h2>}
        {children}
    </div>
);

const Toast = ({ message, type, onClose }) => {
    const isError = type === 'error';
    const bgColorClass = isError ? 'toast-error' : 'toast-success';
    const title = isError ? 'Error' : 'Success';

    useEffect(() => {
    if (message) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast-container">
            <div className={`toast-message ${bgColorClass}`}>
                <div className="toast-header">
                    <p>{title}</p>
                    <p>{message}</p>
                </div>
                <button className="toast-close" onClick={onClose}></button>
            </div>
        </div>
    );
};

{/*Authentication Components*/}
const AuthForm = ({ handleLogin, handleSignUp, showToast }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin(email, password, showToast);
        } else {
            handleSignUp(name, email, password, showToast);
        }
    }
};

return (
    <div>
        <Card title={isLogin ? "Welcome back!" : "Create an Account"}>
            <form onSubmit={handleSubmit}>

            {!isLogin && (
                {/* Name Input Field */}
                <Input
                    label="Full Name"
                    id="name"
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
            )}
                {/* Email Input Field */}
                <Input
                    label="Email"
                    id="email"
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required    
                />

                {/* Password Input Field */}
                <Input
                    label="Password"
                    id="password"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required    
                />

                {/* Submit Button */}
                <Button type="submit">
                    {isLogin ? (<>
                        <LogIn/> Login </>) : (<> {/* The button for Login */}
                        <UserPlus/> Sign Up </>)}
                </Button>

            </form>
        </Card>
    </div>
);

