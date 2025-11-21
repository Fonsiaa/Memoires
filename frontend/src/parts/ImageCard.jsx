import React, { useState, useEffect } from "react";
import '../styles/main.scss';

function ImageCard({ image, onToggleFavourite, onUpdateCaption, isFavourite, onShare, onMove, onImgLoad }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(image.name || image.caption || "");

    useEffect(() => {
        setValue(image.name || image.caption || "");
    }, [image]);

    function saveCaption() {
        setEditing(false);
        if (onUpdateCaption) onUpdateCaption(image.id, value);
    }

    async function localShare() {
        // Local fallback share function (used if parent doesn't provide onShare)
        try {
            if (navigator.share) {
                await navigator.share({ title: value || image.name, text: value || image.name, url: image.url });
                return;
            }
        } catch (e) {
            // ignore
        }

        if (navigator.clipboard && image.url) {
            try {
                await navigator.clipboard.writeText(image.url);
                alert('Image URL/data copied to clipboard. Paste it into a post.');
                return;
            } catch (e) {
                // ignore
            }
        }

        // final fallback: open share windows for http urls or download
        if (image.url && image.url.startsWith('http')) {
            const encoded = encodeURIComponent(image.url);
            const text = encodeURIComponent(value || image.name || '');
            const fb = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
            const tw = `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`;
            const wa = `https://api.whatsapp.com/send?text=${text}%20${encoded}`;
            window.open(fb, '_blank', 'noopener');
            window.open(tw, '_blank', 'noopener');
            window.open(wa, '_blank', 'noopener');
            return;
        }

        // download fallback
        try {
            const a = document.createElement('a');
            a.href = image.url;
            a.download = image.name || 'image';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            alert('Sharing not supported for this image from the browser.');
        }
    }

    return (
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
                        <button onClick={() => { setEditing(false); setValue(image.name || ''); }}>Cancel</button>
                    </div>
                ) : (
                    <div className="caption-display">
                        <span className="polaroid-title">{image.name}</span>
                        <button className="edit-caption" onClick={() => setEditing(true)} aria-label="Edit caption">✎</button>
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
                <button className="move-btn" onClick={() => onMove && onMove(image)} aria-label="Move image">⇅</button>
                <button
                    className="share-btn"
                    onClick={() => (onShare ? onShare(image) : localShare())}
                    aria-label="Share image"
                >
                    🔗
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
    );
}

export default ImageCard;