import React from 'react';
import { Upload, Image, Trash2 } from 'lucide-react';
import { Button, Card } from './UI';

export function Dashboard({ user, uploadedImages, handleUpload, handleDeleteImage }) {
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
};

return (
    <div>
        <div className="db-header">
            <h1 className="db-title">Hello, {user.name}!</h1>
            <label style={{ cursor: "pointer" }}>
            <Button variant="primary">
                <Upload size={18} /><span>Upload New Image</span>
            </Button>
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: "none" }}
            />
        </label>
    </div>

    <Card title={`My Uploads (${uploadedImages.length})`}>
        {uploadedImages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem", color: "#6b7280" }}>
            <Image size={48} style={{ display: "block", margin: "0 auto 1rem" }} />
            <p>No images uploaded yet.</p>
            <p>Use the 'Upload New Image' button to get started.</p>
        </div>
        ) : (
            <div className="image-grid">
                {uploadedImages.map((image) => (
                <div key={image.id} className="image-item" style={{ position: "relative" }}>
                <img
                    src={image.url}
                    alt={image.name}
                    className="image-item-img"
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x300/e5e7eb/4b5563?text=Error`;
                    }}
                />
                <div className="image-item-info">
                <p
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#1f2937",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",}}
                    title={image.name}>
                        {image.name}
                    </p>

                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                        Size: {formatFileSize(image.size)}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                </div>

                <Button
                    variant="danger"
                    onClick={() => handleDeleteImage(image.id)}
                    className="delete-button">
                    <Trash2 size={16} />
                </Button>
                </div>
            ))}
            </div>
        )}
        </Card>
    </div>
    );
};