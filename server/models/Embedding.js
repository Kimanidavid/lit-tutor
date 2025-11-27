import mongoose from 'mongoose';

const EmbeddingSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  chapterIndex: { type: Number, required: true },
  chunkIndex: { type: Number, required: true },
  text: { type: String, required: true },
  vector: { type: [Number], required: true }, // store embedding array
  tokens: { type: Number },
}, { timestamps: true });

EmbeddingSchema.index({ bookId: 1, chapterIndex: 1, chunkIndex: 1 }, { unique: true });

export default mongoose.model('Embedding', EmbeddingSchema);