import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Share2 } from 'lucide-react';
import { Button, Card } from '../parts/UI';
import '../styles/main.css';

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

function Profile() {
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [user, setUser] = useState(readUserProfile());
    const [feedImages, setFeedImages] = useState(() => {
        // normalize any old images that used `category` instead of `categories`
        const raw = readFeedImages();
        return raw.map(img => ({ ...img, categories: img.categories || (img.category ? [img.category] : []) }));
    });

    // images uploaded by this user (owner === 'me')
    const userImages = feedImages.filter(i => i.owner === 'me');

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

    // keep availableCats in sync with feedImages
    useEffect(() => {
        try {
            const set = new Set(DEFAULT_CATS);
            feedImages.forEach(i => (i.categories || []).forEach(c => c && set.add(c)));
            setAvailableCats(Array.from(set));
        } catch (e) {}
    }, [feedImages]);

    function triggerFilePick() { fileInputRef.current && fileInputRef.current.click(); }
    function triggerBannerPick() { bannerInputRef.current && bannerInputRef.current.click(); }

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
        // start interactive category assignment flow
        setUploadQueue(files);
        setNewImgsBuffer([]);
        setProcessingIndex(0);
        // setup preview for first file
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl(url);
        e.target.value = '';
    }

    useEffect(() => {
        // revoke previewUrl when processingIndex changes or component unmounts
        return () => {
            if (previewUrl) { try { URL.revokeObjectURL(previewUrl); } catch (e) {} }
        };
    }, [previewUrl]);

    function toggleCategory(cat) {
        setSelectedCats(prev => {
            if (prev.includes(cat)) return prev.filter(c => c !== cat);
            if (prev.length >= 5) return prev; // limit
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
                owner: 'me',
                categories: selectedCats.length ? selectedCats : ['Uncategorized']
            };
            // append to buffer and either continue or finish using the new buffer
            const next = processingIndex + 1;
            setNewImgsBuffer(prev => {
                const nextBuf = [...prev, newImg];
                if (next >= uploadQueue.length) {
                    // finished - append to feedImages using the fully constructed buffer
                    setFeedImages(prevImgs => [...nextBuf, ...prevImgs]);
                    // clean up
                    setUploadQueue([]);
                    setProcessingIndex(-1);
                    setSelectedCats([]);
                    setPreviewUrl(null);
                    return [];
                }
                // continue with next file
                setProcessingIndex(next);
                try { const nextUrl = URL.createObjectURL(uploadQueue[next]); setPreviewUrl(nextUrl); } catch (e) { setPreviewUrl(null); }
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
        if (previewUrl) { try { URL.revokeObjectURL(previewUrl); } catch (e) {} }
        setPreviewUrl(null);
    }

    function handleDelete(id) {
        if (!confirm('Delete this image?')) return;
        setFeedImages(prev => prev.filter(i => i.id !== id));
    }

    async function shareImage(image) {
        // Try Web Share API with file if possible (for data URLs we convert to Blob)
        try {
            if (navigator.share) {
                // If data URL, fetch it to get a blob
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

                // Try sharing URL/text fallback
                await navigator.share({ title: image.name, text: image.name, url: image.url });
                return;
            }
        } catch (e) {
            // continue to fallback options
            console.warn('Web Share failed', e);
        }

        // Fallback: copy image url/data to clipboard
        if (navigator.clipboard && image.url) {
            try {
                await navigator.clipboard.writeText(image.url);
                alert('Image copied to clipboard. Paste it into your chat or post.');
                return;
            } catch (e) {
                // ignore
            }
        }

        // Final fallback: download the image to let the user share/save it
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

    function updateName(newName) { setUser(prev => ({ ...prev, name: newName })); }
    function updateUsername(newUsername) { setUser(prev => ({ ...prev, username: newUsername })); }

    return (
        <div className="profile-page">
            <div className="profile-banner" style={{ backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : 'none' }}>
                {!user.bannerUrl && (
                    <div className="banner-placeholder">No banner set</div>
                )}
                <div className="banner-actions">
                    <Button variant="secondary" onClick={triggerBannerPick}><Upload size={14}/> Change Banner</Button>
                    <input ref={bannerInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleBannerChange} />
                </div>
            </div>

            <div className="profile-header">
                <div className="profile-meta">
                    <div className="profile-name">
                        <input value={user.name} onChange={e => updateName(e.target.value)} className="name-input" />
                        <input value={user.username} onChange={e => updateUsername(e.target.value)} className="username-input" />
                    </div>
                </div>

                <div className="profile-actions">
                    <Button variant="primary" onClick={triggerFilePick}><Upload size={14}/> Upload Images</Button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={handleFilesSelected} />
                </div>
            </div>

            {/* Category selection modal for queued uploads */}
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
                                        if (!el) return; addCustomCategory(el.value.trim()); el.value = '';
                                    }}>Add</button>
                                </div>
                                <p className="hint">Selected: {selectedCats.length} / 5</p>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button variant="primary" onClick={confirmCategoriesForCurrent}>Confirm</Button>
                            <Button variant="secondary" onClick={() => { /* skip categories for this image */ setSelectedCats([]); confirmCategoriesForCurrent(); }}>Skip</Button>
                            <Button variant="danger" onClick={cancelCategoryFlow}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <Card title={`My Uploads (${userImages.length})`}>
                {userImages.length === 0 ? (
                    <div className="no-uploads">
                        <ImageIcon size={48} />
                        <p>No images uploaded yet.</p>
                        <p>Use the 'Upload Images' button to add pictures from your device.</p>
                    </div>
                ) : (
                    <div className="image-grid profile-grid">
                        {userImages.map(image => (
                            <div key={image.id} className="image-item">
                                <img src={image.url} alt={image.name} onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/400x300/e5e7eb/4b5563?text=Error'}} />
                                <div className="image-item-info">
                                    <p className="img-name" title={image.name}>{image.name}</p>
                                    <p className="img-meta">{formatFileSize(image.size)} • {new Date(image.uploadedAt).toLocaleDateString()}</p>
                                </div>
                                <Button variant="danger" onClick={() => handleDelete(image.id)} className="delete-button"><Trash2 size={14} /> Delete</Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Profile;
