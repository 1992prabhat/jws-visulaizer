import { useRef, useEffect } from "react";

const VisualizerCanvas = ({ image, color, onClick }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = color;
      ctx.fillRect(50, 60, img.width - 100, img.height - 120);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = color;
      ctx.lineWidth = 16;
      ctx.strokeRect(50, 60, img.width - 100, img.height - 120);
      ctx.restore();
    };
  }, [image, color]);

  return (
    <div className="canvas-wrapper">
      <canvas
        className="visualizer-canvas"
        ref={canvasRef}
        onClick={onClick}           // link image click to handler
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default VisualizerCanvas;
