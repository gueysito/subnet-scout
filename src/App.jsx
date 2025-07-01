import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">🚀 Subnet Scout</h1>
            </div>
            <nav className="flex space-x-8">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/explore" 
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Explore
              </Link>
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{minHeight: 'calc(100vh - 64px)', backgroundColor: '#111827', width: '100%'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;