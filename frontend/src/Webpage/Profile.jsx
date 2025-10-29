import { useRef } from 'react';
import { Upload, Image, Trash2 } from 'lucide-react';
import { Button, Card } from '../parts/UI';
import '../styles/main.css'

export function Profile({ user, uploadedImages, handleUpload, handleDeleteImage }) {
    const fileInputRef = useRef(null);

    const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

    const handleButtonClick = () => {
    fileInputRef.current.click(); // opens file dialog
};

return (
    <div>
        <div className="db-header">
        <h1 className="db-title">Hello, {user.name}!</h1>

        <Button variant="primary" onClick={handleButtonClick}>
            <Upload size={18} />
            <span>Upload New Image</span>
        </Button>

        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
        />
    </div>

    <Card title={`My Uploads (${uploadedImages.length})`}>
        {uploadedImages.length === 0 ? (
            <div>
                <Image size={48} />
                <p>No images uploaded yet.</p>
                <p>Use the 'Upload New Image' button to get started.</p>
            </div>
        ) : (
        <div className="image-grid">
            {uploadedImages.map((image) => (
                <div key={image.id} className="image-item">
                <img
                    src={image.url}
                    alt={image.name}
                    className="image-item-img"
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src ='https://placehold.co/400x300/e5e7eb/4b5563?text=Error';
                }}
                />
                <div className="image-item-info">
                    <p title={image.name}>{image.name}</p>
                    <p>Size: {formatFileSize(image.size)}</p>
                    <p> Uploaded:{' '} {new Date(image.uploadedAt).toLocaleDateString()}</p>
                </div>

                <Button
                    variant="danger"
                    onClick={() => handleDeleteImage(image.id)}
                    className="delete-button"
                >
                    <Trash2 size={16} />
                </Button>
                </div>
            ))}
            </div>
        )}
        </Card>
    </div>
    );
}
