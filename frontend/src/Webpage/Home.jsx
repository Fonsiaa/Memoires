import React, { useState, useEffect, useMemo } from 'react';
import ImageCard from '../parts/ImageCard';
import '../styles/main.scss';

const DEFAULT_IMAGES = [
    { id: 1, url: "https://img.freepik.com/free-photo/concept-beautiful-outdoor-relax-summer-time-picnic_185193-87301.jpg", name: "Family Picnic - Park Day", category: "Family" },
    { id: 2, url: "https://source.unsplash.com/featured/?family,portrait", name: "Grandma's Smile", category: "Family" },

    { id: 3, url: "https://source.unsplash.com/featured/?friends,group", name: "Coffee with Friends", category: "Friends" },
    { id: 4, url: "https://source.unsplash.com/featured/?friends,selfie", name: "Rooftop Selfie", category: "Friends" }    ,
    
    { id: 5, url: "https://source.unsplash.com/featured/?party,event", name: "Birthday Celebration", category: "Events" }  ,
    { id: 6, url: "https://source.unsplash.com/featured/?wedding,ceremony", name: "Wedding Ceremony", category: "Events"   },
    
    { id: 7, url: "https://source.unsplash.com/featured/?pet,dog", name: "Golden Pup", category: "Pets" },     
    { id: 8, url: "https://source.unsplash.com/featured/?cat,kitten", name: "Sleepy Kitten", category: "Pets" },   
    
    { id: 9, url: "https://source.unsplash.com/featured/?documents,papers", name: "Important Document", category: "Documents" },
    { id: 10, url: "https://source.unsplash.com/featured/?office,notes", name: "Work Notes", category: "Documents" },
];

function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [feedImages, setFeedImages] = useState(() => {
        try {
            const raw = localStorage.getItem('feedImages');
            const parsed = raw ? JSON.parse(raw) : DEFAULT_IMAGES;
            // normalize categories -> array
            return parsed.map(img => ({ ...img, categories: img.categories || (img.category ? [img.category] : []) }));
        } catch (e) {
            return DEFAULT_IMAGES.map(img => ({ ...img, categories: img.category ? [img.category] : [] }));
        }
    });

    const [favourites, setFavourites] = useState(() => {
        try {
            const raw = localStorage.getItem('favourites');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    // persist feedImages and favourites locally so renames and new images survive reloads
    useEffect(() => {
        try { localStorage.setItem('feedImages', JSON.stringify(feedImages)); } catch (e) {}
    }, [feedImages]);

    useEffect(() => {
        try { localStorage.setItem('favourites', JSON.stringify(favourites)); } catch (e) {}
    }, [favourites]);

    const categories = useMemo(() => {
        const defaultCats = ['Family', 'Friends', 'Events', 'Pets', 'Documents'];
        const set = new Set();
        feedImages.forEach(i => (i.categories || []).forEach(c => c && set.add(c)));
        defaultCats.forEach(c => set.add(c));
        return ['All', ...Array.from(set)];
    }, [feedImages]);

    const filteredImages = selectedCategory === 'All'
        ? feedImages
        : feedImages.filter(img => (img.categories && img.categories.includes(selectedCategory)) || img.category === selectedCategory);

    // listen for profile uploads (same-page updates). Profile dispatches 'feedImagesUpdated' when it writes to localStorage
    useEffect(() => {
        function onFeedUpdated() {
            try {
                const raw = localStorage.getItem('feedImages');
                const parsed = raw ? JSON.parse(raw) : DEFAULT_IMAGES;
                const normalized = parsed.map(img => ({ ...img, categories: img.categories || (img.category ? [img.category] : []) }));
                setFeedImages(normalized);
            } catch (e) {
                /* ignore parse errors */
            }
        }
        window.addEventListener('feedImagesUpdated', onFeedUpdated);
        return () => window.removeEventListener('feedImagesUpdated', onFeedUpdated);
    }, []);

    function handleToggleFavourite(image) {
        setFavourites(prev => {
            const exists = prev.some(i => i.id === image.id);
            if (exists) return prev.filter(i => i.id !== image.id);
            return [...prev, image];
        });
    }

    function handleUpdateCaption(id, newName) {
        setFeedImages(prev => prev.map(img => img.id === id ? { ...img, name: newName } : img));
        // also keep favourites in sync if needed
        setFavourites(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    }

    function handleAddImage() {
        const url = window.prompt('Image URL (absolute or relative to public):');
        if (!url) return;
        const name = window.prompt('Image name/caption:') || 'Untitled';
        const category = window.prompt('Category (e.g. Family, Friends):') || 'Uncategorized';
        const id = Date.now();
        const newImg = { id, url, name, category };
        setFeedImages(prev => [newImg, ...prev]);
    }

    return (
        <div className="home-page">
            <div className="home-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="filter">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={selectedCategory === category ? 'active' : ''}
                            onClick={() => setSelectedCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="image-grid">
                {filteredImages.map(image => (
                    <ImageCard
                        key={image.id}
                        image={image}
                        onToggleFavourite={handleToggleFavourite}
                        onUpdateCaption={handleUpdateCaption}
                        isFavourite={favourites.some(f => f.id === image.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;