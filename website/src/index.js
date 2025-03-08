import React from "react";
// Updated import for React 18
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
