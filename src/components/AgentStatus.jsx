export default function AgentStatus({ status }) {
    return (
      <div className="p-4 rounded-2xl shadow bg-white text-black w-full max-w-md mx-auto mt-8 text-center">
        <h2 className="text-xl font-bold mb-2">Agent Status</h2>
        <p className="text-lg">{status || "Waiting for input..."}</p>
      </div>
    );
  }