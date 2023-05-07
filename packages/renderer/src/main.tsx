import React from "react";
import ReactDOM from "react-dom/client";
import Launcher from "./components/Launcher";
import "normalize.css";
import "./global.scss";

// Fix TypeScript support for custom type in window
declare global {
  interface Window {
    api: {
      ipc: Electron.IpcRenderer;
    };
  }
}

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <React.StrictMode>
    <Launcher />
  </React.StrictMode>,
);
