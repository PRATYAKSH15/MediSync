import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-bold text-indigo-700">MediSync</h3>
          <p className="mt-2 text-gray-600 text-sm">
            Your AI-powered healthcare companion.  
            Check symptoms, explore medical knowledge, and find doctors nearby.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-bold text-indigo-700">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
            <li><Link to="/symptom" className="hover:text-indigo-600">Symptom Checker</Link></li>
            <li><Link to="/results" className="hover:text-indigo-600">Results</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold text-indigo-700">Contact</h3>
          <p className="mt-2 text-gray-600 text-sm">
            📍 New Delhi, India  
            📧 support@medisync.com  
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} MediSync. All rights reserved.
      </div>
    </footer>
  );
}
