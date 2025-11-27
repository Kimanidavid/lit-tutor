import express from 'express';
import Review from '../models/Review.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const review = await Review.create(req.body);
  res.json(review);
});
router.get('/', async (req, res) => {
  const { userId, bookId } = req.query;
  const reviews = await Review.find({ userId, bookId });
  res.json(reviews);
});

export default router;