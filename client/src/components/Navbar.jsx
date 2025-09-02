import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-700">
          Medi<span className="text-blue-600">Sync</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/symptom" className="hover:text-indigo-600">Symptom Checker</Link>
          <Link to="/results" className="hover:text-indigo-600">Results</Link>
        </nav>

        {/* CTA */}
        <Button asChild className="rounded-xl px-5 py-2">
          <Link to="/symptom">Start Now</Link>
        </Button>
      </div>
    </header>
  );
}
