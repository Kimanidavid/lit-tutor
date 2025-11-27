import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  chapterIndex: { type: Number, default: 0 },
  position: { type: Number, default: 0 }, // char offset or percentage
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  avatarUrl: { type: String },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    fontSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' }
  },
  readingProgress: [ProgressSchema],
  savedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  savedPoems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poem' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);