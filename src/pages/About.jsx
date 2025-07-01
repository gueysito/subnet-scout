import React, { useState } from "react";
import ApiTester from "../components/ApiTester.jsx";
import ScoreAgentDemo from "../components/ScoreAgentDemo.jsx";

export default function About() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = async () => {
    setReply("Sending...");
    try {
      const res = await fetch("http://localhost:8080/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setReply(data.reply || "No response");
    } catch (err) {
      setReply("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Project Information */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-4">🚀 About Subnet Scout Agent</h2>
        <div className="space-y-4 text-gray-300">
          <p className="text-lg">
            Subnet Scout Agent is an AI-powered distributed monitoring system for the Bittensor ecosystem, 
            showcasing io.net's distributed computing capabilities with massive cost savings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-3">🎯 Project Goals</h3>
              <ul className="space-y-2">
                <li>• Monitor ALL 118 Bittensor subnets simultaneously</li>
                <li>• Achieve sub-60 second full network scanning</li>
                <li>• Demonstrate 83% cost savings vs traditional cloud</li>
                <li>• Showcase Ray distributed computing on io.net</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">🏆 Achievements</h3>
              <ul className="space-y-2">
                <li>• ✅ 5.37 seconds for all 118 subnets</li>
                <li>• ✅ 109x faster than traditional monitoring</li>
                <li>• ✅ 22 subnets/second throughput</li>
                <li>• ✅ 100% success rate in testing</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">🔧 Technical Stack</h3>
            <p className="text-gray-300">
              <strong>Backend:</strong> Python Ray + Node.js Express + Claude AI<br/>
              <strong>Frontend:</strong> React + Vite + Tailwind CSS<br/>
              <strong>Infrastructure:</strong> io.net Distributed GPU Network<br/>
              <strong>Data Sources:</strong> Bittensor Network + TaoStats API
            </p>
          </div>
        </div>
      </div>

      {/* Development Tools Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4">🛠️ Development & Testing Tools</h3>
        <p className="text-gray-400 mb-6">These tools are available for development and testing purposes.</p>
        
        {/* Claude Query Section */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-white mb-4">🤖 Claude AI Testing</h4>
          <div className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Test Claude AI integration..."
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Send to Claude
            </button>
            {reply && (
              <div className="mt-4 p-4 bg-gray-700 text-white rounded-xl border border-gray-600">
                <p className="text-lg">{reply}</p>
              </div>
            )}
          </div>
        </div>

        {/* API Testing Section */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-white mb-4">📡 API Testing</h4>
          <ApiTester />
        </div>

        {/* ScoreAgent Demo Section */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">🧮 Scoring Engine Demo</h4>
          <ScoreAgentDemo />
        </div>
      </div>
    </div>
  );
}