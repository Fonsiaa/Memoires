import React, { useState, useEffect, useCallback } from "react";
import { AuthForm } from "./Webpage/AuthForm";
import { Dashboard } from "./Webpage/Dashboard";
import { Toast } from "./Webpage/UI";

function App() {
    const [user, setUser] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [toast, setToast] = useState({ message: "", type: "" });

useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
        setUser(storedUser);
        const images = JSON.parse(localStorage.getItem(`userImages_${storedUser.id}`) || "[]");
        setUploadedImages(images);
    }
}, []);

const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    }, []);

const handleToastClose = useCallback(() => {
    setToast({ message: "", type: "" });
    }, []);

const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");

const handleSignUp = (name, email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
        showToast("Account with this email already exists.", "error");
        return;
    }

const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };

const updated = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updated));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);
    showToast(`Welcome, ${name}!`);
};

const handleLogin = (email, password) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        setUser(found);
        const images = JSON.parse(localStorage.getItem(`userImages_${found.id}`) || "[]");
        setUploadedImages(images);
        showToast(`Welcome back, ${found.name}!`);
    } else {
        showToast("Invalid email or password.", "error");
    }
};

const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setUploadedImages([]);
    showToast("You have been logged out.");
};

const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && user) {
        const reader = new FileReader();
        reader.onload = (ev) => {
        const newImg = {
            id: Date.now(),
            url: ev.target.result,
            name: file.name,
            uploadedAt: new Date().toISOString(),
            size: file.size
        };
        const updated = [...uploadedImages, newImg];
        setUploadedImages(updated);
        localStorage.setItem(`userImages_${user.id}`, JSON.stringify(updated));
        showToast(`Image "${file.name}" uploaded successfully!`);
        };
        reader.readAsDataURL(file);
    }
};

const handleDeleteImage = (imageId) => {
    const filtered = uploadedImages.filter((img) => img.id !== imageId);
    setUploadedImages(filtered);
    localStorage.setItem(`userImages_${user.id}`, JSON.stringify(filtered));
    showToast("Image deleted.", "error");
};

return (
    <div className="app-container">
    {!user ? (
        <AuthForm handleLogin={handleLogin} handleSignUp={handleSignUp} showToast={showToast} />
    ) : (
        <Dashboard
            user={user}
            uploadedImages={uploadedImages}
            handleUpload={handleUpload}
            handleDeleteImage={handleDeleteImage}
        />
    )}
        <Toast message={toast.message} type={toast.type} onClose={handleToastClose} />
    </div>
    );
}

export default App;