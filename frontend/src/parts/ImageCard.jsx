// src/Webpage/ImageUploader.jsx
import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "../parts/UI";

export function ImageUploader({ onUpload }) {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
    fileInputRef.current.click();
};

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file); // delegate the actual upload logic to parent
    }
};

return (
    <div>
    <Button variant="primary" onClick={handleButtonClick}>
        <Upload size={18} />
        <span>Upload New Image</span>
    </Button>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
    />
    </div>
  );
}
