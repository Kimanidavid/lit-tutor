import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  citations: [{
    chapterIndex: { type: Number },
    excerpt: { type: String }
  }]
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  thesis: { type: String },
  outline: [SectionSchema],
  references: [{ type: String }], // bibliography or web refs if allowed
  aiAssisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);