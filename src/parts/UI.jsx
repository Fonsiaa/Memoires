import React, { useEffect } from 'react';

// Button, Input, Card, Toast here

export const Input = ({ label, id, type = "text", value, onChange, placeholder, className = "", required = false }) => (
<div className="input">
    <label htmlFor={id} className="input-label">{label}</label>
    <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${className}`}
        required={required}
    />
    </div>
);

export const Button = ({ onClick, children, className = "", type = "button", disabled = false, variant, style }) => {
    const variantClass = variant ? `button-${variant}` : "";
    return (
        <button
            onClick={onClick}
            className={`button ${variantClass} ${className}`}
            type={type}
            disabled={disabled}
            style={style}>
        {children}
        </button>
    );
};

export const Card = ({ title, children, className = "" }) => (
    <div className={`card ${className}`}>
        {title && <h2 className="card-title">{title}</h2>}
        {children}
    </div>
);

export const Toast = ({ message, type, onClose }) => {
    const isError = type === "error";
    const bgColorClass = isError ? "toast-error" : "toast-success";
    const title = isError ? "Error" : "Success";

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
