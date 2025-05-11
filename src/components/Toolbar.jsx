import React from "react";
// Importamos las imágenes desde src/assets/images
import draw from "../assets/icons/draw.png";
import eraser from "../assets/icons/erase.png";
import rectangle from "../assets/icons/rectangle.png";
import ellipse from "../assets/icons/ellipse.png";
import picker from "../assets/icons/picker.png";
import trash from "../assets/icons/trash.png";
import "../styles/Toolbar.css";

const MODES = {
  DRAW: "draw",
  ERASER: "eraser",
  RECTANGLE: "rectangle",
  ELLIPSE: "ellipse",
  PICKER: "picker",
  TRASH: "trash",
};

export default function Toolbar({
  onModeChange,
  currentMode,
  setBrushColor,
  setMode,
}) {
  // Lista de modos con sus imágenes y valores
  const modes = [
    { name: "draw", icon: draw, value: "draw" },
    { name: "eraser", icon: eraser, value: "eraser" },
    { name: "rectangle", icon: rectangle, value: "rectangle" },
    { name: "ellipse", icon: ellipse, value: "ellipse" },
    { name: "picker", icon: picker, value: "picker" },
    { name: "trash", icon: trash, value: "trash" },
  ];

  const isEyeDropperSupported = typeof window.EyeDropper !== "undefined";

  const handleModeChange = async (modeValue) => {
    if (modeValue === MODES.PICKER) {
      try {
        onModeChange(MODES.PICKER);
        const eyeDropper = new window.EyeDropper();
        const { sRGBHex } = await eyeDropper.open();
        setBrushColor(sRGBHex);
        setMode(MODES.DRAW);
      } catch (error) {
        console.log("Error al usar EyeDropper:", error);
        setMode(MODES.DRAW);
      }
    } else {
      onModeChange(modeValue);
    }
  };

  return (
    <aside className="toolbar">
      <nav className="toolbar-nav">
        {modes.map((mode, index) => (
          <button
            key={index}
            title={mode.name}
            onClick={() => handleModeChange(mode.value)}
            className={`mode-btn ${currentMode === mode.value ? "active" : ""}`}
            disabled={mode.value === "picker" && !isEyeDropperSupported}
          >
            <img src={mode.icon} alt={mode.name} className="mode-icon" />
          </button>
        ))}
      </nav>
    </aside>
  );
}
