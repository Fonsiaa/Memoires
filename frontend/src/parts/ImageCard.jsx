import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Mail, MessageCircle, Link, Download, Copy } from 'lucide-react';
import '../styles/main.scss';

function ImageCard({ image, onToggleFavourite, onUpdateCaption, isFavourite, onShare, onMove, onImgLoad }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(image.name || image.caption || "");
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        setValue(image.name || image.caption || "");
    }, [image]);

    function saveCaption() {
        setEditing(false);
        if (onUpdateCaption) onUpdateCaption(image.id, value);
    }

    // Download image as file
    const downloadImage = async () => {
        try {
            let blob;
            
            if (image.url.startsWith('data:')) {
                const response = await fetch(image.url);
                blob = await response.blob();
            } else {
                const response = await fetch(image.url);
                blob = await response.blob();
            }
            
            const extension = blob.type.split('/')[1] || 'jpg';
            const fileName = image.name ? 
                (image.name.includes('.') ? image.name : `${image.name}.${extension}`) : 
                `image.${extension}`;
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            alert('✅ Image downloaded!');
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    };

    // Copy image to clipboard
    const copyImageToClipboard = async () => {
        try {
            if (navigator.clipboard && window.ClipboardItem) {
                let blob;
                
                if (image.url.startsWith('data:')) {
                    const response = await fetch(image.url);
                    blob = await response.blob();
                } else {
                    const response = await fetch(image.url);
                    blob = await response.blob();
                }
                
                const clipboardItem = new ClipboardItem({ [blob.type]: blob });
                await navigator.clipboard.write([clipboardItem]);
                alert('✅ Image copied to clipboard!');
                return true;
            } else {
                alert('❌ Copy to clipboard not supported in this browser');
                return false;
            }
        } catch (error) {
            console.error('Copy failed:', error);
            alert('❌ Failed to copy image');
            return false;
        }
    };

    // Share to specific social media platforms
    const shareToPlatform = async (platform) => {
        const caption = value || image.name || 'Check out this image!';
        const encodedCaption = encodeURIComponent(caption);
        
        try {
            // First download the image to get a file
            const downloaded = await downloadImage();
            if (!downloaded) {
                alert('❌ Need to download image first to share');
                return;
            }

            // For platforms that need file upload, we'll guide the user
            switch(platform) {
                case 'facebook':
                    // Facebook doesn't support direct image sharing via URL
                    // We'll open their composer with text
                    window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedCaption}`,
                        '_blank',
                        'width=600,height=400'
                    );
                    alert('⚠️ Please upload the downloaded image to Facebook');
                    break;
                    
                case 'twitter':
                    window.open(
                        `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodeURIComponent(window.location.href)}`,
                        '_blank',
                        'width=600,height=400'
                    );
                    alert('⚠️ Please attach the downloaded image to your tweet');
                    break;
                    
                case 'instagram':
                    // Instagram doesn't have web sharing, show instructions
                    alert('📱 To share on Instagram:\n1. Open Instagram app\n2. Create a new post\n3. Select the downloaded image from your gallery');
                    break;
                    
                case 'whatsapp':
                    if (navigator.share) {
                        try {
                            let blob;
                            if (image.url.startsWith('data:')) {
                                const response = await fetch(image.url);
                                blob = await response.blob();
                            } else {
                                const response = await fetch(image.url);
                                blob = await response.blob();
                            }
                            
                            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                            
                            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                await navigator.share({
                                    files: [file],
                                    title: caption,
                                    text: caption
                                });
                                return;
                            }
                        } catch (e) {
                            console.log('Direct share failed:', e);
                        }
                    }
                    // Fallback: WhatsApp web
                    window.open(
                        `https://web.whatsapp.com/send?text=${encodedCaption}%20${encodeURIComponent(window.location.href)}`,
                        '_blank'
                    );
                    alert('⚠️ Please attach the downloaded image to your message');
                    break;
                    
                case 'email':
                    const subject = encodeURIComponent(caption);
                    const body = encodeURIComponent(`${caption}\n\nDownloaded from Memoires`);
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    alert('⚠️ Please attach the downloaded image to your email');
                    break;
                    
                case 'messenger':
                    window.open(
                        `https://www.facebook.com/dialog/send?app_id=123456789&link=${encodeURIComponent(window.location.href)}&redirect_uri=${encodeURIComponent(window.location.href)}`,
                        '_blank',
                        'width=600,height=400'
                    );
                    alert('⚠️ Please attach the downloaded image to your message');
                    break;
                    
                default:
                    break;
            }
            
        } catch (error) {
            console.error('Platform share error:', error);
            alert('❌ Failed to share. Please try downloading and sharing manually.');
        }
    };

    // Modern Web Share API
    const useNativeShare = async () => {
        try {
            if (navigator.share) {
                let blob;
                
                if (image.url.startsWith('data:')) {
                    const response = await fetch(image.url);
                    blob = await response.blob();
                } else {
                    const response = await fetch(image.url);
                    blob = await response.blob();
                }
                
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                const caption = value || image.name || 'Check out this image!';
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: caption,
                        text: caption
                    });
                    return true;
                } else {
                    // Share without file (just text)
                    await navigator.share({
                        title: caption,
                        text: caption,
                        url: window.location.href
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Native share error:', error);
            return false;
        }
    };

    const handleShareClick = async () => {
        if (onShare) {
            onShare(image);
            return;
        }

        // Try native sharing first
        const nativeSuccess = await useNativeShare();
        if (nativeSuccess) return;

        // If native sharing not available, show platform options
        setShowShareModal(true);
    };

    return (
        <>
            <div className="img_card polaroid">
                <div className="polaroid-top">
                    {editing ? (
                        <div className="caption-edit">
                            <input
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                placeholder="Add a caption"
                            />
                            <button onClick={saveCaption}>Save</button>
                            <button onClick={() => { setEditing(false); setValue(image.name || ''); }}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="caption-display">
                            <span className="polaroid-title">{image.name}</span>
                            <button 
                                className="edit-caption" 
                                onClick={() => setEditing(true)} 
                                aria-label="Edit caption"
                            >
                                ✎
                            </button>
                        </div>
                    )}
                </div>

                <div className="polaroid-body">
                    <img
                        src={image.url}
                        alt={image.name || ''}
                        className="polaroid-img"
                        onLoad={(e) => onImgLoad && onImgLoad(image.id, e.target.naturalWidth, e.target.naturalHeight)}
                    />
                </div>

                <div className="polaroid-footer">
                    <span className="drag-handle" title="Drag to reorder" aria-hidden="true">☰</span>
                    <button 
                        className="move-btn" 
                        onClick={() => onMove && onMove(image)} 
                        aria-label="Move image"
                    >
                        ⇅
                    </button>
                    <button
                        className="share-btn"
                        onClick={handleShareClick}
                        aria-label="Share image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" id="share">
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path>
                        </svg>
                    </button>
                
                    <button
                        className="fav-btn"
                        onClick={() => onToggleFavourite && onToggleFavourite(image)}
                        aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                    >
                        {isFavourite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
                    <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="share-modal-header">
                            <h3>Share Image</h3>
                            <button 
                                className="close-modal" 
                                onClick={() => setShowShareModal(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="share-platforms">
                            <div className="platform-row">
                                <button 
                                    className="platform-btn whatsapp"
                                    onClick={() => shareToPlatform('whatsapp')}
                                >
                                    <MessageCircle size={20} />
                                    <span>WhatsApp</span>
                                </button>
                                
                                <button 
                                    className="platform-btn email"
                                    onClick={() => shareToPlatform('email')}
                                >
                                    <Mail size={20} />
                                    <span>Email</span>
                                </button>
                            </div>
                            
                            <div className="platform-row">
                                <button 
                                    className="platform-btn download"
                                    onClick={downloadImage}
                                >
                                    <Download size={20} />
                                    <span>Download</span>
                                </button>
                                
                                <button 
                                    className="platform-btn copy"
                                    onClick={copyImageToClipboard}
                                >
                                    <Copy size={20} />
                                    <span>Copy Image</span>
                                </button>
                                
                                <button 
                                    className="platform-btn link"
                                    onClick={() => {
                                        navigator.clipboard.writeText(image.url);
                                        alert('✅ Image URL copied to clipboard');
                                    }}
                                >
                                    <Link size={20} />
                                    <span>Copy Link</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="share-note">
                            <p>💡 <strong>Note:</strong> Some platforms require you to attach the downloaded image manually.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ImageCard;