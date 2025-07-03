import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

console.log('🚀 Initializing Subnet Scout with all features...');

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  console.log('✅ Subnet Scout loaded with React Router!');
} else {
  console.error('❌ Root element not found!');
}