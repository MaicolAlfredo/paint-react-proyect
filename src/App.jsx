import "./App.css";
import Paints from "./components/Paints";
import paleta from "./assets/paleta.png";

function App() {
  return (
    <>
      <h1>
        <img src={paleta} alt="paleta de colores" />
        React
        <span>Paint</span>
      </h1>
      <Paints />
    </>
  );
}

export default App;
