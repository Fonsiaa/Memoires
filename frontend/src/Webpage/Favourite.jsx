import React, { useEffect, useState } from 'react';
import ImageCard from '../parts/ImageCard';

function Favourite() {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('favourites');
            setFavourites(raw ? JSON.parse(raw) : []);
        } catch (e) {
            setFavourites([]);
        }
    }, []);

    function handleToggleFavourite(image) {
        // remove from favourites
        const next = favourites.filter(f => f.id !== image.id);
        setFavourites(next);
        try { localStorage.setItem('favourites', JSON.stringify(next)); } catch (e) {}
    }

    return (
        <div className="favourites-page">
            <h1>Your Favourites</h1>
            <div className="image-grid">
                {favourites.length === 0 ? (
                    <p>No favourites yet.</p>
                ) : (
                    favourites.map(img => (
                        <ImageCard key={img.id} image={img} onToggleFavourite={handleToggleFavourite} isFavourite={true} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Favourite;