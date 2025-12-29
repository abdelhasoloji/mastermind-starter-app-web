import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setFaviconByEnvironment } from "./utils/favicon";

// Set favicon based on environment
setFaviconByEnvironment();

createRoot(document.getElementById("root")!).render(<App />);
