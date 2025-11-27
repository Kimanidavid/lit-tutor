import Embedding from '../models/Embedding.js';

// naive chunker
export function chunkText(text, chunkSize = 800, overlap = 200) {
  const chunks = [];
  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// wrap your embedding API call
export async function embedText(text) {
  // return array<number>
  // call your embedding provider here
  return new Array(1536).fill(0); // placeholder; replace with actual embedding
}

// cosine similarity
function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (na * nb + 1e-9);
}

export async function searchEmbeddings(bookId, queryVector, k = 6) {
  const docs = await Embedding.find({ bookId }).limit(5000); // tune limits
  const ranked = docs
    .map(d => ({ d, score: cosine(queryVector, d.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(r => r.d);
  return ranked;
}