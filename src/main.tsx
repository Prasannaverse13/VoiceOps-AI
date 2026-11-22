import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Explicitly type the root element for clarity and safety.
const rootElement = document.getElementById('root') as HTMLElement | null;
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// Modern React 18 entry point using createRoot.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);