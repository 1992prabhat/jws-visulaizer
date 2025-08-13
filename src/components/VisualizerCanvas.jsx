import React, { useRef, useEffect } from 'react';

const VisualizerCanvas = ({ image, color, onClick, wallMask }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();
    img.src = image;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (!wallMask) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const rgb = hexToRgb(color);

      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (wallMask[pixelIndex]) {
          data[i] = blendColor(data[i], rgb.r, 0.5);
          data[i + 1] = blendColor(data[i + 1], rgb.g, 0.5);
          data[i + 2] = blendColor(data[i + 2], rgb.b, 0.5);
          // alpha left unchanged for subtle overlay
        }
      }
			// for (let i = 0; i < data.length; i +=4) {
      //  data[i] = rgb.r;
      //  data[i+1] = rgb.g;
      //  data[i+2] = rgb.b;
      //  data[i+3] = 128; // semi-transparent
      // }

      ctx.putImageData(imageData, 0, 0);
    };
  }, [image, color, wallMask]);

  return <canvas ref={canvasRef} onClick={onClick} className="visualizer-canvas" style={{ cursor: "pointer", maxWidth: '100%' }} />;
};

// Helpers
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function blendColor(base, overlay, alpha) {
  return Math.round(base * (1 - alpha) + overlay * alpha);
}

export default VisualizerCanvas;
