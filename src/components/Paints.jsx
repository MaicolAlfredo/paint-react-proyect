import { useEffect, useRef, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import Toolbar from "./Toolbar";
import eraserIcon from "../assets/icons/erase.png";

const MODES = {
  DRAW: "draw",
  ERASER: "eraser",
  RECTANGLE: "rectangle",
  ELLIPSE: "ellipse",
  PICKER: "picker",
  TRASH: "trash",
};

export default function Paints() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [mode, setMode] = useState(MODES.DRAW);
  const [brushColor, setBrushColor] = useState("#000000");
  const [snapshot, setSnapshot] = useState(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.lineCap = "round";
    context.lineWidth = 3;
    context.strokeStyle = brushColor;
    contextRef.current = context;

    if (mode === MODES.ERASER) {
      context.lineWidth = 20;
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }

    if (mode === MODES.TRASH) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      setMode(MODES.DRAW);
    }
  }, [brushColor, mode]);

  const handleKeyDown = (event) => {
    if (event.key === "Shift") {
      setIsShiftPressed(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Shift") {
      setIsShiftPressed(false);
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    //console.log(nativeEvent);

    const { offsetX, offsetY } = nativeEvent;
    setStartPosition({ x: offsetX, y: offsetY });
    setLastPosition({ x: offsetX, y: offsetY });

    if (mode === MODES.DRAW || mode === MODES.ERASER) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }

    if (mode === MODES.RECTANGLE || mode === MODES.ELLIPSE) {
      const snapshotData = contextRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setSnapshot(snapshotData);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    setLastPosition({ x: offsetX, y: offsetY });

    if (mode === MODES.DRAW || mode === MODES.ERASER) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }

    if (mode === MODES.RECTANGLE) {
      contextRef.current.putImageData(snapshot, 0, 0);
      let width = offsetX - startPosition.x;
      let height = offsetY - startPosition.y;

      if (isShiftPressed) {
        const size = Math.min(Math.abs(width), Math.abs(height));

        width = Math.sign(width) * size;
        height = Math.sign(height) * size;
      }

      contextRef.current.strokeRect(
        startPosition.x,
        startPosition.y,
        width,
        height
      );
    }

    if (mode === MODES.ELLIPSE) {
      contextRef.current.putImageData(snapshot, 0, 0);
      let width = offsetX - startPosition.x;
      let height = offsetY - startPosition.y;

      if (isShiftPressed) {
        const size = Math.min(Math.abs(width), Math.abs(height));

        width = Math.sign(width) * size;
        height = Math.sign(height) * size;
      }

      const centerX = startPosition.x + width / 2;
      const centerY = startPosition.y + height / 2;
      const radiusX = Math.abs(width) / 2;
      const radiusY = Math.abs(height) / 2;

      contextRef.current.beginPath();
      contextRef.current.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      contextRef.current.stroke();
      contextRef.current.closePath();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      if (mode === MODES.DRAW || mode === MODES.ERASER) {
        contextRef.current.closePath();
      }
      if (mode === MODES.RECTANGLE) {
        contextRef.current.putImageData(snapshot, 0, 0);
        let width = lastPosition.x - startPosition.x;
        let height = lastPosition.y - startPosition.y;

        if (isShiftPressed) {
          const size = Math.min(Math.abs(width), Math.abs(height));
          width = Math.sign(width) * size;
          height = Math.sign(height) * size;
        }

        contextRef.current.strokeRect(
          startPosition.x,
          startPosition.y,
          width,
          height
        );
      }

      if (mode === MODES.ELLIPSE) {
        contextRef.current.putImageData(snapshot, 0, 0);
        let width = lastPosition.x - startPosition.x;
        let height = lastPosition.y - startPosition.y;

        if (isShiftPressed) {
          const size = Math.min(Math.abs(width), Math.abs(height));
          width = Math.sign(width) * size;
          height = Math.sign(height) * size;
        }

        const centerX = startPosition.x + width / 2;
        const centerY = startPosition.y + height / 2;
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;

        contextRef.current.beginPath();
        contextRef.current.ellipse(
          centerX,
          centerY,
          radiusX,
          radiusY,
          0,
          0,
          2 * Math.PI
        );
        contextRef.current.stroke();
        contextRef.current.closePath();
      }
      setIsDrawing(false);
      setSnapshot(null);
    }
    setLastPosition(null);
    setStartPosition(null);
  };

  const getCursorStyle = () => {
    if (mode === MODES.RECTANGLE) {
      return "nw-resize";
    }

    if (mode === MODES.ERASER) {
      return `url(${eraserIcon}) 0 0, auto`; // Usar la imagen como cursor
    }
    return "default";
  };

  return (
    <>
      <section className="container">
        <Header />
        <Toolbar
          onModeChange={setMode}
          currentMode={mode}
          setBrushColor={setBrushColor}
          setMode={setMode}
        />
        <main>
          <canvas
            ref={canvasRef}
            width="300"
            height="200"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{ cursor: getCursorStyle() }}
            tabIndex={0}
          >
            paints
          </canvas>
        </main>
        <Footer setBrushColor={setBrushColor} />
      </section>
    </>
  );
}
