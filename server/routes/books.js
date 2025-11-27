import express from 'express';
import Book from '../models/Book.js';
import Embedding from '../models/Embedding.js';
import { chunkText, embedText, searchEmbeddings } from '../services/aiRetrieval.js';

const router = express.Router();

// List/search books
router.get('/', async (req, res) => {
  const { q } = req.query;
  const filter = q ? { title: new RegExp(q, 'i') } : {};
  const books = await Book.find(filter).select('title meta coverUrl description');
  res.json(books);
});

// Get full book
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Not found' });
  res.json(book);
});

// Admin: ingest book content (text -> chapters -> embeddings)
router.post('/:id/ingest', async (req, res) => {
  const { chapters } = req.body; // [{ title, content }]
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Not found' });

  book.chapters = chapters.map((c, i) => ({ index: i, title: c.title, content: c.content }));
  await book.save();

  // Create embeddings for retrieval
  for (const chapter of book.chapters) {
    const chunks = chunkText(chapter.content, 800, 200);
    for (let i = 0; i < chunks.length; i++) {
      const vector = await embedText(chunks[i]);
      await Embedding.create({
        bookId: book._id,
        chapterIndex: chapter.index,
        chunkIndex: i,
        text: chunks[i],
        vector
      });
    }
  }

  res.json({ ok: true });
});

export default router;