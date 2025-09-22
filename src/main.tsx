import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { OptimizationProvider } from './contexts/OptimizationContext';
import './index.css';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <StrictMode>
    <LanguageProvider>
      <DarkModeProvider>
        <OptimizationProvider>
          <App />
        </OptimizationProvider>
      </DarkModeProvider>
    </LanguageProvider>
  </StrictMode>
);

// Fade out and remove splash once React has mounted
window.requestAnimationFrame(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  }
});
