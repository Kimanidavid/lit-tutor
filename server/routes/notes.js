import express from 'express';
import Note from '../models/Note.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const note = await Note.create(req.body);
  res.json(note);
});
router.get('/', async (req, res) => {
  const { userId, bookId } = req.query;
  const notes = await Note.find({ userId, bookId });
  res.json(notes);
});

export default router;