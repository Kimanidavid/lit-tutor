import mongoose from 'mongoose';

const PoemSchema = new mongoose.Schema({
  authorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  form: { type: String }, // sonnet, free verse, haiku, etc.
  generated: { type: Boolean, default: false },
  analysis: {
    meter: { type: String },
    devices: [{ type: String }],
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Poem', PoemSchema);