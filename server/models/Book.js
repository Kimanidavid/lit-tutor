import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  title: { type: String },
  content: { type: String, required: true }, // plain text or HTML
  tokens: { type: Number }, // for AI cost control
}, { _id: false });

const MetaSchema = new mongoose.Schema({
  author: { type: String, required: true },
  year: { type: Number },
  genre: { type: String },
  language: { type: String, default: 'English' },
  tags: [{ type: String }]
}, { _id: false });

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  meta: MetaSchema,
  description: { type: String },
  coverUrl: { type: String },
  chapters: [ChapterSchema],
  characters: [{
    name: { type: String, required: true },
    description: { type: String },
    traits: [{ type: String }],
    examples: [{ type: String }] // references to passages (chapter:index:excerpt)
  }],
  themes: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Book', BookSchema);