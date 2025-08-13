import { useRef, useEffect } from "react";

const VisualizerCanvas = ({ image, color }) => {
  const canvasRef = useRef();

  // Helper function: simple corner detection (conceptual)
  const detectCorners = (ctx, width, height) => {
    // For simplicity, you could sample pixel brightness and compute gradients,
    // or use a library for corner detection if available.
    // Here, we'll simulate some corners at the corners of the painted rectangle.

    // Return an array of corner points as {x, y}
    return [
      { x: 50, y: 60 },                     // top-left
      { x: width - 50, y: 60 },             // top-right
      { x: 50, y: height - 60 },            // bottom-left
      { x: width - 50, y: height - 60 },   // bottom-right
    ];
  };

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

      // Paint overlay with reduced transparency
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = color;
      ctx.fillRect(50, 60, img.width - 100, img.height - 120);
      ctx.restore();

      // Outline painted area softly
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = color;
      ctx.lineWidth = 16;
      ctx.strokeRect(50, 60, img.width - 100, img.height - 120);
      ctx.restore();

      // Detect corners (placeholder/simulated)
      const corners = detectCorners(ctx, img.width, img.height);

      // Draw corner markers
      corners.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF0000"; // bright red for visibility
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
      });
    };
  }, [image, color]);

  return (
    <div className="canvas-wrapper">
      <canvas
        className="visualizer-canvas"
        ref={canvasRef}
        style={{ maxWidth: "90vw", maxHeight: "60vh", borderRadius: "1rem" }}
      />
    </div>
  );
};

export default VisualizerCanvas;
