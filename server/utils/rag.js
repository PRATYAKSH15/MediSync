import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { vectorStore } from "./vectorStore.js";

// Setup LLM
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini", // lightweight + fast
  temperature: 0.2,
});

export const getAnswerFromRAG = async (query) => {
  const retriever = vectorStore.asRetriever({ k: 3 });
  const chain = RetrievalQAChain.fromLLM(model, retriever);

  const result = await chain.invoke({ query });
  return result.text;
};
