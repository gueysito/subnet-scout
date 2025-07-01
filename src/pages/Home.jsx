import { useState } from "react";
import ApiTester from "../components/ApiTester.jsx";
import ScoreAgentDemo from "../components/ScoreAgentDemo.jsx";

export default function Home() {
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Claude Query Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-4">Query Claude</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
          {reply && (
            <div className="mt-4 p-4 bg-gray-700 text-white rounded-xl border border-gray-600">
              <p className="text-lg">{reply}</p>
            </div>
          )}
        </div>
      </div>

      {/* API Testing Section */}
      <ApiTester />

      {/* ScoreAgent Demo Section */}
      <ScoreAgentDemo />

      {/* Quick Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-medium mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">118</div>
            <div className="text-xs text-gray-400">Total Subnets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">327K+</div>
            <div className="text-xs text-gray-400">io.net Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">90%</div>
            <div className="text-xs text-gray-400">Cost Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">&lt;60s</div>
            <div className="text-xs text-gray-400">Full Scan</div>
          </div>
        </div>
      </div>
    </div>
  );
}