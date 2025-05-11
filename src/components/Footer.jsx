import React from "react";

import "../styles/Footer.css";

export default function Footer({ setBrushColor }) {
  const colors = [
    "#000000", // Negro
    "#FFFFFF", // Blanco
    "#FF0000", // Rojo
    "#00FF00", // Verde
    "#0000FF", // Azul
    "#FFFF00", // Amarillo
    "#FF00FF", // Magenta
    "#00FFFF", // Cian
    "#FFA500", // Naranja
    "#800080", // Púrpura
  ];

  const handleColorChange = (event) => {
    setBrushColor(event.target.value); // Actualizar brushColor con el color seleccionado
  };

  return (
    <>
      <footer>
        <input type="color" onChange={handleColorChange} />
        <div className="color-palette">
          {colors.map((color, index) => (
            <button
              key={index}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => setBrushColor(color)}
              title={color}
            />
          ))}
        </div>
      </footer>
    </>
  );
}
