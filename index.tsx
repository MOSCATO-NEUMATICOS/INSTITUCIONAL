
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register a basic Service Worker to enable PWA installation capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('data:text/javascript;base64,' + btoa(`
      self.addEventListener('install', (event) => {
        self.skipWaiting();
      });
      self.addEventListener('fetch', (event) => {
        event.respondWith(fetch(event.request));
      });
    `)).catch(err => console.log('SW registration failed:', err));
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
