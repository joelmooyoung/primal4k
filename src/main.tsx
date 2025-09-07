import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 Main.tsx loading with proper imports...');

try {
  console.log('🎯 Finding root element...');
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found in DOM');
  }
  
  console.log('✅ Root element found, creating React root...');
  const root = createRoot(rootElement);
  
  console.log('🏗️ Rendering App component...');
  root.render(<App />);
  
  console.log('✅ App rendered successfully!');
  
} catch (error) {
  console.error('❌ CRITICAL ERROR in main.tsx:', error);
  
  // Emergency fallback display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        padding: 20px; 
        background: #dc2626; 
        color: white; 
        font-family: Arial, sans-serif; 
        text-align: center;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <h1>🚨 App Loading Error</h1>
        <p><strong>Error:</strong> ${error?.message || 'Unknown error'}</p>
        <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
          Please check the browser console for more details.
        </p>
      </div>
    `;
  } else {
    document.body.innerHTML = `
      <div style="padding: 20px; background: #dc2626; color: white; text-align: center;">
        <h1>Critical Error: No root element found</h1>
      </div>
    `;
  }
}
