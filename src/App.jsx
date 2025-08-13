import { useState } from "react";
import ImageInput from "./components/ImageInput.jsx";
import ColorPalette from "./components/ColorPalette.jsx";
import VisualizerCanvas from "./components/VisualizerCanvas.jsx";

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

function App() {
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0].hex);
  const [appliedColor, setAppliedColor] = useState(PALETTE[0].hex);

  // Called when palette color is selected, but we don't apply immediately
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Called when user clicks the image to apply the selected color
  const handleCanvasClick = () => {
    setAppliedColor(selectedColor);
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-header">JSW Paints AR Visualizer</h1>
        <ImageInput setImage={setImage} />
        {image ? (
          <>
            <hr className="divider" />
            <ColorPalette
              palette={PALETTE}
              selectedColor={selectedColor}
              setSelectedColor={handleColorSelect}
            />
            <VisualizerCanvas
              image={image}
              color={appliedColor} // Use appliedColor to show paint
              onClick={handleCanvasClick}
            />
            <p style={{ marginTop: "10px", color: "#666", fontStyle: "italic", textAlign: "center" }}>
              Select a color from the palette then click on the image to apply.
            </p>
          </>
        ) : (
          <div className="placeholder-text">
            <em>Upload a room photo to begin visualizing!</em>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
