import React, { useState, useEffect } from 'react';
import ImageCard from '../components/ImageCard';
import '../styles/Home.scss';

export default function Home() {
  const [feedImages, setFeedImages] = useState([
    { id: 1, url: 'https://picsum.photos/300/400', name: 'Random 1' },
    { id: 2, url: 'https://picsum.photos/320/450', name: 'Random 2' },
    { id: 3, url: 'https://picsum.photos/310/420', name: 'Random 3' },
    { id: 4, url: 'https://picsum.photos/330/410', name: 'Random 4' },
  ]);

  return (
    <div className="home-page">
      <div className="feed-grid">
        {feedImages.map((img) => (
          <ImageCard key={img.id} image={img} />
        ))}
      </div>
    </div>
  );
}
