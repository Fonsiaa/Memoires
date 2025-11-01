import React, { useState, useEffect } from "react";

function ImageCard({ image, onToggleFavourite, onUpdateCaption, isFavourite }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(image.name || image.caption || "");

    useEffect(() => {
        setValue(image.name || image.caption || "");
    }, [image]);

    function saveCaption() {
        setEditing(false);
        if (onUpdateCaption) onUpdateCaption(image.id, value);
    }

    function shareImage() {
        // Try Web Share API first
        if (navigator.share) {
            navigator.share({
                title: value || image.name,
                text: value || image.name,
                url: image.url
            }).catch(() => {
                // ignore share errors
            });
            return;
        }

        // Fallback: open social share windows if image URL is HTTP(S)
        const encoded = encodeURIComponent(image.url);
        const text = encodeURIComponent(value || image.name || '');
        if (image.url && image.url.startsWith('http')) {
            // open a small chooser window with options
            const fb = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
            const tw = `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`;
            const wa = `https://api.whatsapp.com/send?text=${text}%20${encoded}`;
            window.open(fb, '_blank', 'noopener');
            // also open twitter in new tab
            window.open(tw, '_blank', 'noopener');
            window.open(wa, '_blank', 'noopener');
            return;
        }

        // If not a public URL (e.g., data:), copy to clipboard as fallback
        if (navigator.clipboard && image.url) {
            navigator.clipboard.writeText(image.url).then(() => {
                alert('Image data copied to clipboard. Paste it into a social post or save it first.');
            }).catch(() => {
                alert('Unable to share this image from the browser. Consider exporting it first.');
            });
        } else {
            alert('Sharing not supported for this image from the browser.');
        }
    }

    return (
        <div className="img_card polaroid" style={{ position: 'relative' }}>
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
                <img src={image.url} alt={image.name || ''} />
            </div>

            <div className="polaroid-icons" style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 8 }}>
                <button
                    className="share-btn"
                    onClick={shareImage}
                    style={{ background: 'transparent', border: 'none', fontSize: 18 }}
                    aria-label="Share image"
                >
                    🔗
                </button>

                <button
                    className="fav-btn"
                    onClick={() => onToggleFavourite && onToggleFavourite(image)}
                    style={{ background: 'transparent', border: 'none', fontSize: 18 }}
                    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                    {isFavourite ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    );
}

export default ImageCard;