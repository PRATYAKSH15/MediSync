import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Test route to check Google Places API without lat/lng
app.get("/api/test-hospitals", async (req, res) => {
  try {
    const query = "hospitals in dwarka sector 7, new delhi"; // you can change city here

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    res.json({
      message: "Google API working ✅",
      hospitals: response.data.results.slice(0, 5).map((h) => ({
        name: h.name,
        address: h.formatted_address,
        rating: h.rating,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
