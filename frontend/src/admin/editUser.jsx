import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        fetch(`http://localhost:3000/api/user/${id}`)
        .then((res) => res.json())
        .then((data) => setUser({ ...data, password: "" }));
    }, [id]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
        navigate("/");
    };

return (
    <div className="admin-container">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
            <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Name" required />
            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" required />
            <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
            <button type="submit">Update User</button>
        </form>
    </div>
    );
}

export default EditUser;