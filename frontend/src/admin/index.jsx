// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import "../styles/layout/admin.css";

function AdminPanel() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
    // Replace with your actual API endpoint
    fetch("http://localhost:3000/api/user")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Failed to fetch users:", err));
    }, []);

return (
    <div className="admin-container">
        <h2>Admin Panel</h2>
        <a href="/add-user">Add User</a>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {users.length > 0 ? (
                users.map((user) => (
                    <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                        <td>
                          {/* Example actions */}
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="3">No users found</td>
                </tr>
                )}
            </tbody>
        </table>
    </div>
    );
}

export default AdminPanel;
