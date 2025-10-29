import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const loadUsers = async () => {
    const res = await fetch("http://localhost:3000/api/user");
    const data = await res.json();
    setUsers(data);
};

    const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        await fetch(`http://localhost:3000/api/user/${id}`, { method: "DELETE" });
        loadUsers();
    }
};

useEffect(() => {
    loadUsers();
}, []);

return (
    <div className="admin-container">
    <h2>Admin Panel</h2>
        <table>
        <thead>
            <tr>
                <th>Name</th><th>Email</th><th>Actions</th>
            </tr>
        </thead>

        <tbody>
            {users.map((u) => (
                <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td> <Link to={`/edit/${u._id}`}>Edit</Link>{" "}
                    <button onClick={() => deleteUser(u._id)}>Delete</button>
                    </td>
                </tr>
        ))}
        {users.length === 0 && (
            <tr><td colSpan="3">No users found</td></tr>
        )}
        </tbody>
        </table>
    </div>
    );
}

export default AdminPanel;
