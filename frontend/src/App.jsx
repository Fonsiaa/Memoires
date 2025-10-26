    import React, { useState, useEffect, useCallback } from "react";
    import { AuthForm } from "./Webpage/AuthForm";
    import { Dashboard } from "./Webpage/Dashboard";
    import { Toast, Button } from "./parts/UI";

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

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setUser(null);
        setUploadedImages([]);
        showToast("You have been logged out.");
    };

    return (
    <div className="app-container">
        {user ? (
        <>
        <Button onClick={handleLogout} style={{ position: "absolute", top: 20, right: 20 }}>Logout</Button>

        <Dashboard
            user={user}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            showToast={showToast}
        />
        </>
    ) : (
        <AuthForm setUser={setUser} showToast={showToast} />
    )}
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleToastClose}
        />
    </div>
    );
}

export default App;