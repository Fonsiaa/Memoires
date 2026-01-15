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

    const [confirmText, setConfirmText] = useState("");

    const handleDelete = async () => {
        if (confirmText !== "DELETE") {
            alert("Please type 'DELETE' exactly to proceed.");
            return;
        }

        try {
            await axios.delete(`http://localhost:2824/api/users/${selectedUserId}`);

            setUsers(users.filter(u => u._id !== selectedUserId));
            setShowModal(false);
            setConfirmText(""); // Clear input
            alert("Account successfully deleted.");
        } catch (err) {
            alert("Error deleting account: " + (err.response?.data?.message || "Server error"));
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
                        <p>This action is permanent. Please type <strong>DELETE</strong> to confirm.</p>
                        <input 
                            type="text" 
                            placeholder="Type DELETE here"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className={confirmText === "DELETE" ? "input-valid" : ""}
                        />
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => { setShowModal(false); setConfirmText(""); }}>
                                Cancel
                            </button>
                            <button 
                                className="btn-confirm" 
                                onClick={handleDelete}
                                disabled={confirmText !== "DELETE"} // Disables button until text matches
                                style={{ opacity: confirmText === "DELETE" ? 1 : 0.5 }}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;