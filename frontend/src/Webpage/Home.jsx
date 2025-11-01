import React, { useState, useEffect, useMemo } from 'react';
import ImageCard from '../parts/ImageCard';
import '../styles/main.scss';

const DEFAULT_IMAGES = [
    { id: 1, url: 'https://picsum.photos/300/400', name: 'Random 1', category: 'Family' },
    { id: 2, url: 'https://picsum.photos/320/450', name: 'Random 2', category: 'Friends' },
    { id: 3, url: 'https://picsum.photos/310/420', name: 'Random 3', category: 'Events' },
    { id: 4, url: 'https://picsum.photos/330/410', name: 'Random 4', category: 'Pets' },
];

function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [feedImages, setFeedImages] = useState(() => {
        try {
            const raw = localStorage.getItem('feedImages');
            return raw ? JSON.parse(raw) : DEFAULT_IMAGES;
        } catch (e) {
            return DEFAULT_IMAGES;
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
        const defaultCats = ['Family', 'Friends', 'Events', 'Pets'];
        const set = new Set(feedImages.map(i => i.category).filter(Boolean));
        defaultCats.forEach(c => set.add(c));
        return ['All', ...Array.from(set)];
    }, [feedImages]);

    const filteredImages = selectedCategory === 'All'
        ? feedImages
        : feedImages.filter(img => img.category === selectedCategory);

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
                <div className="upload-area">
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <input type="file" accept="image/*" multiple id="imageFiles" onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            // read files and add
                            files.forEach(file => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    const url = ev.target.result;
                                    const id = Date.now() + Math.floor(Math.random() * 1000);
                                    const name = file.name.replace(/\.[^.]+$/, '');
                                    const category = window.prompt('Category for ' + file.name + ' (Family/Friends/Events/Pets)') || 'Uncategorized';
                                    const newImg = { id, url, name, category };
                                    setFeedImages(prev => [newImg, ...prev]);
                                };
                                reader.readAsDataURL(file);
                            });
                            e.target.value = '';
                        }} />
                    </form>
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