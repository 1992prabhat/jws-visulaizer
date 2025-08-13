import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ImageInput from './components/ImageInput';
import ColorPalette from './components/ColorPalette';
import VisualizerCanvas from './components/VisualizerCanvas';

// Color swatches – add all your colors
const PALETTE = [
  { name: "Mango Shake", hex: "#FFD36E" },
  { name: "Indie Music", hex: "#9CA3AF" },
  { name: "Coral Print", hex: "#F88379" },
  { name: "Ocean Drive", hex: "#5BC0EB" },
  { name: "Sunlit Amber", hex: "#FFA600" },
  { name: "Mint Essence", hex: "#AAF0D1" },
  { name: "Twilight Blue", hex: "#34568B" },
  { name: "Lavender Touch", hex: "#B497BD" },
  { name: "Pebble Grey", hex: "#8E9AAF" },
  { name: "Crimson Edge", hex: "#BC0A1C" },
  { name: "Olive Branch", hex: "#888B06" },
  { name: "Platinum Frost", hex: "#E5E4E2" },
  { name: "Desert Rose", hex: "#C7B198" },
  { name: "Arctic Sky", hex: "#B3CEE5" },
  { name: "Autumn Gold", hex: "#D4AF37" },
  { name: "Canvas White", hex: "#F5F5F5" },
  { name: "Cocoa Blend", hex: "#8B5C2E" },
  { name: "Urban Slate", hex: "#323E48" },
  { name: "Forest Haze", hex: "#93A603" },
  { name: "Cherry Pop", hex: "#D22730" },
  { name: "Classic Taupe", hex: "#B9A16B" },
  { name: "Sparkle Mint", hex: "#75DDDD" },
  { name: "Velvet Night", hex: "#202124" },
  { name: "Lemon Whip", hex: "#FFE77A" },
  { name: "Blushing Pink", hex: "#F7CAC9" },
];

const ROBOFLOW_API_URL = "https://serverless.roboflow.com/house-wall-detection/2";
const API_KEY = "ngoHq97FIjcKfzT3tpsb"; // Your Roboflow API key

// Converts all wall predictions (polygons) into a mask array
function buildWallMask(predictions, imgWidth, imgHeight) {
  const mask = new Uint8Array(imgWidth * imgHeight);
  const offCanvas = document.createElement('canvas');
  offCanvas.width = imgWidth;
  offCanvas.height = imgHeight;
  const ctx = offCanvas.getContext('2d');

  // Draw all wall polygons
  predictions.forEach(pred => {
    if (pred.class !== "Wall" || !Array.isArray(pred.points)) return;
    const pts = pred.points.map(pt => [pt.x, pt.y]);
    if (pts.length < 3) return; // skip invalid polygons

    ctx.beginPath();
    pts.forEach(([x, y], idx) => {
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
  });

  // Extract mask from canvas (white = wall)
  const imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
  for (let i = 0; i < imgWidth * imgHeight; i++) {
    mask[i] = imgData.data[i * 4] > 0 ? 1 : 0;
  }
  return mask;
}

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0].hex);
  const [appliedColor, setAppliedColor] = useState(PALETTE[0].hex);
  const [wallMask, setWallMask] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Handle file selection from ImageInput
  const handleImageChange = (file) => {
    setImageFile(file);
    setImageSrc(URL.createObjectURL(file)); // for preview
    setWallMask(null);
  };

  // Fetch wall mask from Roboflow after image upload
  useEffect(() => {
    if (!imageFile) return;

    const sendImageForWallDetection = async () => {
      setProcessing(true);
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await axios.post(ROBOFLOW_API_URL, formData, {
          params: { api_key: API_KEY },
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = response.data;
        console.log('Roboflow API response:', data);

        // Wait for image dimensions to match mask correctly
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = () => {
          // Build mask from ALL wall polygons
          const mask = buildWallMask(data.predictions, img.width, img.height);
          setWallMask(mask);
          setProcessing(false);
        };
      } catch (error) {
        console.error('Error calling Roboflow API:', error);
        setWallMask(null);
        setProcessing(false);
      }
    };

    sendImageForWallDetection();
  }, [imageFile, imageSrc]);

  const handleColorSelect = (color) => setSelectedColor(color);
  const handleCanvasClick = () => setAppliedColor(selectedColor);

  return (
    <div className="app-container">
      <h1 className="app-header">Wall Paint Visualizer with Roboflow API</h1>
      <ImageInput setImage={handleImageChange} />
      {processing && <p style={{ textAlign: 'center' }}>Detecting walls...</p>}
      {
  imageSrc ? (
    <>
      <VisualizerCanvas
        image={imageSrc}
        color={appliedColor}
        onClick={handleCanvasClick}
        wallMask={wallMask}
      />
      <ColorPalette
        palette={PALETTE}
        selectedColor={selectedColor}
        setSelectedColor={handleColorSelect}
      />
      <p style={{
        textAlign: 'center',
        marginTop: '1rem',
        fontStyle: 'italic',
        color: '#666'
      }}>
        Select a color, then click on the image to apply paint to the detected wall area.
      </p>
    </>
  ) : (
    <p style={{
      textAlign: 'center',
      marginTop: '2rem',
      color: '#999'
    }}>
      Upload an image to start visualizing.
    </p>
  )
}

    </div>
  );
}

export default App;
