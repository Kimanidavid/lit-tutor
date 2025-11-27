import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  chapterIndex: { type: Number },
  selection: {
    start: { type: Number }, // char offset
    end: { type: Number },
    excerpt: { type: String }
  },
  content: { type: String, required: true }, // student's commentary
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Note', NoteSchema);