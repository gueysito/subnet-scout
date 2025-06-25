import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';
import AgentStatus from './components/AgentStatus';

const App = () => {
  const [status, setStatus] = useState("Ready");
  const [prompt, setPrompt] = useState("");

  const handlePing = async () => {
    setStatus("Thinking...");

    try {
      const res = await fetch("http://localhost:8080/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt }),
      });

      const data = await res.json();
      setStatus(data.reply || "No reply");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-4">🚀 Subnet Scout</h1>
        <nav className="flex space-x-4 text-lg">
          <Link to="/" className="text-blue-400 hover:underline">Home</Link>
          <Link to="/explore" className="text-blue-400 hover:underline">Explore</Link>
          <Link to="/about" className="text-blue-400 hover:underline">About</Link>
        </nav>
      </header>

      <div className="space-y-4">
        <textarea
          rows="3"
          placeholder="Type a prompt for Claude..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handlePing}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Ask Claude
        </button>
      </div>

      <AgentStatus status={status} />

      <main>
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