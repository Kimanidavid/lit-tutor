import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Poem from '../models/Poem.js';
import OralLesson from '../models/OralLesson.js';
import Review from '../models/Review.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lit-tutor-dev';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to', MONGODB_URI);

  // clear collections (safe for dev)
  await Promise.all([User.deleteMany({}), Book.deleteMany({}), Poem.deleteMany({}), OralLesson.deleteMany({}), Review.deleteMany({})]);

  const user = await User.create({ name: 'Jane Reader', email: 'jane@local', passwordHash: 'dev-placeholder' });

  const book = await Book.create({
    title: 'Selected Short Stories',
    meta: { author: 'Various', year: 2020, genre: 'Short fiction' },
    description: 'A curated set of short stories for classroom study.',
    chapters: [
      { index: 0, title: 'Opening', content: 'This is the opening chapter with interesting imagery.' },
      { index: 1, title: 'Turning Point', content: 'The main conflict reveals itself here.' }
    ],
    characters: [{ name: 'Protagonist', description: 'A thoughtful narrator', traits: ['reflective'], examples: ['0:1:It reads...'] }],
    themes: ['identity', 'choice']
  });

  const review = await Review.create({
    userId: user._id,
    bookId: book._id,
    thesis: 'Explores identity through narrative voice',
    outline: [{ title: 'Intro', body: 'Thesis and approach' }]
  });

  const poem = await Poem.create({ title: 'Dawn', body: 'A short poem about sunrise.', authorUserId: user._id, tags: ['nature'] });

  const oral = await OralLesson.create({ title: 'Kikuyu Proverbs — Beginnings', category: 'proverbs', content: 'Short proverbs and their meanings', examples: ['A proverb example'] });

  console.log('Seed complete —', { user: user._id.toString(), book: book._id.toString(), review: review._id.toString(), poem: poem._id.toString(), oral: oral._id.toString() });
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
