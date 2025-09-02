// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";

// export default function ResultsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { symptom, lat, lng } = location.state || {};
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!symptom) {
//       navigate("/symptom");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/symptom", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ symptom, lat, lng }),
//         });
//         const result = await res.json();
//         setData(result);
//       } catch (err) {
//         console.error("❌ Error fetching results:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [symptom, lat, lng, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-lg text-indigo-600">
//         ⏳ Analyzing your symptom...
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         ❌ Something went wrong
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
//       <div className="max-w-3xl mx-auto space-y-6">
//         {/* Symptom Summary */}
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <Card className="shadow-lg rounded-2xl">
//             <CardContent className="p-6">
//               <h2 className="text-xl font-bold text-indigo-700 mb-2">
//                 Symptom: {data.symptom}
//               </h2>
//               <p className="text-gray-700 whitespace-pre-line">
//                 {data.pubmedSummary}
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Doctor Specialty */}
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
//           <Card className="shadow-lg rounded-2xl">
//             <CardContent className="p-6 text-center">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Recommended Specialist
//               </h3>
//               <p className="text-2xl font-bold text-indigo-600 mt-2">
//                 {data.doctorSpecialty}
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Nearby Hospitals */}
//         {data.hospitals?.length > 0 && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
//             <Card className="shadow-lg rounded-2xl">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                   Nearby Hospitals
//                 </h3>
//                 <div className="space-y-3">
//                   {data.hospitals.map((h, idx) => (
//                     <div
//                       key={idx}
//                       className="p-4 border rounded-xl bg-white shadow-sm"
//                     >
//                       <p className="font-bold">{h.name}</p>
//                       <p className="text-gray-600">{h.address}</p>
//                       <p className="text-yellow-600">⭐ {h.rating || "N/A"}</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}

//         <Button
//           className="w-full mt-4 py-6 text-lg"
//           onClick={() => navigate("/symptom")}
//         >
//           🔄 Search Again
//         </Button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.post("http://localhost:5000/api/mapping", {
          symptom: state.symptom,
          lat: state.lat,
          lng: state.lng,
        });
        setData(res.data);
      } catch (err) {
        console.error("❌ Error fetching results:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (state?.symptom) {
      fetchResults();
    }
  }, [state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">
        ⏳ Analyzing symptoms...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error || "No results available. Please try again."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Symptom */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-indigo-700">Symptom</h2>
            <p className="mt-2 text-gray-700">{data.symptom}</p>
          </CardContent>
        </Card>

        {/* PubMed Summary */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-indigo-700">
              Medical Insights
            </h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">
              {data.pubmedSummary}
            </p>
          </CardContent>
        </Card>

        {/* Doctor Specialty */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-indigo-700">
              Recommended Doctor
            </h2>
            <p className="mt-2 text-gray-700">{data.doctorSpecialty}</p>
          </CardContent>
        </Card>

        {/* Nearby Hospitals */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-indigo-700">
              Nearby Hospitals / Clinics
            </h2>
            {data.hospitals?.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {data.hospitals.map((h, idx) => (
                  <li
                    key={idx}
                    className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-900">{h.name}</p>
                    <p className="text-gray-600 text-sm">{h.address}</p>
                    <p className="text-yellow-600 text-sm">
                      ⭐ {h.rating || "N/A"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-600">
                No nearby hospitals found for this specialty.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => window.history.back()} className="px-6 py-2">
            🔙 Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
