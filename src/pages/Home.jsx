import { useState } from "react";

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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-4">Query Claude</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        className="w-full p-3 rounded bg-gray-100 text-black"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Send
      </button>
      {reply && (
        <div className="mt-4 p-4 bg-white text-black rounded-xl shadow">
          <p className="text-lg">{reply}</p>
        </div>
      )}
    </div>
  );
}