import React from 'react';
import { createRoot } from 'react-dom/client';  // Use named import for createRoot
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);  // Explicitly passing container to createRoot

root.render(
  <App />  // Removed StrictMode for a simpler render
);
