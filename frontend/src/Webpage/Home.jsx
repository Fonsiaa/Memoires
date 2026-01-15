import React, { useState, useEffect, useMemo } from 'react';
import ImageCard from '../parts/ImageCard';
import '../styles/main.scss';

const DEFAULT_IMAGES = [
    { id: 1, url: "https://tse3.mm.bing.net/th/id/OIP.cGMRI-ksdlr5Kmlkpc91JgHaEw?rs=1&pid=ImgDetMain&o=7&rm=3", name: "Family Picnic", category: "Family" },
    { id: 2, url: "https://cdn.pixabay.com/photo/2022/07/27/06/04/smile-7347220_1280.jpg", name: "Grandma", category: "Family" },
    { id: 9, url: "https://tse1.mm.bing.net/th/id/OIP.bgtkW7kfQInrP-iWqq0qAwHaEu?rs=1&pid=ImgDetMain&o=7&rm=3", name: "Beach Sunset Walk", category: "Family" },
    
    { id: 3, url: "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/k-111-ae-5281.jpg?w=800&dpr=1&fit=default&crop=default&auto=format&fm=jpg&q=75&vib=3&con=3&usm=15&ixlib=js-1.1.1&s=f71ed6311c4b180c72bf7d01df9dff04", name: "Coffee with Friends", category: "Friends" },
    { id: 4, url: "https://img.freepik.com/premium-photo/rooftop-twilight-backdrop_961875-110756.jpg", name: "Rooftop Sunset", category: "Friends" },
    { id: 10, url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop", name: "Summer Road Trip", category: "Friends" },
    
    { id: 5, url: "https://cdn.greenvelope.com/blog/wp-content/uploads/AdobeStock_133800814-scaled.jpeg", name: "Birthday Celebration", category: "Events" },
    { id: 6, url: "https://tse3.mm.bing.net/th/id/OIP.z0v0ouUov54SMKX7SB5nugHaEU?w=1200&h=700&rs=1&pid=ImgDetMain&o=7&rm=3", name: "Wedding Ceremony", category: "Events" },
    { id: 11, url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop", name: "Music Festival Night", category: "Events" },

    { id: 7, url: "https://th.bing.com/th/id/R.4f25a5c437a7cd52817a4f13a484b4a5?rik=kBzmMqJZqz7Gmw&riu=http%3a%2f%2fs1.bwallpapers.com%2fwallpapers%2f2013%2f12%2f26%2fgolden-retriever-puppy_061645.jpg&ehk=4%2f0qrVKTHKXiGYaKzJcaiSJ4WVd8XyoxZbpP%2fCZnCUo%3d&risl=&pid=ImgRaw&r=0", name: "Golden Pup", category: "Pets" },
    { id: 8, url: "https://i.pinimg.com/736x/bd/75/81/bd75815f05e6e2ea657405f30fbdf9ac.jpg", name: "Sleepy Kitten", category: "Pets" },
    { id: 12, url: "https://i0.wp.com/koradventuresco.com/wp-content/uploads/2022/05/LAK_9091.jpg?w=667&ssl=1", name: "Doggie Adventure", category: "Pets" },

    { id: 13, url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop", name: "Resume Draft", category: "Documents" },
    { id: 14, url: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=1632&auto=format&fit=crop", name: "Signed Contract", category: "Documents" },
];

function Home({ currentUser }) {
    
    const CURRENT_VERSION = "2.0"; 

    const [selectedCategory, setSelectedCategory] = useState('All');

    const [allFeedImages, setAllFeedImages] = useState(() => {
    const savedVersion = localStorage.getItem('app_version');
    
    if (savedVersion !== CURRENT_VERSION) {
        localStorage.setItem('app_version', CURRENT_VERSION);
        return DEFAULT_IMAGES.map(img => ({ ...img, categories: [img.category], colSpan: 1, rowSpan: 1 }));
    }

    try {
        const raw = localStorage.getItem('feedImages');
        return raw ? JSON.parse(raw) : DEFAULT_IMAGES;
        } catch (e) {
            return DEFAULT_IMAGES;
        }
    });

    const displayedFeedImages = useMemo(() => {
        if (!currentUser) {
            return allFeedImages.filter(img => !img.owner);
        }
        return allFeedImages;
    }, [allFeedImages, currentUser]);

    const [favourites, setFavourites] = useState(() => {
        try {
            const raw = localStorage.getItem('favourites');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try { localStorage.setItem('feedImages', JSON.stringify(allFeedImages)); } catch (e) {}
    }, [allFeedImages]);

    useEffect(() => {
        try { localStorage.setItem('favourites', JSON.stringify(favourites)); } catch (e) {}
    }, [favourites]);

    const categories = useMemo(() => {
        const defaultCats = ['Family', 'Friends', 'Events', 'Pets', 'Documents'];
        const set = new Set();
        displayedFeedImages.forEach(i => (i.categories || []).forEach(c => c && set.add(c)));
        defaultCats.forEach(c => set.add(c));
        const cats = Array.from(set).filter(c => c !== 'Random');
        return ['All', ...cats];
    }, [displayedFeedImages]);

    const filteredImages = selectedCategory === 'All'
        ? displayedFeedImages
        : displayedFeedImages.filter(img => (img.categories && img.categories.includes(selectedCategory)) || img.category === selectedCategory);
    
    useEffect(() => {
        function onFeedUpdated() {
            try {
                const raw = localStorage.getItem('feedImages');
                const parsed = raw ? JSON.parse(raw) : DEFAULT_IMAGES;
                const normalized = parsed.map(img => ({ ...img, categories: img.categories || (img.category ? [img.category] : []), colSpan: img.colSpan || 1, rowSpan: img.rowSpan || 1 }));
                setAllFeedImages(normalized);
            } catch (e) {}
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
        setAllFeedImages(prev => prev.map(img => img.id === id ? { ...img, name: newName } : img));
        // also keep favourites in sync if needed
        setFavourites(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    }

    const containerClass = 'image-grid';

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
                    
                    <button  onClick={() => {localStorage.removeItem('feedImages'); window.location.reload();}}
                    style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
                    Refresh
                    </button>
                </div>
            </div>

            <div className="image-grid">
                {filteredImages.map((image, idx) => (
                    <div className={'general'}
                        key={image.id}
                        draggable
                        onDragStart={(e) => {
                            // indicate dragging state for CSS
                            try { e.currentTarget.classList.add('dragging'); } catch (err) {}
                            e.dataTransfer.setData('text/plain', image.id);
                            e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={(e) => {
                            try { e.currentTarget.classList.remove('dragging'); } catch (err) {}
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            try { e.currentTarget.classList.add('drag-over'); } catch (err) {}
                        }}
                        onDragLeave={(e) => { try { e.currentTarget.classList.remove('drag-over'); } catch (err) {} }}
                        onDrop={(e) => {
                            e.preventDefault();
                            try { e.currentTarget.classList.remove('drag-over'); } catch (err) {}
                            const draggedId = e.dataTransfer.getData('text/plain');
                            if (!draggedId || draggedId === image.id) return;
                            setAllFeedImages(prev => {
                                const srcIndex = prev.findIndex(i => String(i.id) === String(draggedId));
                                const destIndex = prev.findIndex(i => i.id === image.id);
                                if (srcIndex === -1 || destIndex === -1) return prev;
                                const next = [...prev];
                                const [moved] = next.splice(srcIndex, 1);
                                // insert before destIndex
                                next.splice(destIndex, 0, moved);
                                return next;
                            });
                        }}
                        style={{ gridColumn: `span ${image.colSpan || 1}`, gridRow: `span ${image.rowSpan || 1}` }}
                    >
                        <ImageCard
                            image={image}
                            onToggleFavourite={handleToggleFavourite}
                            onUpdateCaption={handleUpdateCaption}
                            isFavourite={favourites.some(f => f.id === image.id)}
                            onMove={() => {
                                const catList = categories.join(', ');
                                const defaultCat = image.category || categories[1] || 'Family';
                                const chosen = window.prompt(`Choose category for this image (options: ${catList})`, defaultCat);
                                if (!chosen) return;
                                const newCat = chosen.trim();
                                if (!newCat) return;
                                const arr = feedImages.map(img => img.id === image.id ? { ...img, category: newCat, categories: [newCat] } : img);
                                setAllFeedImages(arr);
                                // keep favourites in sync
                                setFavourites(prev => prev.map(f => f.id === image.id ? { ...f, category: newCat, categories: [newCat] } : f));
                            }}
                            onImgLoad={(id, w, h) => {
                                // compute spans based on aspect ratio
                                const ratio = w / h;
                                let colSpan = 1, rowSpan = 1;
                                if (ratio >= 1.8) { colSpan = 2; rowSpan = 1; }
                                else if (ratio >= 1.2) { colSpan = 2; rowSpan = 1; }
                                else if (ratio <= 0.6) { colSpan = 1; rowSpan = 2; }
                                else { colSpan = 1; rowSpan = 1; }
                                setAllFeedImages(prev => prev.map(img => img.id === id ? { ...img, colSpan, rowSpan } : img));
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;