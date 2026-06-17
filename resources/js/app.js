import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
    React.createElement(
        React.StrictMode,
        null,
        React.createElement(App),
    ),
);
