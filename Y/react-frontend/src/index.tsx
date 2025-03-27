import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure you have an App.tsx file


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
