import React from 'react';

const ColorPalette = ({ palette, selectedColor, setSelectedColor }) => (
  <div className="color-palette">
    {palette.map((swatch) => (
      <button
        key={swatch.hex}
        className={`color-swatch ${selectedColor === swatch.hex ? "selected" : ""}`}
        style={{ backgroundColor: swatch.hex }}
        onClick={() => setSelectedColor(swatch.hex)}
        aria-label={swatch.name}
      >
        {swatch.name}
      </button>
    ))}
  </div>
);

export default ColorPalette;
