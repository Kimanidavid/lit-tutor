import mongoose from 'mongoose';

const OralLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['proverbs', 'folktales', 'riddles', 'songs', 'chants'], required: true },
  content: { type: String, required: true },
  examples: [{ type: String }],
  region: { type: String }, // e.g., Kikuyu, Luo
  glossary: [{ term: String, definition: String }],
  quiz: [{
    question: String,
    choices: [String],
    answerIndex: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('OralLesson', OralLessonSchema);