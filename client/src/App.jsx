import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-[420px] shadow-2xl rounded-2xl">
        <CardContent className="p-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-indigo-700"
          >
            MediSync
          </motion.h1>
          <p className="mt-3 text-gray-600">
            Find causes, treatments, doctors, and hospitals—instantly.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6"
          >
            <Button className="w-full text-lg py-6">Start Assessment</Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
