/**
 * This is only a helper for developing this module locally
 * The module is exported from ./App
 */
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

const rootElement = document.getElementById("root");

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
