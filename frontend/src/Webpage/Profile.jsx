import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Share2, Plus } from 'lucide-react';
import { Button, Card } from '../parts/UI';
import '../styles/main.scss';

const DEFAULT_USER = { name: 'Your Name', username: 'username', bannerUrl: null };
const DEFAULT_CATS = ['Family','Friends','Events','Pets','Documents'];

function safeParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
}

function readFeedImages() {
    return safeParse(localStorage.getItem('feedImages'), []);
}

function writeFeedImages(arr) {
    try { localStorage.setItem('feedImages', JSON.stringify(arr)); } catch (e) {}
}

function readUserProfile() {
    return safeParse(localStorage.getItem('userProfile'), DEFAULT_USER);
}

function writeUserProfile(profile) {
    try { localStorage.setItem('userProfile', JSON.stringify(profile)); } catch (e) {}
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k,i)).toFixed(2) + ' ' + sizes[i] || 'B';
}

function Profile({ currentUser }) {
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [user, setUser] = useState(readUserProfile());
    const [feedImages, setFeedImages] = useState(() => {
        const raw = readFeedImages();
        return raw.map(img => ({ ...img, categories: img.categories || (img.category ? [img.category] : []) }));
    });

    const userImages = feedImages.filter(i => i.owner === (currentUser?._id || 'me'));

    const [uploadQueue, setUploadQueue] = useState([]);
    const [processingIndex, setProcessingIndex] = useState(-1);
    const [newImgsBuffer, setNewImgsBuffer] = useState([]);
    const [availableCats, setAvailableCats] = useState(DEFAULT_CATS);
    const [selectedCats, setSelectedCats] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        writeUserProfile(user);
    }, [user]);

    useEffect(() => {
        writeFeedImages(feedImages);
        try { window.dispatchEvent(new Event('feedImagesUpdated')); } catch (e) {}
    }, [feedImages]);

    useEffect(() => {
        try {
            const set = new Set(DEFAULT_CATS);
            feedImages.forEach(i => (i.categories || []).forEach(c => c && set.add(c)));
            setAvailableCats(Array.from(set));
        } catch (e) {}
    }, [feedImages]);

    function triggerFilePick() { 
        fileInputRef.current && fileInputRef.current.click(); 
    }

    function triggerBannerPick() { 
        bannerInputRef.current && bannerInputRef.current.click(); 
    }

    function handleBannerChange(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const url = ev.target.result;
            setUser(prev => ({ ...prev, bannerUrl: url }));
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    function handleFilesSelected(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploadQueue(files);
        setNewImgsBuffer([]);
        setProcessingIndex(0);
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl(url);
        e.target.value = '';
    }

    useEffect(() => {
        return () => {
            if (previewUrl) { 
                try { URL.revokeObjectURL(previewUrl); } catch (e) {} 
            }
        };
    }, [previewUrl]);

    function toggleCategory(cat) {
        setSelectedCats(prev => {
            if (prev.includes(cat)) return prev.filter(c => c !== cat);
            if (prev.length >= 5) return prev;
            return [...prev, cat];
        });
    }

    function addCustomCategory(cat) {
        if (!cat) return;
        if (availableCats.includes(cat)) return toggleCategory(cat);
        setAvailableCats(prev => [cat, ...prev]);
        toggleCategory(cat);
    }

    function confirmCategoriesForCurrent() {
        const file = uploadQueue[processingIndex];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const url = ev.target.result;
            const id = Date.now() + Math.floor(Math.random() * 1000);
            const name = file.name.replace(/\.[^.]+$/, '');
            const newImg = {
                id,
                url,
                name,
                size: file.size,
                uploadedAt: Date.now(),
                owner: currentUser?._id || 'me',
                categories: selectedCats.length ? selectedCats : ['Uncategorized']
            };
            const next = processingIndex + 1;
            setNewImgsBuffer(prev => {
                const nextBuf = [...prev, newImg];
                if (next >= uploadQueue.length) {
                    setFeedImages(prevImgs => [...nextBuf, ...prevImgs]);
                    setUploadQueue([]);
                    setProcessingIndex(-1);
                    setSelectedCats([]);
                    setPreviewUrl(null);
                    return [];
                }
                setProcessingIndex(next);
                try { 
                    const nextUrl = URL.createObjectURL(uploadQueue[next]); 
                    setPreviewUrl(nextUrl); 
                } catch (e) { 
                    setPreviewUrl(null); 
                }
                setSelectedCats([]);
                return nextBuf;
            });
        };
        reader.readAsDataURL(file);
    }

    function cancelCategoryFlow() {
        setUploadQueue([]);
        setProcessingIndex(-1);
        setNewImgsBuffer([]);
        setSelectedCats([]);
        if (previewUrl) { 
            try { URL.revokeObjectURL(previewUrl); } catch (e) {} 
        }
        setPreviewUrl(null);
    }

    function handleDelete(id) {
        if (!confirm('Delete this image?')) return;
        setFeedImages(prev => prev.filter(i => i.id !== id));
    }

    async function shareImage(image) {
        try {
            if (navigator.share) {
                if (image.url && image.url.startsWith('data:')) {
                    const res = await fetch(image.url);
                    const blob = await res.blob();
                    const ext = blob.type.split('/')[1] || 'png';
                    const file = new File([blob], `${image.name || 'image'}.${ext}`, { type: blob.type });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], title: image.name, text: image.name });
                        return;
                    }
                }
                await navigator.share({ title: image.name, text: image.name, url: image.url });
                return;
            }
        } catch (e) {
            console.warn('Web Share failed', e);
        }

        if (navigator.clipboard && image.url) {
            try {
                await navigator.clipboard.writeText(image.url);
                alert('Image copied to clipboard. Paste it into your chat or post.');
                return;
            } catch (e) {}
        }

        try {
            const a = document.createElement('a');
            a.href = image.url;
            a.download = image.name || 'image';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            alert('Unable to share this image from the browser.');
        }
    }

    function updateName(newName) { 
        setUser(prev => ({ ...prev, name: newName })); 
    }
    
    function updateUsername(newUsername) { 
        setUser(prev => ({ ...prev, username: newUsername })); 
    }

    return (
        <div className="profile-page">
            {/* REMOVED: The separate "Post" button from here */}
            
            {/* Category selection modal */}
            {processingIndex >= 0 && processingIndex < uploadQueue.length && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Choose up to 5 categories for this image</h3>
                        <div className="modal-body">
                            <div className="preview">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="preview" />
                                ) : (
                                    <div className="preview-placeholder">Preview</div>
                                )}
                            </div>

                            <div className="categories">
                                <div className="available">
                                    {availableCats.map(cat => (
                                        <label key={cat} className={selectedCats.includes(cat) ? 'selected' : ''}>
                                            <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleCategory(cat)} />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                                <div className="custom-add">
                                    <input placeholder="Add custom category" id="customCatInput" />
                                    <button onClick={() => {
                                        const el = document.getElementById('customCatInput');
                                        if (!el) return; 
                                        addCustomCategory(el.value.trim()); 
                                        el.value = '';
                                    }}>Add</button>
                                </div>
                                <p className="hint">Selected: {selectedCats.length} / 5</p>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button variant="primary" onClick={confirmCategoriesForCurrent}>Confirm</Button>
                            <Button variant="secondary" onClick={() => { setSelectedCats([]); confirmCategoriesForCurrent(); }}>Skip</Button>
                            <Button variant="danger" onClick={cancelCategoryFlow}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <Card title={`My Uploads (${userImages.length})`}>
                {userImages.length === 0 ? (
                    // CLICKABLE UPLOAD BUTTON CARD
                    <div 
                        className="upload-card-empty" 
                        onClick={triggerFilePick}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="upload-card-content">
                            <div className="upload-icon-wrapper">
                                <Plus size={48} className="upload-icon" />
                            </div>
                            <p className="upload-title">No images uploaded yet</p>
                            <p className="upload-subtitle">Click here or drag & drop to add pictures from your device</p>
                            <Button variant="primary" className="upload-button">
                                <Upload size={16} /> Upload Images
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="image-grid profile-grid">
                        {/* ADD UPLOAD CARD AT THE BEGINNING */}
                        <div 
                            className="upload-card-with-images" 
                            onClick={triggerFilePick}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="upload-card-inner">
                                <Plus size={32} />
                                <span>Upload More</span>
                            </div>
                        </div>
                        
                        {/* Existing images */}
                        {userImages.map(image => (
                            <div key={image.id} className="image-item">
                                <img src={image.url} alt={image.name} onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/400x300/e5e7eb/4b5563?text=Error'}} />
                                <div className="image-item-info">
                                    <p className="img-name" title={image.name}>{image.name}</p>
                                    <p className="img-meta">{formatFileSize(image.size)} • {new Date(image.uploadedAt).toLocaleDateString()}</p>
                                </div>
                                <Button variant="danger" onClick={() => handleDelete(image.id)} className="delete-button">
                                    <Trash2 size={14} /> Delete
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Hidden file input */}
            <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                multiple 
                style={{display:'none'}} 
                onChange={handleFilesSelected} 
            />
        </div>
    );
}

export default Profile;