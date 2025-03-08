import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // If you have this file

console.log('React application initializing...');

try {
  console.log('Mounting React application...');
  
  // React 18 method
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  
  console.log('React application mounted successfully');
} catch (error) {
  console.error('Failed to mount React application:', error);
}