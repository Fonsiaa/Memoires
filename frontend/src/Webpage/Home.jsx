import React, { useState, useEffect } from 'react';
import ImageCard from '../parts/ImageCard';
import '../styles/main.scss';

const categories = ["All", "Family", "Friends", "Events", "Pets"];

function Home() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredImages = selectedCategory === "All"
        ? feedImages
        : feedImages.filter(img => img.category === selectedCategory);

  const [feedImages, setFeedImages] = useState([
    { id: 1, url: 'https://picsum.photos/300/400', name: 'Random 1' },
    { id: 2, url: 'https://picsum.photos/320/450', name: 'Random 2' },
    { id: 3, url: 'https://picsum.photos/310/420', name: 'Random 3' },
    { id: 4, url: 'https://picsum.photos/330/410', name: 'Random 4' },
  ]);

  return (
    <div className="home-page">
      <div className="filter">
            {categories.map(category => (
                <button>
                key={category}
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={() => setSelectedCategory(category)}
                {category}
            </button>
            ))}
      </div>
          
        <div className="image-grid">
        {filteredImages.map(image => (
            <ImageCard key={img.id} image={img}/>
        ))}
        </div>

    </div>
  );
}

export default Home;