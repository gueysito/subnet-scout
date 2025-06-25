import React, { useState } from "react";

const PingButton = () => {
  const [status, setStatus] = useState("Waiting...");

  const handleClick = async () => {
    setStatus("Pinging...");
    try {
      const res = await fetch("http://localhost:8080/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setStatus(data.reply || "No response");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow max-w-md mx-auto mt-8 text-center">
      <h2 className="text-xl font-bold mb-2">Claude Agent</h2>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Ping
      </button>
      <p className="mt-4 text-lg">{status}</p>
    </div>
  );
};

export default PingButton;