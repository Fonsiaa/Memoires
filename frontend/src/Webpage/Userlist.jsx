import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/main.scss';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:2824/api/users');
        setUsers(res.data);
    };

    useEffect(() => { fetchUsers(); }, []);

    const openDeleteModal = (id) => {
        setSelectedUserId(id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.post(`http://localhost:2824/api/users/delete-confirm/${selectedUserId}`, {
                password: confirmPassword
            });
            
            setUsers(users.filter(u => u._id !== selectedUserId));
            setShowModal(false);
            setConfirmPassword("");
            alert("Account deleted.");
        } catch (err) {
            alert(err.response?.data?.message || "Incorrect password");
        }
    };

    return (
        <div className="user-container">
            <h2>User Management</h2>
            <div className="user-grid">
                {users.map(user => (
                    <div key={user._id} className="user-card">
                        <span>{user.name} ({user.email})</span>
                        <button className="btn-delete" onClick={() => openDeleteModal(user._id)}>
                            Delete Account
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Please enter your password to confirm you want to delete this account.</p>
                        <input 
                            type="password" 
                            placeholder="Enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={handleDelete}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;