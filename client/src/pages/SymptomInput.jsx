import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";

export default function SymptomInput() {
  const [symptom, setSymptom] = useState("");
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  // ✅ Auto-detect location
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  };

  // ✅ Handle form submit (calls backend API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptom) return;

    try {
      const response = await axios.post("http://localhost:5000/api/mapping", {
        symptom,
        lat: location?.lat,
        lng: location?.lng,
      });

      // ✅ Pass backend result to Results page
      navigate("/results", { state: { result: response.data } });
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
      <Card className="w-[420px] shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-indigo-700 text-center"
          >
            Describe Your Symptom
          </motion.h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              placeholder="e.g. headache, chest pain..."
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="py-6 text-lg"
            />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={detectLocation}
            >
              📍 Detect My Location
            </Button>

            <Button type="submit" className="w-full py-6 text-lg">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
