import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 flex flex-col items-center justify-center text-center px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-indigo-700 leading-tight">
          Welcome to <span className="text-blue-600">MediSync</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Your AI-powered healthcare companion.  
          Instantly check your symptoms, get reliable medical insights, and find
          the right specialist near you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="px-6 py-4 text-lg rounded-2xl"
            onClick={() => navigate("/symptom")}
          >
            🩺 Start Symptom Checker
          </Button>
          <Button
            variant="outline"
            className="px-6 py-4 text-lg rounded-2xl border-indigo-600 text-indigo-600"
          >
            📖 Learn More
          </Button>
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl"
      >
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="font-bold text-indigo-600 text-lg">🔍 Symptom Checker</h3>
          <p className="text-gray-600 mt-2">
            Get instant AI-powered health insights based on your symptoms.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="font-bold text-indigo-600 text-lg">🧾 PubMed Knowledge</h3>
          <p className="text-gray-600 mt-2">
            Trusted summaries from medical research databases.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="font-bold text-indigo-600 text-lg">🏥 Nearby Hospitals</h3>
          <p className="text-gray-600 mt-2">
            Find specialists and top hospitals near your location.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
