import React, { useState, useEffect, useMemo } from 'react';
import ImageCard from '../parts/ImageCard';
import '../styles/main.scss';

const DEFAULT_IMAGES = [
    { id: 1, url: "https://img.freepik.com/free-photo/concept-beautiful-outdoor-relax-summer-time-picnic_185193-87301.jpg", name: "Family Picnic - Park Day", category: "Family" },
    { id: 2, url: "https://cdn.pixabay.com/photo/2022/07/27/06/04/smile-7347220_1280.jpg", name: "Grandma's Smile", category: "Family" },

    { id: 3, url: "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/k-111-ae-5281.jpg?w=800&dpr=1&fit=default&crop=default&auto=format&fm=jpg&q=75&vib=3&con=3&usm=15&ixlib=js-1.1.1&s=f71ed6311c4b180c72bf7d01df9dff04", name: "Coffee with Friends", category: "Friends" },
    { id: 4, url: "https://img.freepik.com/premium-photo/sleek-cat-perched-rooftop-against-city-skyline_731930-173539.jpg", name: "Rooftop Selfie", category: "Friends" }    ,
    
    { id: 5, url: "https://cdn.greenvelope.com/blog/wp-content/uploads/AdobeStock_133800814-scaled.jpeg", name: "Birthday Celebration", category: "Events" }  ,
    { id: 6, url: "https://tse3.mm.bing.net/th/id/OIP.z0v0ouUov54SMKX7SB5nugHaEU?w=1200&h=700&rs=1&pid=ImgDetMain&o=7&rm=3", name: "Wedding Ceremony", category: "Events"   },
    
    { id: 7, url: "https://th.bing.com/th/id/R.4f25a5c437a7cd52817a4f13a484b4a5?rik=kBzmMqJZqz7Gmw&riu=http%3a%2f%2fs1.bwallpapers.com%2fwallpapers%2f2013%2f12%2f26%2fgolden-retriever-puppy_061645.jpg&ehk=4%2f0qrVKTHKXiGYaKzJcaiSJ4WVd8XyoxZbpP%2fCZnCUo%3d&risl=&pid=ImgRaw&r=0", name: "Golden Pup", category: "Pets" },     
    { id: 8, url: "https://i.pinimg.com/736x/bd/75/81/bd75815f05e6e2ea657405f30fbdf9ac.jpg", name: "Sleepy Kitten", category: "Pets" },   
    
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
            <div className="home-toolbar">
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