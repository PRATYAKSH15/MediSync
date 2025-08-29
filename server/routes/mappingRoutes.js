import express from "express";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import OpenAI from "openai"; // ✅ fix import (not destructured)
import { searchPubMed, fetchPubMedDetails } from "../utils/pubmed.js";
import SymptomMapping from "../models/SymptomMapping.js";
import { Client } from "@googlemaps/google-maps-services-js";

const router = express.Router();
const client = new Client({});

// ✅ Utility: Ask OpenAI which doctor to consult
async function getDoctorSpecialty(symptom) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a medical triage assistant. Respond with ONLY the name of a doctor specialty (e.g., Cardiologist, Dermatologist, Neurologist).",
      },
      {
        role: "user",
        content: `A patient reports the symptom: "${symptom}". Which doctor should they consult?`,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
}

// ✅ Main symptom route
router.post("/", async (req, res) => {
  try {
    const { symptom, lat, lng } = req.body;
    if (!symptom) {
      return res.status(400).json({ error: "Symptom is required" });
    }

    // -------------------------------
    // 1. PubMed + LangChain Summarizer
    // -------------------------------
    const ids = await searchPubMed(symptom); // ✅ search by symptom
    const pubmedDocs = await fetchPubMedDetails(ids); // ✅ fetch details

    if (pubmedDocs.length === 0) {
      return res.json({
        symptom,
        message: "No PubMed articles found",
      });
    }

    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
      pubmedDocs.map((doc) => ({
        pageContent: doc.content,
        metadata: { pmid: doc.pmid, title: doc.title },
      })),
      new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY }),
      {
        collection: "pubmed_vectors",
        indexName: "pubmed_index",
        textKey: "text",
        embeddingKey: "embedding",
      }
    );

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chain = RetrievalQAChain.fromLLM(openai, vectorStore.asRetriever());

    const pubmedAnswer = await chain.call({
      query: `Summarize causes, prevention, and treatment options for: ${symptom}`,
    });

    // -------------------------------
    // 2. Doctor Mapping + Google Maps
    // -------------------------------
    let mapping = await SymptomMapping.findOne({ symptom: new RegExp(symptom, "i") });
    if (!mapping) {
      const specialty = await getDoctorSpecialty(symptom);
      mapping = new SymptomMapping({
        symptom: symptom.toLowerCase(),
        doctorSpecialty: specialty,
      });
      await mapping.save();
    }

    let hospitals = [];
    if (lat && lng) {
      const gmaps = await client.placesNearby({
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          keyword: mapping.doctorSpecialty,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      hospitals =
        gmaps.data.results?.map((place) => ({
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          location: place.geometry?.location,
        })) || [];
    }

    // -------------------------------
    // Final Response
    // -------------------------------
    res.json({
      symptom,
      pubmedSummary: pubmedAnswer.text,
      doctorSpecialty: mapping.doctorSpecialty,
      hospitals,
    });
  } catch (err) {
    console.error("❌ Symptom route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
