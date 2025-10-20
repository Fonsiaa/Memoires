import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import '../styles/ImageCard.scss';

export default function ImageCard({ image }) {
  return (
    <div className="image-card">
      <img src={image.url} alt={image.name} className="image-card-img" />
      <div className="image-card-overlay">
        <button className="icon-btn">
          <Heart size={20} />
        </button>
        <button className="icon-btn">
          <Share2 size={20} />
        </button>
      </div>
      <div className="image-card-caption">{image.name}</div>
    </div>
  );
}
