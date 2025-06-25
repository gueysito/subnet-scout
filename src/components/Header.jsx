import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md mb-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🚀 Subnet Scout
        </h1>
        <nav className="space-x-6">
          <Link to="/" className="text-blue-400 hover:text-white">Home</Link>
          <Link to="/explore" className="text-blue-400 hover:text-white">Explore</Link>
          <Link to="/about" className="text-blue-400 hover:text-white">About</Link>
        </nav>
      </div>
    </header>
  );
}