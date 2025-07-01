import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';
import VisualizationsComplete from './pages/VisualizationsComplete';

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Navigation Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b-2 border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Subnet Scout</h1>
                <p className="text-xs text-gray-400">io.net Powered Analytics</p>
              </div>
            </div>
            
            {/* Navigation Links - Properly Spaced */}
            <nav className="flex items-center space-x-1">
              <Link 
                to="/" 
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                🏠 Home
              </Link>
              
              <Link 
                to="/explore" 
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/explore' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                🔍 Explore
              </Link>
              
              <Link 
                to="/visualizations" 
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/visualizations' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                📊 Analytics
              </Link>
              
              <Link 
                to="/about" 
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/about' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                ℹ️ About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/visualizations" element={<VisualizationsComplete />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;