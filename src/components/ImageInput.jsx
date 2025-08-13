import React, { useRef, useState } from 'react';

const ImageInput = ({ setImage }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);

  const handleFile = (file) => {
    if (file && (file instanceof Blob || file instanceof File)) {
      // Revoke previous URL to free memory
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setObjectUrl(newUrl);
      setImage(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      className={`image-input ${dragActive ? "drag-active" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current.click();
      }}
      style={{ outline: "none" }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/*"
        capture="environment"
        hidden
        onChange={handleFileChange}
      />
      <div className="image-input-text">
        Drag &amp; drop, choose a photo, or capture live
      </div>
      <div className="formats-text">Supported formats: JPG, PNG. Camera capture supported on mobile devices.</div>
    </div>
  );
};

export default ImageInput;
