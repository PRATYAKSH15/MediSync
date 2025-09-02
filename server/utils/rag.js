import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { vectorStore } from "./vectorStore.js";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
  temperature: 0.2,
});

export const getAnswerFromRAG = async (query) => {
  const retriever = vectorStore.asRetriever({ k: 3 });
  const chain = RetrievalQAChain.fromLLM(model, retriever);

  const result = await chain.invoke({ query });
  return result.text;
};
