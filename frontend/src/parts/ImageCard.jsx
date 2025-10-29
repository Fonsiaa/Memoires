// src/Webpage/ImageUploader.jsx
import React, { useRef } from "react";


function ImageCard({image}) {

return (
    <div className="img_card">
        <img src="{image.url}" alt="{image.name}"/>
        <p>{Image.name}</p>
    </div>
    );
}

export default ImageCard;