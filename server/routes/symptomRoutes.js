// import express from "express";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";
// import OpenAI from "openai";
// import { searchPubMed, fetchPubMedDetails } from "../utils/pubmed.js";
// import SymptomMapping from "../models/SymptomMapping.js";
// import { Client } from "@googlemaps/google-maps-services-js";

// const router = express.Router();
// const client = new Client({});

// // ✅ Utility: Ask OpenAI which doctor to consult
// async function getDoctorSpecialty(symptom) {
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a helpful assistant that maps symptoms to doctor specialties.",
//       },
//       {
//         role: "user",
//         content: `A patient reports the symptom: "${symptom}".
//         Which type of doctor (specialist) should they consult?
//         Give only the doctor specialty (like Cardiologist, Dermatologist, Neurologist, etc.).`,
//       },
//     ],
//   });

//   return response.choices[0].message.content.trim();
// }

// // ✅ Main symptom route
// router.post("/", async (req, res) => {
//   try {
//     const { symptom, lat, lng } = req.body;
//     if (!symptom) {
//       return res.status(400).json({ error: "Symptom is required" });
//     }

//     // -------------------------------
//     // 1. PubMed + LangChain Summarizer
//     // -------------------------------
//     const ids = await searchPubMed(symptom);
//     const pubmedDocs = await fetchPubMedDetails(ids);

//     const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
//       pubmedDocs.map((doc) => ({
//         pageContent: doc.content,
//         metadata: { pmid: doc.pmid, title: doc.title },
//       })),
//       new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY }),
//       {
//         collection: "pubmed_articles",
//         indexName: "pubmed_vector_index",
//         textKey: "pageContent",
//         embeddingKey: "embedding",
//       }
//     );

//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     const chain = RetrievalQAChain.fromLLM(
//       openai,
//       vectorStore.asRetriever()
//     );

//     const pubmedAnswer = await chain.call({
//       query: `Summarize causes, prevention, and treatment options for: ${symptom}`,
//     });

//     // -------------------------------
//     // 2. Doctor Mapping + Google Maps
//     // -------------------------------
//     let mapping = await SymptomMapping.findOne({
//       symptom: new RegExp(symptom, "i"),
//     });

//     if (!mapping) {
//       const specialty = await getDoctorSpecialty(symptom);
//       mapping = new SymptomMapping({
//         symptom: symptom.toLowerCase(),
//         doctorSpecialty: specialty,
//       });
//       await mapping.save();
//     }

//     let hospitals = [];
//     if (lat && lng) {
//       const gmaps = await client.placesNearby({
//         params: {
//           location: `${lat},${lng}`,
//           radius: 5000,
//           keyword: mapping.doctorSpecialty,
//           key: process.env.GOOGLE_MAPS_API_KEY,
//         },
//       });

//       hospitals = gmaps.data.results.map((place) => ({
//         name: place.name,
//         address: place.vicinity,
//         rating: place.rating,
//         location: place.geometry?.location,
//       }));
//     }

//     // -------------------------------
//     // Final Response
//     // -------------------------------
//     res.json({
//       symptom,
//       pubmedSummary: pubmedAnswer.text,
//       doctorSpecialty: mapping.doctorSpecialty,
//       hospitals,
//     });
//   } catch (err) {
//     console.error("❌ Symptom route error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;

import express from "express";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai"; // ✅ LangChain wrapper
import { searchPubMed, fetchPubMedDetails } from "../utils/pubmed.js";
import SymptomMapping from "../models/SymptomMapping.js";
import { Client } from "@googlemaps/google-maps-services-js";
import { vectorStore } from "../utils/vectorStore.js"; // ✅ use the shared vectorStore

const router = express.Router();
const client = new Client({});

// ✅ Utility: Ask OpenAI which doctor to consult
async function getDoctorSpecialty(symptom) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant that maps symptoms to doctor specialties.",
    },
    {
      role: "user",
      content: `A patient reports the symptom: "${symptom}". 
      Which type of doctor (specialist) should they consult? 
      Give only the doctor specialty (like Cardiologist, Dermatologist, Neurologist, etc.).`,
    },
  ]);

  return response.content.trim();
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
    const ids = await searchPubMed(symptom);
    const pubmedDocs = await fetchPubMedDetails(ids);

    // ✅ Add docs to existing vectorStore
    await vectorStore.addDocuments(
      pubmedDocs.map((doc) => ({
        pageContent: doc.content,
        metadata: { pmid: doc.pmid, title: doc.title },
      }))
    );

    const llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());

    const pubmedAnswer = await chain.call({
      query: `Summarize the medical information for the symptom: "${symptom}". 
         Provide a structured summary with the following sections:
         1. Causes
         2. Prevention
         3. Treatment

         Return it in JSON format like:
         {
           "causes": "...",
           "prevention": "...",
           "treatment": "..."
         }`,
    });

    // Try parsing it as JSON
    let structuredSummary = { causes: "", prevention: "", treatment: "" };
    try {
      structuredSummary = JSON.parse(pubmedAnswer.text);
    } catch (e) {
      console.warn(
        "⚠️ Could not parse structured summary, fallback to plain text"
      );
      structuredSummary = {
        causes: pubmedAnswer.text,
        prevention: "",
        treatment: "",
      };
    }

    // -------------------------------
    // 2. Doctor Mapping + Google Maps
    // -------------------------------
    let mapping = await SymptomMapping.findOne({
      symptom: new RegExp(symptom, "i"),
    });

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

      hospitals = gmaps.data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        location: place.geometry?.location,
      }));
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
