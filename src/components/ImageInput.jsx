import { useRef, useState } from "react";

const ImageInput = ({ setImage }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
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
      {/* Input with capture attribute to open camera on supported devices */}
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
