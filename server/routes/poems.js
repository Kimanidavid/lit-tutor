import express from 'express';
import Poem from '../models/Poem.js';
import { callLLM } from '../services/llm.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const poem = await Poem.create(req.body);
  res.json(poem);
});

router.post('/generate', async (req, res) => {
  const { prompt, form, tags = [] } = req.body;
  const system = `You are a poetry generator. Write a ${form || 'free verse'} poem that is evocative and suitable for study.`;
  const { text } = await callLLM({ system, user: prompt });
  const poem = await Poem.create({
    title: `Generated: ${prompt.slice(0, 40)}`,
    body: text,
    form,
    tags,
    generated: true
  });
  res.json(poem);
});

router.get('/', async (req, res) => {
  const { q } = req.query;
  const filter = q ? { $text: { $search: q } } : {};
  const poems = await Poem.find(filter);
  res.json(poems);
});

export default router;